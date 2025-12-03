# DR Migration Starter Kit - Packages

Modular, plug-and-play packages for building high-converting direct response marketing pages.

## Overview

This starter kit provides four core packages that work independently or together:

1. **Tracking** - Facebook Pixel, UTMify, and Rybbit Analytics integration
2. **Payment** - Umbrella PIX gateway integration for Brazilian payments
3. **Security** - Bot detection, cloaking filters, and anti-devtools protection
4. **UI** - React components for particles, confetti, and urgency bars

## Package Structure

```
packages/
├── tracking/           # Analytics & conversion tracking
│   ├── fb-pixel.ts    # Facebook Pixel helpers
│   ├── utmify.ts      # UTM parameter tracking
│   ├── rybbit.ts      # Rybbit Analytics integration
│   ├── index.ts       # Main export
│   └── README.md      # Documentation
│
├── payment/            # Payment processing
│   ├── types.ts       # TypeScript type definitions
│   ├── umbrella-pix.ts # PIX payment gateway
│   ├── index.ts       # Main export
│   └── README.md      # Documentation
│
├── security/           # Security & protection
│   ├── cloaking-filter.ts # Bot detection
│   ├── anti-devtools.ts   # DevTools blocking
│   ├── index.ts       # Main export
│   └── README.md      # Documentation
│
└── ui/                 # React components
    ├── particles.tsx   # Particle effects
    ├── confetti.tsx    # Confetti celebrations
    ├── urgency-bar.tsx # Countdown timers
    ├── index.ts        # Main export
    └── README.md       # Documentation
```

## Quick Start

### 1. Install Dependencies

Each package is standalone, but they're designed to work together:

```bash
# Copy packages to your project
cp -r packages/tracking ./src/lib/
cp -r packages/payment ./src/lib/
cp -r packages/security ./src/lib/
cp -r packages/ui ./src/components/
```

### 2. Initialize Tracking

```typescript
// app/layout.tsx
import { initFacebookPixel, initUTMify, initRybbit } from '@/lib/tracking';

export default function RootLayout() {
  useEffect(() => {
    initFacebookPixel(process.env.NEXT_PUBLIC_FB_PIXEL_ID!);
    initUTMify({ expirationDays: 60 });
    initRybbit({
      apiKey: process.env.NEXT_PUBLIC_RYBBIT_KEY!,
      autoPageTracking: true,
    });
  }, []);

  return <html><body>{children}</body></html>;
}
```

### 3. Setup Security

```typescript
// app/layout.tsx
import { initCloakingFilter, enableMaxProtection } from '@/lib/security';

useEffect(() => {
  // Bot detection
  initCloakingFilter({
    strictMode: false,
    redirectUrl: '/safe-page',
  });

  // Anti-devtools (production only)
  if (process.env.NODE_ENV === 'production') {
    enableMaxProtection();
  }
}, []);
```

### 4. Configure Payment

```typescript
// app/api/payment/init.ts
import { initUmbrellaPix } from '@/lib/payment';

initUmbrellaPix({
  apiKey: process.env.UMBRELLA_API_KEY!,
  apiSecret: process.env.UMBRELLA_API_SECRET,
  environment: 'production',
});
```

### 5. Add UI Components

```tsx
// app/success/page.tsx
'use client';

import { Confetti, UrgencyBar } from '@/components/ui';
import { ConfettiPresets, UrgencyBarPresets } from '@/components/ui';

export default function SuccessPage() {
  const [celebrate, setCelebrate] = useState(true);

  return (
    <>
      <Confetti trigger={celebrate} {...ConfettiPresets.realistic} />

      <UrgencyBar
        {...UrgencyBarPresets.flash_sale}
        message="⚡ Add Premium - 50% OFF for 10 minutes!"
        duration={600000}
      />

      <div>
        <h1>Purchase Complete!</h1>
        <p>Thank you for your order.</p>
      </div>
    </>
  );
}
```

## Complete Example

Here's a complete direct response landing page using all packages:

```tsx
// app/offer/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  initFacebookPixel,
  initUTMify,
  initRybbit,
  trackViewContent,
  trackLead,
  getStoredUTMParams,
} from '@/lib/tracking';
import {
  initCloakingFilter,
  setupInteractionTracking,
} from '@/lib/security';
import { createPixPayment } from '@/lib/payment';
import { Confetti, UrgencyBar, UrgencyBarPresets } from '@/components/ui';

export default function OfferPage() {
  const [isProtected, setIsProtected] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Initialize tracking
    initFacebookPixel(process.env.NEXT_PUBLIC_FB_PIXEL_ID!);
    initUTMify({ expirationDays: 60 });
    initRybbit({
      apiKey: process.env.NEXT_PUBLIC_RYBBIT_KEY!,
      autoPageTracking: true,
    });

    // Track page view
    trackViewContent({
      content_name: 'Premium Offer',
      value: 99.90,
      currency: 'BRL',
    });

    // Setup security
    initCloakingFilter({
      strictMode: false,
      redirectUrl: '/safe-page',
      onBotDetected: (reason) => {
        console.log('Bot detected:', reason);
      },
    });
    setupInteractionTracking();
    setIsProtected(true);
  }, []);

  const handlePurchase = async () => {
    // Track lead
    trackLead({
      content_name: 'Premium Offer',
      value: 99.90,
      currency: 'BRL',
    });

    // Get UTM params for attribution
    const utmParams = getStoredUTMParams();

    // Create payment
    const result = await createPixPayment({
      amount: 99.90,
      description: 'Premium Plan',
      expirationMinutes: 15,
      metadata: {
        orderId: `order-${Date.now()}`,
        customerEmail: 'customer@example.com',
        ...utmParams,
      },
    });

    if (result.success) {
      // Show payment QR code
      console.log('Payment created:', result.payment);
      setShowConfetti(true);
    }
  };

  if (!isProtected) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Confetti trigger={showConfetti} />

      <UrgencyBar
        {...UrgencyBarPresets.flash_sale}
        message="🔥 Limited Time - 50% OFF!"
        duration={3600000} // 1 hour
      />

      <main>
        <h1>Premium Offer</h1>
        <p>Get instant access for only R$ 99.90</p>
        <button onClick={handlePurchase}>
          Buy Now
        </button>
      </main>
    </>
  );
}
```

