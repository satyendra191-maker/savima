import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 10;

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

interface RequestBody {
  message: string;
  context?: {
    path: string;
    isAdmin: boolean;
    history?: Array<{ role: string; content: string }>;
  };
}

function validateRequestBody(body: unknown): body is RequestBody {
  if (!body || typeof body !== 'object') return false;
  const { message } = body as Record<string, unknown>;
  return typeof message === 'string' && message.length > 0 && message.length <= 2000;
}

function getSystemPrompt(context?: { path: string; isAdmin: boolean }): string {
  const baseContext = `You are Saviman AI Assistant, a helpful AI for Saviman Industries - a leading manufacturer and exporter of precision Brass and Stainless Steel components. ISO 9001:2015 Certified company based in Jamnagar, Gujarat, India.

Company Information:
- Products: Brass inserts, terminals, fittings, Precision turned parts, CNC components, SS fasteners, Hydraulic fittings
- Contact: export@saviman.com, +91 95069 43134
- Location: 302, Parth A, 3/11, Patel Colony, Jamnagar-361008 Gujarat, INDIA
- Website: https://saviman.vercel.app

Be professional, concise, and helpful. Provide accurate information about products and services.`;

  if (!context) return baseContext;

  const { path, isAdmin } = context;

  if (path.startsWith('/admin') && isAdmin) {
    return `${baseContext}

You are in ADMIN MODE. You can help with:
- Creating and editing products in the CMS
- Managing inquiries and leads
- Writing CMS content and blog posts
- Analyzing data from the dashboard
- Answering questions about the admin system

Provide specific, actionable help for admin tasks. When asked to generate content, provide complete, production-ready text.`;
  }

  if (path.includes('products')) {
    return `${baseContext}

The user is browsing the products page. Focus on:
- Product categories and specifications
- Custom manufacturing capabilities
- Material options (Brass, SS, etc.)
- Getting quotes for specific products`;
  }

  if (path.includes('contact') || path.includes('rfq')) {
    return `${baseContext}

The user is on the contact/RFQ page. Focus on:
- How to request a quote
- Lead generation
- Capturing user information (name, email, company, phone)
- Follow-up process`;
  }

  return baseContext;
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    console.error(`[${requestId}] Method not allowed:`, request.method);
    return response.status(405).json({ error: 'Method not allowed', requestId });
  }

  const clientIP = request.headers['x-forwarded-for'] as string || 
                   request.headers['x-real-ip'] as string || 
                   'unknown';

  if (!checkRateLimit(clientIP)) {
    console.warn(`[${requestId}] Rate limit exceeded for IP:`, clientIP);
    return response.status(429).json({ 
      error: 'Too many requests. Please try again later.',
      retryAfter: RATE_LIMIT_WINDOW / 1000,
      requestId
    });
  }

  try {
    if (!validateRequestBody(request.body)) {
      console.warn(`[${requestId}] Invalid request body:`, request.body);
      return response.status(400).json({ error: 'Invalid request body. Message is required (1-2000 chars).', requestId });
    }

    const { message, context } = request.body;

    const trimmedMessage = message.trim();
    console.log(`[${requestId}] Processing message:`, trimmedMessage.substring(0, 100));

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error(`[${requestId}] GEMINI_API_KEY not configured`);
      return response.status(500).json({ 
        response: 'AI service is currently unavailable. Please try again later or contact support.',
        requestId
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = getSystemPrompt(context);
    
    // Build conversation history
    let fullPrompt = systemPrompt + '\n\n';
    if (context?.history && context.history.length > 0) {
      fullPrompt += 'Previous conversation:\n';
      context.history.forEach((msg) => {
        fullPrompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
      fullPrompt += '\n';
    }
    fullPrompt += `User: ${trimmedMessage}`;

    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();

    console.log(`[${requestId}] Response generated successfully`);

    return response.status(200).json({
      response: responseText,
      timestamp: Date.now(),
      requestId
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[${requestId}] AI Assistant Error:`, errorMessage);

    if (errorMessage.includes('API_KEY') || errorMessage.includes('permission')) {
      return response.status(500).json({
        response: 'AI service configuration error. Please contact support.',
        requestId
      });
    }

    return response.status(500).json({
      response: 'I apologize, but I encountered an error processing your request. Please try again.',
      requestId
    });
  }
}
