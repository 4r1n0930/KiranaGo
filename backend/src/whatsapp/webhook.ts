import { Router, Request, Response } from 'express';
import { Customer } from '../models/Customer';
import { parseMessage, formatResponse } from '../agents/conversationAgent';
import { getSession, updateSession } from '../agents/session';
import { processRequest } from '../agents/orchestrator';
import { sendMessage } from './sender';

const router = Router();

router.get('/webhook', (req: Request, res: Response): void => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('[WhatsApp Webhook] Verification succeeded');
    res.status(200).send(challenge);
  } else {
    console.warn('[WhatsApp Webhook] Verification failed - invalid token');
    res.sendStatus(403);
  }
});

router.post('/webhook', (req: Request, res: Response): void => {
  // Always respond 200 OK immediately to Meta/WhatsApp server
  res.sendStatus(200);

  // Process async pipeline in background
  (async () => {
    try {
      const body = req.body;

      const messageObj = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
      if (!messageObj || messageObj.type !== 'text') {
        return;
      }

      const senderPhone = messageObj.from;
      const messageText = messageObj.text?.body;

      if (!senderPhone || !messageText) {
        return;
      }

      console.log(`[WhatsApp Webhook] Incoming message from ${senderPhone}: "${messageText}"`);

      // Find or create Customer record
      let customer = await Customer.findOne({ phone: senderPhone });
      if (!customer) {
        const customerId = `CUST-${senderPhone}`;
        customer = await Customer.create({
          customerId,
          phone: senderPhone
        });
      }

      const customerId = customer.customerId;

      // 1. Parse incoming message with Gemini
      const structuredRequest = await parseMessage(messageText, customerId);

      // 2. Retrieve session state
      const session = getSession(customerId);

      // 3. Process request with Orchestrator
      const instruction = await processRequest(structuredRequest, session);

      // 4. Format natural language response with Gemini
      const responseText = await formatResponse(instruction);

      // 5. Send WhatsApp reply
      await sendMessage(senderPhone, responseText);

      // 6. Update session state timestamp
      updateSession(customerId, { lastUpdated: new Date() });
    } catch (err) {
      console.error('[WhatsApp Webhook] Error processing message pipeline:', err);
    }
  })();
});

export default router;
