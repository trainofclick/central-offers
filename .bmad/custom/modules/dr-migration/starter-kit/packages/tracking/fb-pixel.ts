/**
 * Facebook Pixel Integration Helpers
 * Provides type-safe methods for Facebook Pixel tracking
 */

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

export type StandardEventName =
  | 'AddPaymentInfo'
  | 'AddToCart'
  | 'AddToWishlist'
  | 'CompleteRegistration'
  | 'Contact'
  | 'CustomizeProduct'
  | 'Donate'
  | 'FindLocation'
  | 'InitiateCheckout'
  | 'Lead'
  | 'Purchase'
  | 'Schedule'
  | 'Search'
  | 'StartTrial'
  | 'SubmitApplication'
  | 'Subscribe'
  | 'ViewContent';

export interface PurchaseEventParams {
  value: number;
  currency: string;
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  num_items?: number;
}

export interface LeadEventParams {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
}

export interface InitiateCheckoutParams {
  value?: number;
  currency?: string;
  content_ids?: string[];
  content_name?: string;
  num_items?: number;
}

/**
 * Initialize Facebook Pixel
 * @param pixelId - Your Facebook Pixel ID
 * @example
 * ```typescript
 * initFacebookPixel('1234567890');
 * ```
 */
export function initFacebookPixel(pixelId: string): void {
  if (typeof window === 'undefined') {
    console.warn('Facebook Pixel: Window is undefined. Skipping initialization.');
    return;
  }

  if (window.fbq) {
    console.warn('Facebook Pixel already initialized');
    return;
  }

  // Facebook Pixel base code
  const fbq: any = function () {
    if (fbq.callMethod) {
      fbq.callMethod.apply(fbq, arguments);
    } else {
      fbq.queue.push(arguments);
    }
  };

  if (!window._fbq) {
    window._fbq = fbq;
  }

  window.fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];

  // Load Facebook Pixel script
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  // Initialize pixel
  fbq('init', pixelId);
  fbq('track', 'PageView');

  console.log(`Facebook Pixel initialized: ${pixelId}`);
}

/**
 * Track a standard Facebook event
 * @param eventName - Standard event name
 * @param params - Event parameters
 * @example
 * ```typescript
 * trackStandardEvent('Purchase', {
 *   value: 99.90,
 *   currency: 'BRL',
 *   content_name: 'Product Name'
 * });
 * ```
 */
export function trackStandardEvent(
  eventName: StandardEventName,
  params?: Record<string, any>
): void {
  if (typeof window === 'undefined' || !window.fbq) {
    console.warn('Facebook Pixel not initialized');
    return;
  }

  try {
    window.fbq('track', eventName, params || {});
    console.log(`FB Pixel tracked: ${eventName}`, params);
  } catch (error) {
    console.error('Error tracking Facebook event:', error);
  }
}

/**
 * Track a custom Facebook event
 * @param eventName - Custom event name
 * @param params - Event parameters
 * @example
 * ```typescript
 * trackCustomEvent('ButtonClicked', {
 *   button_id: 'cta-1',
 *   page: 'landing'
 * });
 * ```
 */
export function trackCustomEvent(
  eventName: string,
  params?: Record<string, any>
): void {
  if (typeof window === 'undefined' || !window.fbq) {
    console.warn('Facebook Pixel not initialized');
    return;
  }

  try {
    window.fbq('trackCustom', eventName, params || {});
    console.log(`FB Pixel custom tracked: ${eventName}`, params);
  } catch (error) {
    console.error('Error tracking custom Facebook event:', error);
  }
}

/**
 * Track Purchase event with proper typing
 */
export function trackPurchase(params: PurchaseEventParams): void {
  trackStandardEvent('Purchase', params);
}

/**
 * Track Lead event with proper typing
 */
export function trackLead(params?: LeadEventParams): void {
  trackStandardEvent('Lead', params);
}

/**
 * Track InitiateCheckout event with proper typing
 */
export function trackInitiateCheckout(params?: InitiateCheckoutParams): void {
  trackStandardEvent('InitiateCheckout', params);
}

/**
 * Track ViewContent event
 */
export function trackViewContent(params?: {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
}): void {
  trackStandardEvent('ViewContent', params);
}

/**
 * Track AddToCart event
 */
export function trackAddToCart(params?: {
  content_ids?: string[];
  content_name?: string;
  value?: number;
  currency?: string;
}): void {
  trackStandardEvent('AddToCart', params);
}

/**
 * Check if Facebook Pixel is loaded and ready
 */
export function isFacebookPixelLoaded(): boolean {
  return typeof window !== 'undefined' && !!window.fbq;
}
