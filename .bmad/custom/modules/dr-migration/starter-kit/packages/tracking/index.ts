/**
 * Tracking Package
 * Unified exports for all tracking utilities
 */

// Facebook Pixel
export {
  initFacebookPixel,
  trackStandardEvent,
  trackCustomEvent,
  trackPurchase,
  trackLead,
  trackInitiateCheckout,
  trackViewContent,
  trackAddToCart,
  isFacebookPixelLoaded,
  type StandardEventName,
  type PurchaseEventParams,
  type LeadEventParams,
  type InitiateCheckoutParams,
} from './fb-pixel';

// UTMify
export {
  initUTMify,
  captureUTMParams,
  storeUTMParams,
  getStoredUTMParams,
  getStoredUTMData,
  clearUTMParams,
  appendUTMToURL,
  getUTMQueryString,
  type UTMParams,
  type UTMifyConfig,
} from './utmify';

// Rybbit Analytics
export {
  initRybbit,
  trackEvent,
  identifyUser,
  trackPage,
  trackConversion,
  trackPurchase as trackRybbitPurchase,
  trackFormSubmit,
  trackButtonClick,
  isRybbitReady,
  type RybbitConfig,
  type RybbitEvent,
  type UserTraits,
} from './rybbit';
