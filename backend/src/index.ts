import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { dbConnect } from './db/connect';
import { startMonitor } from './monitor';
import webhookRouter from './whatsapp/webhook';
import importRouter from './import/importRouter';

async function main() {
  await dbConnect();
  const app = express();
  app.use(express.json());
  app.use('/', webhookRouter);
  app.use('/api', importRouter);
  startMonitor();
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`KiranaGo backend running on port ${port}`);
  });
}

main().catch(console.error);
