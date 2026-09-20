import { GoogleGenerativeAI } from '@google/generative-ai';
import { StructuredRequest, OrchestratorInstruction } from './types';

function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not defined.');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
}

export async function parseMessage(
  rawText: string,
  _customerId: string
): Promise<StructuredRequest> {
  const prompt = `You are a WhatsApp message parser for an Indian kirana store.
 Extract the customer intent from their message.
 Respond with valid JSON only. No explanation, no markdown, no backticks.
 Format:
 {
   "intent": "create_order" | "check_stock" | "cancel_order" | "other",
   "items": [{ "product": string, "quantity": number | null }],
   "orderId": string | null,
   "rawText": string
 }
 If quantity is not mentioned set it to null.
 Support Hindi, Hinglish, and English.
 Customer message: ${rawText}`;

  try {
    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // Strip backticks or markdown code fences
    if (text.startsWith('```')) {
      text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    }

    const parsed = JSON.parse(text);
    return {
      intent: parsed.intent || 'other',
      items: Array.isArray(parsed.items) ? parsed.items : [],
      orderId: parsed.orderId || null,
      rawText
    };
  } catch (error) {
    console.error('[ConversationAgent] Error parsing message:', error);
    // Fallback response for unparseable input
    return {
      intent: 'other',
      items: [],
      orderId: null,
      rawText
    };
  }
}

export async function formatResponse(
  instruction: OrchestratorInstruction
): Promise<string> {
  const prompt = `You are the customer-facing voice of a friendly kirana store WhatsApp assistant.
 Convert the structured instruction into a warm, natural message.
 Use Hinglish (mix of Hindi and English) by default.
 Keep it short — 1 to 3 sentences only.
 Never mention internal IDs, system errors, or technical details.
 Only include the order ID when the action is ORDER_CONFIRMED.
 Instruction: ${JSON.stringify(instruction)}`;

  try {
    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('[ConversationAgent] Error formatting response:', error);
    if (instruction.action === 'ORDER_CONFIRMED') {
      return `Aapka order confirm ho gaya hai! Order ID: ${instruction.context?.orderId}. Total: ₹${instruction.context?.total}. Dhanyawad!`;
    } else if (instruction.action === 'OUT_OF_STOCK') {
      return `Maaf kijiye, ye item abhi stock me nahi hai.`;
    } else if (instruction.action === 'ORDER_CANCELLED') {
      return `Aapka order cancel kar diya gaya hai.`;
    } else {
      return instruction.message || `Namaste! KiranaGo me aapka swagat hai. Main aapki kya madad kar sakta hu?`;
    }
  }
}