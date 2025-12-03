# Tracking Package

Unified tracking utilities for Facebook Pixel, UTMify, and Rybbit Analytics.

## Installation

```bash
# Copy the tracking package to your project
cp -r packages/tracking ./src/lib/
```

## Usage

### Facebook Pixel

Track conversions and user behavior with Facebook Pixel.

```typescript
import {
  initFacebookPixel,
  trackPurchase,
  trackLead,
  trackCustomEvent,
} from './lib/tracking';

// Initialize (typically in your app entry point)
initFacebookPixel('YOUR_PIXEL_ID');

// Track standard events
trackPurchase({
  value: 99.90,
  currency: 'BRL',
  content_name: 'Premium Plan',
  content_ids: ['plan-premium'],
});

trackLead({
  content_name: 'Newsletter Signup',
  value: 0,
  currency: 'BRL',
});

// Track custom events
trackCustomEvent('VideoWatched', {
  video_id: 'intro-video',
  duration: 120,
});
```

### UTMify

Automatically capture and store UTM parameters for attribution tracking.

```typescript
import {
  initUTMify,
  getStoredUTMParams,
  appendUTMToURL,
} from './lib/tracking';

// Initialize (auto-captures UTM params from URL)
initUTMify({
  storageKey: 'my_utm_params',
  expirationDays: 60,
  autoCapture: true,
});

// Get stored UTM parameters
const utmParams = getStoredUTMParams();
console.log(utmParams);
// { utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'summer-sale' }

// Append UTM to checkout URL
const checkoutUrl = appendUTMToURL('https://example.com/checkout');
// https://example.com/checkout?utm_source=google&utm_medium=cpc...
```

### Rybbit Analytics

Track custom events and user behavior with Rybbit.

```typescript
import {
  initRybbit,
  trackEvent,
  identifyUser,
  trackPage,
  trackConversion,
} from './lib/tracking';

// Initialize
initRybbit({
  apiKey: 'your-api-key',
  debug: true,
  autoPageTracking: true,
});

// Identify user
identifyUser('user-123', {
  email: 'user@example.com',
  name: 'John Doe',
  plan: 'premium',
});

// Track custom events
trackEvent('Button Clicked', {
  button_id: 'cta-primary',
  page: 'landing',
});

// Track conversions
trackConversion('Purchase', 99.90, 'BRL', {
  product_id: '123',
  product_name: 'Premium Plan',
});

// Track page views (auto-tracked if autoPageTracking is enabled)
trackPage('Checkout');
```

## Combined Example

Initialize all tracking systems together:

```typescript
// app/layout.tsx or _app.tsx
import {
  initFacebookPixel,
  initUTMify,
  initRybbit,
} from './lib/tracking';

export default function RootLayout() {
  useEffect(() => {
    // Initialize all tracking
    initFacebookPixel(process.env.NEXT_PUBLIC_FB_PIXEL_ID!);
    initUTMify({ expirationDays: 60 });
    initRybbit({
      apiKey: process.env.NEXT_PUBLIC_RYBBIT_KEY!,
      autoPageTracking: true,
    });
  }, []);

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

Track a purchase across all platforms:

```typescript
import {
  trackPurchase as trackFBPurchase,
  trackPurchase as trackRybbitPurchase,
  getStoredUTMParams,
} from './lib/tracking';

async function handlePurchaseComplete(order: Order) {
  const utmParams = getStoredUTMParams();

  // Track in Facebook
  trackFBPurchase({
    value: order.total,
    currency: 'BRL',
    content_ids: order.items.map(i => i.id),
  });

  // Track in Rybbit with UTM attribution
  trackRybbitPurchase(
    order.id,
    order.total,
    order.items,
    { ...utmParams }
  );
}
```

## API Reference

### Facebook Pixel

- `initFacebookPixel(pixelId: string)` - Initialize Facebook Pixel
- `trackStandardEvent(event: StandardEventName, params?)` - Track standard event
- `trackCustomEvent(event: string, params?)` - Track custom event
- `trackPurchase(params: PurchaseEventParams)` - Track purchase
- `trackLead(params?: LeadEventParams)` - Track lead
- `trackInitiateCheckout(params?)` - Track checkout initiation
- `isFacebookPixelLoaded()` - Check if pixel is loaded

### UTMify

- `initUTMify(config?)` - Initialize and capture UTM params
- `captureUTMParams()` - Capture UTM from current URL
- `getStoredUTMParams()` - Get stored UTM parameters
- `appendUTMToURL(url: string)` - Append UTM to URL
- `clearUTMParams()` - Clear stored parameters

### Rybbit Analytics

- `initRybbit(config: RybbitConfig)` - Initialize Rybbit
- `trackEvent(name: string, properties?)` - Track custom event
- `identifyUser(userId: string, traits?)` - Identify user
- `trackPage(pageName?, properties?)` - Track page view
- `trackConversion(name, value, currency?, properties?)` - Track conversion
- `trackPurchase(orderId, revenue, products?, properties?)` - Track purchase
- `isRybbitReady()` - Check if Rybbit is ready

## TypeScript Support

All functions are fully typed with TypeScript. Import types as needed:

```typescript
import type {
  StandardEventName,
  PurchaseEventParams,
  UTMParams,
  RybbitConfig,
} from './lib/tracking';
```

## License

MIT
