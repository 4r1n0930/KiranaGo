import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { dbConnect } from './db/connect';
import { startMonitor } from './monitor';
import webhookRouter from './whatsapp/webhook';
import importRouter from './import/importRouter';
import apiRouter from './api';

async function main() {
  await dbConnect();
const app = express();
    app.use(express.json());
    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      if (req.method === 'OPTIONS') {
        res.sendStatus(204);
        return;
      }
      next();
    });
    app.use('/', webhookRouter);
  app.use('/api', importRouter);
  app.use('/api', apiRouter);
  startMonitor();
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`KiranaGo backend running on port ${port}`);
  });
}

main().catch(console.error);
