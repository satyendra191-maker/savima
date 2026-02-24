import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const ADMIN_KEY = process.env.ADMIN_SECRET_KEY || 'saviman_admin_2024';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase configuration');
  }
  
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        'x-admin-key': ADMIN_KEY
      }
    }
  });
}

function verifyAdminKey(request: VercelRequest): boolean {
  const providedKey = request.headers['x-admin-key'] as string;
  return providedKey === ADMIN_KEY;
}

function validateRazorpaySignature(body: string, signature: string, secret: string): boolean {
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return signature === expectedSignature;
}

interface RequestBody {
  event?: string;
  payload?: Record<string, any>;
  [key: string]: any;
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const requestId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key, x-razorpay-signature, stripe-signature');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed', requestId });
  }

  console.log(`[${requestId}] Payment webhook received:`, request.url);

  try {
    const webhookType = request.query.type as string || 'razorpay';
    
    switch (webhookType) {
      case 'razorpay':
        return await handleRazorpayWebhook(request, response, requestId);
      case 'stripe':
        return await handleStripeWebhook(request, response, requestId);
      case 'paypal':
        return await handlePayPalWebhook(request, response, requestId);
      case 'upi':
        return await handleUPIWebhook(request, response, requestId);
      default:
        return response.status(400).json({ error: 'Unknown payment gateway', requestId });
    }
  } catch (error: any) {
    console.error(`[${requestId}] Webhook error:`, error.message);
    return response.status(500).json({ error: 'Webhook processing failed', requestId });
  }
}

async function handleRazorpayWebhook(
  request: VercelRequest,
  response: VercelResponse,
  requestId: string
) {
  const razorpaySecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
  const signature = request.headers['x-razorpay-signature'] as string;
  
  if (razorpaySecret && signature) {
    const body = JSON.stringify(request.body);
    if (!validateRazorpaySignature(body, signature, razorpaySecret)) {
      console.warn(`[${requestId}] Invalid Razorpay signature`);
      return response.status(400).json({ error: 'Invalid signature', requestId });
    }
  }

  const event = request.body.event;
  const payload = request.body.payload || {};
  const paymentEntity = payload.payment?.entity || {};
  
  const amount = paymentEntity.amount ? paymentEntity.amount / 100 : 0;
  const transactionId = paymentEntity.id;
  const status = paymentEntity.status;

  console.log(`[${requestId}] Razorpay event: ${event}, amount: ${amount}, status: ${status}`);

  const supabase = getSupabaseAdmin();

  switch (event) {
    case 'payment.captured':
      await processSuccessfulPayment(supabase, transactionId, amount, 'razorpay', 'payment', requestId);
      break;
      
    case 'payment.failed':
      await processFailedPayment(supabase, transactionId, 'razorpay', requestId);
      break;
      
    case 'refund.created':
      await processRefund(supabase, transactionId, 'razorpay', requestId);
      break;
      
    default:
      console.log(`[${requestId}] Unhandled Razorpay event: ${event}`);
  }

  return response.status(200).json({ received: true, requestId });
}

async function handleStripeWebhook(
  request: VercelRequest,
  response: VercelResponse,
  requestId: string
) {
  const body = request.body;
  const eventType = body.type;
  const dataObject = body.data?.object || {};
  
  const amount = dataObject.amount ? dataObject.amount / 100 : 0;
  const transactionId = dataObject.id;
  
  console.log(`[${requestId}] Stripe event: ${eventType}, amount: ${amount}`);

  const supabase = getSupabaseAdmin();

  switch (eventType) {
    case 'payment_intent.succeeded':
      await processSuccessfulPayment(supabase, transactionId, amount, 'stripe', 'payment_intent', requestId);
      break;
      
    case 'payment_intent.payment_failed':
      await processFailedPayment(supabase, transactionId, 'stripe', requestId);
      break;
      
    case 'charge.refunded':
      await processRefund(supabase, transactionId, 'stripe', requestId);
      break;
      
    default:
      console.log(`[${requestId}] Unhandled Stripe event: ${eventType}`);
  }

  return response.status(200).json({ received: true, requestId });
}

async function handlePayPalWebhook(
  request: VercelRequest,
  response: VercelResponse,
  requestId: string
) {
  const body = request.body;
  const eventType = body.event_type;
  const resource = body.resource || {};
  
  const amount = parseFloat(resource.amount?.value) || 0;
  const transactionId = resource.id;
  const status = resource.status;
  
  console.log(`[${requestId}] PayPal event: ${eventType}, amount: ${amount}, status: ${status}`);

  const supabase = getSupabaseAdmin();

  switch (eventType) {
    case 'PAYMENT.CAPTURE.COMPLETED':
    case 'CHECKOUT.ORDER.APPROVED':
      await processSuccessfulPayment(supabase, transactionId, amount, 'paypal', 'capture', requestId);
      break;
      
    case 'PAYMENT.CAPTURE.DENIED':
      await processFailedPayment(supabase, transactionId, 'paypal', requestId);
      break;
      
    default:
      console.log(`[${requestId}] Unhandled PayPal event: ${eventType}`);
  }

  return response.status(200).json({ received: true, requestId });
}