## Package Details

### Tracking Package

Track conversions and user behavior across multiple platforms:

- Facebook Pixel for conversion tracking
- UTMify for attribution tracking
- Rybbit Analytics for custom events

[View Tracking Documentation](./tracking/README.md)

### Payment Package

Process PIX payments through Umbrella gateway:

- Generate QR codes
- Check payment status
- Poll for payment completion
- Handle webhooks

[View Payment Documentation](./payment/README.md)

### Security Package

Protect your landing pages from bots and scrapers:

- Bot detection and filtering
- Browser fingerprinting
- Anti-devtools protection
- Interaction tracking

[View Security Documentation](./security/README.md)

### UI Package

React components for high-converting pages:

- Particles for celebration effects
- Confetti for success states
- Urgency bars for countdown timers

[View UI Documentation](./ui/README.md)

## Environment Variables

Create a `.env.local` file with your credentials:

```env
# Tracking
NEXT_PUBLIC_FB_PIXEL_ID=your_pixel_id
NEXT_PUBLIC_RYBBIT_KEY=your_rybbit_key

# Payment
UMBRELLA_API_KEY=your_api_key
UMBRELLA_API_SECRET=your_api_secret
UMBRELLA_ENVIRONMENT=production

# App
NODE_ENV=production
```

## TypeScript Support

All packages are fully typed with TypeScript. Import types as needed:

```typescript
import type {
  // Tracking
  StandardEventName,
  PurchaseEventParams,
  UTMParams,
  RybbitConfig,

  // Payment
  PixPayment,
  PaymentStatus,
  PaymentMetadata,

  // Security
  BotDetectionConfig,
  DetectionResult,

  // UI
  ParticlesConfig,
  ConfettiConfig,
  UrgencyBarProps,
} from '@/lib/tracking';
```

## Best Practices

### 1. Initialize Once

Initialize tracking and security in your root layout:

```tsx
// app/layout.tsx
'use client';

import { useEffect } from 'react';
import { initFacebookPixel, initUTMify } from '@/lib/tracking';
import { initCloakingFilter } from '@/lib/security';

export default function RootLayout({ children }) {
  useEffect(() => {
    // Initialize once on mount
    initFacebookPixel(process.env.NEXT_PUBLIC_FB_PIXEL_ID!);
    initUTMify();
    initCloakingFilter({ redirectUrl: '/safe-page' });
  }, []);

  return <html><body>{children}</body></html>;
}
```

### 2. Track Events at Key Points

Track user actions throughout the funnel:

```typescript
// View content
trackViewContent({ content_name: 'Product Page' });

// Add to cart
trackAddToCart({ value: 99.90, currency: 'BRL' });

// Initiate checkout
trackInitiateCheckout({ value: 99.90, currency: 'BRL' });

// Purchase
trackPurchase({ value: 99.90, currency: 'BRL' });
```

### 3. Use Security in Production Only

Enable strict security measures only in production:

```typescript
if (process.env.NODE_ENV === 'production') {
  enableMaxProtection({
    redirectUrl: '/blocked',
  });
}
```

### 4. Handle Payment Errors

Always handle payment errors gracefully:

```typescript
try {
  const result = await createPixPayment({ amount: 99.90 });

  if (!result.success) {
    console.error('Payment error:', result.error);
    // Show error message to user
  }
} catch (error) {
  console.error('Payment exception:', error);
  // Show error message to user
}
```

### 5. Test with Different Scenarios

Test your implementation with:

- Different browsers and devices
- With and without UTM parameters
- With bot user agents
- With DevTools open/closed
- Different payment amounts

## Performance Optimization

### 1. Lazy Load UI Components

```tsx
import dynamic from 'next/dynamic';

const Confetti = dynamic(() => import('@/components/ui').then(m => m.Confetti), {
  ssr: false,
});
```

### 2. Reduce Particle Count on Mobile

```tsx
const isMobile = window.innerWidth < 768;

<Particles
  count={isMobile ? 50 : 150}
  duration={isMobile ? 2000 : 4000}
/>
```

### 3. Use Polling Wisely

```typescript
// Poll with reasonable intervals
pollPaymentStatus(txid, {
  interval: 3000, // 3 seconds
  timeout: 300000, // 5 minutes
});
```

## Troubleshooting

### Tracking not working

- Check if scripts are blocked by ad blockers
- Verify API keys are correct
- Check browser console for errors
- Test in incognito mode

### Payment failing

- Verify API credentials
- Check network requests
- Ensure amount is valid
- Test in sandbox mode first

### Security blocking legitimate users

- Reduce strictMode sensitivity
- Add custom user agent exceptions
- Check fingerprint collision
- Test with real users

### UI components not rendering

- Verify 'use client' directive
- Check canvas support in browser
- Ensure components are imported in client components
- Check for z-index conflicts

## Support

For issues or questions:

1. Check individual package README files
2. Review code examples
3. Test with minimal configuration
4. Enable debug mode for detailed logging

## License

MIT - Feel free to use in commercial projects.

## Credits

Built for the Central X DR Migration project.
