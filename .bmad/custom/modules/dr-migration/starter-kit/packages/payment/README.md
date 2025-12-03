# Payment Package

Payment processing utilities for Umbrella PIX gateway integration.

## Installation

```bash
# Copy the payment package to your project
cp -r packages/payment ./src/lib/
```

## Usage

### Initialize

```typescript
import { initUmbrellaPix } from './lib/payment';

// Initialize with your API credentials
initUmbrellaPix({
  apiKey: process.env.UMBRELLA_API_KEY!,
  apiSecret: process.env.UMBRELLA_API_SECRET,
  environment: 'production', // or 'sandbox'
  webhookUrl: 'https://yoursite.com/api/webhooks/payment',
  timeout: 30000,
});
```

### Create PIX Payment

```typescript
import { createPixPayment } from './lib/payment';

const result = await createPixPayment({
  amount: 99.90,
  description: 'Premium Plan - Monthly Subscription',
  expirationMinutes: 15,
  metadata: {
    orderId: 'order-123',
    customerEmail: 'customer@example.com',
    customerName: 'John Doe',
    products: [
      {
        id: 'plan-premium',
        name: 'Premium Plan',
        quantity: 1,
        price: 99.90,
      },
    ],
  },
});

if (result.success && result.payment) {
  const { qrCode, qrCodeBase64, txid, expiresAt } = result.payment;

  // Display QR code to user
  console.log('PIX QR Code:', qrCode);
  console.log('Transaction ID:', txid);
  console.log('Expires at:', expiresAt);
}
```

### Check Payment Status

```typescript
import { checkPaymentStatus } from './lib/payment';

const status = await checkPaymentStatus({
  txid: 'txid-123'
});

if (status.success) {
  console.log('Payment status:', status.status);

  if (status.status === 'approved') {
    console.log('Payment approved at:', status.paidAt);
    // Fulfill order
  }
}
```

### Poll Payment Status

Continuously check payment status until it's completed:

```typescript
import { pollPaymentStatus } from './lib/payment';

try {
  const result = await pollPaymentStatus('txid-123', {
    interval: 3000, // Check every 3 seconds
    timeout: 300000, // Stop after 5 minutes
    onStatusChange: (status) => {
      console.log('Status changed to:', status);
      // Update UI
    },
  });

  if (result.status === 'approved') {
    // Payment successful
  }
} catch (error) {
  console.error('Payment failed or timed out:', error);
}
```

### Cancel Payment

```typescript
import { cancelPayment } from './lib/payment';

const cancelled = await cancelPayment('txid-123');
if (cancelled) {
  console.log('Payment cancelled successfully');
}
```

### Refund Payment

```typescript
import { refundPayment } from './lib/payment';

const refund = await refundPayment({
  txid: 'txid-123',
  amount: 99.90, // Optional: partial refund
  reason: 'Customer request',
});

if (refund.success) {
  console.log('Refund ID:', refund.refundId);
  console.log('Refunded amount:', refund.amount);
}
```

## Next.js Example

### API Route for Creating Payment

```typescript
// app/api/payment/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createPixPayment } from '@/lib/payment';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, orderId, customerEmail } = body;

    const result = await createPixPayment({
      amount,
      description: `Order ${orderId}`,
      expirationMinutes: 15,
      metadata: {
        orderId,
        customerEmail,
      },
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result.payment);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### API Route for Checking Status

```typescript
// app/api/payment/status/[txid]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { checkPaymentStatus } from '@/lib/payment';

export async function GET(
  request: NextRequest,
  { params }: { params: { txid: string } }
) {
  try {
    const result = await checkPaymentStatus({
      txid: params.txid
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: result.status,
      paidAt: result.paidAt,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### Webhook Handler

```typescript
// app/api/webhooks/payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/payment';
import type { PaymentWebhookData } from '@/lib/payment';

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-webhook-signature') || '';
    const payload = await request.text();

    // Verify webhook signature
    if (!verifyWebhookSignature(payload, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const data: PaymentWebhookData = JSON.parse(payload);

    // Handle payment status update
    if (data.status === 'approved') {
      // Fulfill order
      console.log('Payment approved:', data.txid);
      // Update database, send confirmation email, etc.
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### React Component

```typescript
// components/PixPayment.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

export function PixPayment({ amount }: { amount: number }) {
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('idle');

  const createPayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          orderId: `order-${Date.now()}`,
          customerEmail: 'customer@example.com',
        }),
      });

      const data = await response.json();
      setPayment(data);
      startPolling(data.txid);
    } catch (error) {
      console.error('Error creating payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (txid: string) => {
    const interval = setInterval(async () => {
      const response = await fetch(`/api/payment/status/${txid}`);
      const data = await response.json();

      setStatus(data.status);

      if (data.status === 'approved') {
        clearInterval(interval);
        // Show success message
      }
    }, 3000);
  };

  return (
    <div>
      {!payment ? (
        <button onClick={createPayment} disabled={loading}>
          {loading ? 'Creating...' : 'Pay with PIX'}
        </button>
      ) : (
        <div>
          <h3>Scan QR Code to Pay</h3>
          <Image
            src={payment.qrCodeBase64}
            alt="PIX QR Code"
            width={300}
            height={300}
          />
          <p>PIX Code: {payment.qrCode}</p>
          <p>Status: {status}</p>
          <p>Expires at: {new Date(payment.expiresAt).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
```

## Error Handling

The package includes typed errors for better error handling:

```typescript
import {
  createPixPayment,
  PaymentValidationError,
  PaymentTimeoutError,
  PaymentProcessingError,
  PaymentNotFoundError,
} from './lib/payment';

try {
  const result = await createPixPayment({ amount: 99.90 });
} catch (error) {
  if (error instanceof PaymentValidationError) {
    console.error('Validation error:', error.message);
  } else if (error instanceof PaymentTimeoutError) {
    console.error('Request timed out');
  } else if (error instanceof PaymentProcessingError) {
    console.error('Processing error:', error.details);
  }
}
```

## TypeScript Support

All functions and types are fully typed:

```typescript
import type {
  PixPayment,
  PaymentStatus,
  PaymentMetadata,
  CreatePixPaymentRequest,
  CheckPaymentStatusResponse,
} from './lib/payment';
```

## Environment Variables

```env
UMBRELLA_API_KEY=your_api_key
UMBRELLA_API_SECRET=your_api_secret
UMBRELLA_ENVIRONMENT=production
```

## License

MIT