async function handleUPIWebhook(
  request: VercelRequest,
  response: VercelResponse,
  requestId: string
) {
  const body = request.body;
  
  const transactionId = body.transactionId || body.rrn;
  const amount = parseFloat(body.amount) || 0;
  const status = body.status?.toLowerCase();
  
  console.log(`[${requestId}] UPI webhook: transactionId: ${transactionId}, amount: ${amount}, status: ${status}`);

  const supabase = getSupabaseAdmin();

  if (status === 'success' || status === 'completed') {
    await processSuccessfulPayment(supabase, transactionId, amount, 'upi', 'upi', requestId);
  } else if (status === 'failed') {
    await processFailedPayment(supabase, transactionId, 'upi', requestId);
  }

  return response.status(200).json({ received: true, requestId });
}

async function processSuccessfulPayment(
  supabase: any,
  referenceId: string,
  amount: number,
  gateway: string,
  entityType: string,
  requestId: string
) {
  console.log(`[${requestId}] Processing successful payment: ${referenceId}, amount: ${amount}`);

  // Try to find order by reference
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('transaction_id', referenceId)
    .single();

  if (order) {
    await supabase
      .from('orders')
      .update({ 
        payment_status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id);
      
    // Add order tracking
    await supabase
      .from('order_tracking')
      .insert([{
        order_id: order.id,
        status: 'Payment Received',
        description: `Payment of ${amount} received via ${gateway}`,
        created_at: new Date().toISOString()
      }]);
      
    console.log(`[${requestId}] Order ${order.transaction_id} payment updated to completed`);
  }

  // Try to find donation
  const { data: donation } = await supabase
    .from('donations')
    .select('*')
    .eq('transaction_id', referenceId)
    .single();

  if (donation) {
    await supabase
      .from('donations')
      .update({ 
        payment_status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', donation.id);
      
    console.log(`[${requestId}] Donation ${donation.transaction_id} payment updated to completed`);
  }

  // Record payment transaction
  await supabase
    .from('payment_transactions')
    .insert([{
      transaction_id: `PTXN-${Date.now()}`,
      reference_id: referenceId,
      entity_type: order ? 'order' : (donation ? 'donation' : null),
      entity_id: order?.id || donation?.id,
      amount,
      gateway,
      method: entityType,
      status: 'completed',
      created_at: new Date().toISOString()
    }]);

  // Create audit log
  await supabase
    .from('audit_logs')
    .insert([{
      action: 'payment_completed',
      table_name: 'orders/donations',
      record_id: order?.id || donation?.id,
      new_values: { reference_id: referenceId, amount, gateway },
      created_at: new Date().toISOString()
    }]);
}

async function processFailedPayment(
  supabase: any,
  referenceId: string,
  gateway: string,
  requestId: string
) {
  console.log(`[${requestId}] Processing failed payment: ${referenceId}`);

  await supabase
    .from('orders')
    .update({ 
      payment_status: 'failed',
      updated_at: new Date().toISOString()
    })
    .eq('transaction_id', referenceId);

  await supabase
    .from('donations')
    .update({ 
      payment_status: 'failed',
      updated_at: new Date().toISOString()
    })
    .eq('transaction_id', referenceId);

  await supabase
    .from('payment_transactions')
    .insert([{
      transaction_id: `PTXN-${Date.now()}`,
      reference_id: referenceId,
      gateway,
      status: 'failed',
      created_at: new Date().toISOString()
    }]);
}

async function processRefund(
  supabase: any,
  referenceId: string,
  gateway: string,
  requestId: string
) {
  console.log(`[${requestId}] Processing refund: ${referenceId}`);

  await supabase
    .from('orders')
    .update({ 
      payment_status: 'refunded',
      updated_at: new Date().toISOString()
    })
    .eq('transaction_id', referenceId);

  await supabase
    .from('donations')
    .update({ 
      payment_status: 'refunded',
      updated_at: new Date().toISOString()
    })
    .eq('transaction_id', referenceId);

  await supabase
    .from('payment_transactions')
    .insert([{
      transaction_id: `PTXN-${Date.now()}`,
      reference_id: referenceId,
      gateway,
      status: 'refunded',
      created_at: new Date().toISOString()
    }]);
}
