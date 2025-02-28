import { NextRequest, NextResponse } from 'next/server';
import {
  processAuthWebhook,
  WebhookPayload,
} from '@/lib/actions/webhooks/auth-webhook';
// import { createHmac } from 'crypto';
// import getRawBody from 'raw-body';

// Webhook secret for verification (should match Supabase webhook settings)
// const WEBHOOK_SECRET = process.env.SEND_EMAIL_HOOK_SECRETS;

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    console.log('Received webhook');
    // Get request payload as text for HMAC verification
    // const raw = getRawBody(req.body);
    const payload = await req.text();
    const bodyString = payload;
    const bodyJson = JSON.parse(bodyString) as WebhookPayload;

    // Verify the webhook signature if a secret is configured
    // const signature = req.headers.get('webhook-signature');

    // TODO: Fix signature verification
    // if (WEBHOOK_SECRET && signature) {
    //   // Extract the secret key (remove the v1,whsec_ prefix)
    //   const secretKey = WEBHOOK_SECRET.replace('v1,whsec_', '');

    //   // Create HMAC using the secret key
    //   const calculatedSignature = createHmac('sha256', secretKey)
    //     .update(rawBody)
    //     .digest('base64');
    //   console.log('calculatedSignature', calculatedSignature);

    //   const strippedSignature = signature.replace('v1,', '');
    //   console.log('strippedSignature', strippedSignature);

    //   // Compare signatures
    //   if (calculatedSignature !== strippedSignature) {
    //     console.error('Invalid webhook signature');
    //     return NextResponse.json(
    //       { error: 'Invalid signature' },
    //       { status: 401 }
    //     );
    //   }
    // } else if (process.env.NODE_ENV === 'production') {
    //   // In production, always require a signature
    //   console.error('Missing webhook signature');
    //   return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    // }

    // Process the webhook event
    await processAuthWebhook(bodyJson);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
