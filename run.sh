#!/usr/bin/env bash
# KiranaGo run script - starts Mongo (local), backend, and frontend.
# Usage:
#   ./run.sh                 # local Mongo + backend + frontend dev server
#   ./run.sh --seed          # also reseed sample inventory
#   ./run.sh --atlas         # use the Atlas URI from backend/.env (USE_ATLAS=1)
#   ./run.sh --preview       # serve the production build (vite preview) instead of dev
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"
BPORT="${BPORT:-3000}"
FPORT="${FPORT:-4173}"
DB_URI_LOCAL="mongodb://localhost:27017/kiranago"
SEED=0
USE_ATLAS=0
MODE=dev

for arg in "$@"; do
  case "$arg" in
    --seed)    SEED=1 ;;
    --atlas)   USE_ATLAS=1 ;;
    --preview) MODE=preview ;;
    *) echo "unknown arg: $arg"; exit 1 ;;
  esac
done

# --- gracefully stop previously spawned instances ---
for p in "$ROOT/.backend.pid" "$ROOT/.frontend.pid"; do
  [ -f "$p" ] && kill "$(cat "$p")" 2>/dev/null || true
  rm -f "$p"
done

cleanup() {
  echo "[stop] shutting down..."
  for p in "$ROOT/.backend.pid" "$ROOT/.frontend.pid"; do
    [ -f "$p" ] && kill "$(cat "$p")" 2>/dev/null || true
    rm -f "$p"
  done
}
trap cleanup EXIT INT TERM

# --- 1. Database (local Mongo via Docker unless --atlas) ---
if [ "$USE_ATLAS" -eq 0 ]; then
  if docker ps --filter "name=kiranago-mongo" --format '{{.Names}}' | grep -qx kiranago-mongo; then
    echo "[db] kiranago-mongo already running"
    docker start kiranago-mongo >/dev/null 2>&1 || true
  else
    echo "[db] starting kiranago-mongo (mongo:7.0)..."
    docker run -d --name kiranago-mongo -p 27017:27017 \
      -v kiranago-mongo-data:/data/db mongo:7.0 >/dev/null
  fi
  sleep 3
  docker exec kiranago-mongo mongosh --quiet --eval 'db.runCommand({ping:1}).ok' >/dev/null 2>&1 \
    || { echo "[db] failed to start"; exit 1; }
  echo "[db] Mongo ready at $DB_URI_LOCAL"
fi

# --- 2. Backend ---
(cd "$BACKEND" && [ -d node_modules ] || npm install)
(cd "$BACKEND" && npm run build)          # pick up latest src (esp. Gemini model fix)

if [ "$SEED" -eq 1 ]; then
  (cd "$BACKEND" && npm run seed)
fi

echo "[backend] starting on :$BPORT ..."
(
  cd "$BACKEND"
  if [ "$USE_ATLAS" -eq 1 ]; then
    exec env PORT="$BPORT" node dist/index.js
  else
    exec env PORT="$BPORT" MONGODB_URI="$DB_URI_LOCAL" node dist/index.js
  fi
) > "$BACKEND/.run-backend.log" 2>&1 &
echo $! > "$ROOT/.backend.pid"

# --- 3. Frontend ---
(cd "$FRONTEND" && [ -d node_modules ] || npm install)
echo "[frontend] starting on :$FPORT ($MODE)..."
if [ "$MODE" = preview ]; then
  (cd "$FRONTEND" && npm run build >/dev/null 2>&1)
  (
    cd "$FRONTEND"
    exec npx vite preview --port "$FPORT" --host
  ) > "$FRONTEND/.run-frontend.log" 2>&1 &
  echo $! > "$ROOT/.frontend.pid"
else
  (
    cd "$FRONTEND"
    exec env VITE_API_URL="http://localhost:$BPORT/api" npx vite --port "$FPORT" --host
  ) > "$FRONTEND/.run-frontend.log" 2>&1 &
  echo $! > "$ROOT/.frontend.pid"
fi

sleep 7
echo ""
echo "Frontend -> http://localhost:$FPORT   (log: $FRONTEND/.run-frontend.log)"
echo "Backend  -> http://localhost:$BPORT   (log: $BACKEND/.run-backend.log)"
echo "Press Ctrl+C to stop both."
wait