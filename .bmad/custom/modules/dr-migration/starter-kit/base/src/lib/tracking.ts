/**
 * tracking.ts
 * Helpers para tracking (Facebook Pixel, UTMify, etc.)
 */

// Types
interface TrackingEvent {
  eventName: string;
  params?: Record<string, unknown>;
}

interface FBPixelParams {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  value?: number;
  currency?: string;
  num_items?: number;
  [key: string]: unknown;
}

// Facebook Pixel
declare global {
  interface Window {
    fbq?: (
      action: string,
      eventName: string,
      params?: FBPixelParams
    ) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Track Facebook Pixel event
 */
export function trackFBEvent(
  eventName: string,
  params?: FBPixelParams
): void {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, params);
    console.debug(`[FB Pixel] ${eventName}`, params);
  }
}

/**
 * Track Facebook Pixel custom event
 */
export function trackFBCustomEvent(
  eventName: string,
  params?: FBPixelParams
): void {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", eventName, params);
    console.debug(`[FB Pixel Custom] ${eventName}`, params);
  }
}

/**
 * Standard FB events helpers
 */
export const fbEvents = {
  pageView: () => trackFBEvent("PageView"),

  viewContent: (params: {
    contentName: string;
    contentCategory?: string;
    value?: number;
  }) =>
    trackFBEvent("ViewContent", {
      content_name: params.contentName,
      content_category: params.contentCategory,
      value: params.value,
      currency: "BRL",
    }),

  addToCart: (params: { contentName: string; value: number }) =>
    trackFBEvent("AddToCart", {
      content_name: params.contentName,
      value: params.value,
      currency: "BRL",
    }),

  initiateCheckout: (params: { value: number; numItems?: number }) =>
    trackFBEvent("InitiateCheckout", {
      value: params.value,
      currency: "BRL",
      num_items: params.numItems || 1,
    }),

  purchase: (params: { value: number; contentName?: string }) =>
    trackFBEvent("Purchase", {
      value: params.value,
      currency: "BRL",
      content_name: params.contentName,
    }),

  lead: (params?: { contentName?: string; value?: number }) =>
    trackFBEvent("Lead", {
      content_name: params?.contentName,
      value: params?.value,
      currency: "BRL",
    }),

  completeRegistration: (params?: { contentName?: string }) =>
    trackFBEvent("CompleteRegistration", {
      content_name: params?.contentName,
    }),
};

// Google Tag Manager / DataLayer
/**
 * Push event to dataLayer
 */
export function pushToDataLayer(event: Record<string, unknown>): void {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
    console.debug("[DataLayer]", event);
  }
}

/**
 * Track GTM event
 */
export function trackGTMEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  pushToDataLayer({
    event: eventName,
    ...params,
  });
}

// UTMify
/**
 * Track UTMify event
 * Note: UTMify pixel auto-tracks, but you can use this for custom events
 */
export function trackUTMifyEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  // UTMify tracking is usually automatic via their pixel
  // This is a placeholder for custom implementation
  console.debug(`[UTMify] ${eventName}`, params);
}

// Generic tracking facade
/**
 * Track event across all platforms
 */
export function trackEvent(event: TrackingEvent): void {
  const { eventName, params } = event;

  // Facebook Pixel
  trackFBEvent(eventName, params as FBPixelParams);

  // GTM DataLayer
  trackGTMEvent(eventName, params);

  // UTMify
  trackUTMifyEvent(eventName, params);
}

// Conversion tracking
/**
 * Track conversion (purchase/donation)
 */
export function trackConversion(params: {
  value: number;
  orderId?: string;
  productName?: string;
}): void {
  const { value, orderId, productName } = params;

  // Facebook
  fbEvents.purchase({ value, contentName: productName });

  // GTM
  trackGTMEvent("conversion", {
    value,
    transaction_id: orderId,
    currency: "BRL",
  });

  // UTMify
  trackUTMifyEvent("conversion", { value, orderId });
}

/**
 * Track lead capture
 */
export function trackLead(params?: {
  value?: number;
  source?: string;
}): void {
  // Facebook
  fbEvents.lead({ value: params?.value });

  // GTM
  trackGTMEvent("lead", {
    value: params?.value,
    lead_source: params?.source,
  });

  // UTMify
  trackUTMifyEvent("lead", params);
}
