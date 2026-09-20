import { SessionState } from './types';

const sessions = new Map<string, SessionState>();
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

export function getSession(customerId: string): SessionState {
  const existing = sessions.get(customerId);
  const now = new Date();

  if (existing) {
    const elapsed = now.getTime() - new Date(existing.lastUpdated).getTime();
    if (elapsed > SESSION_TTL_MS) {
      const freshSession: SessionState = {
        customerId,
        lastUpdated: now
      };
      sessions.set(customerId, freshSession);
      return freshSession;
    }
    return existing;
  }

  const newSession: SessionState = {
    customerId,
    lastUpdated: now
  };

  sessions.set(customerId, newSession);
  return newSession;
}

export function updateSession(
  customerId: string,
  patch: Partial<SessionState>
): void {
  const current = getSession(customerId);
  const updated: SessionState = {
    ...current,
    ...patch,
    customerId,
    lastUpdated: new Date()
  };
  sessions.set(customerId, updated);
}

export function clearSession(customerId: string): void {
  sessions.delete(customerId);
}