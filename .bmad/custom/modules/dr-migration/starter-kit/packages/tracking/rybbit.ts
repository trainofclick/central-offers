/**
 * Rybbit Analytics Integration Helpers
 * Track custom events and user behavior with Rybbit
 */

declare global {
  interface Window {
    rybbit?: {
      track: (eventName: string, properties?: Record<string, any>) => void;
      identify: (userId: string, traits?: Record<string, any>) => void;
      page: (pageName?: string, properties?: Record<string, any>) => void;
    };
  }
}

export interface RybbitConfig {
  apiKey: string;
  debug?: boolean;
  autoPageTracking?: boolean;
}

export interface RybbitEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: string;
}

export interface UserTraits {
  email?: string;
  name?: string;
  phone?: string;
  createdAt?: string;
  [key: string]: any;
}

let isInitialized = false;
let config: RybbitConfig | null = null;

/**
 * Initialize Rybbit Analytics
 * @param rybbitConfig - Configuration with API key
 * @example
 * ```typescript
 * initRybbit({
 *   apiKey: 'your-api-key',
 *   debug: true,
 *   autoPageTracking: true
 * });
 * ```
 */
export function initRybbit(rybbitConfig: RybbitConfig): void {
  if (typeof window === 'undefined') {
    console.warn('Rybbit: Window is undefined. Skipping initialization.');
    return;
  }

  if (isInitialized) {
    console.warn('Rybbit already initialized');
    return;
  }

  config = rybbitConfig;

  // Load Rybbit script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://cdn.rybbit.com/analytics.js`;
  script.onload = () => {
    if (window.rybbit) {
      isInitialized = true;

      if (config?.autoPageTracking) {
        trackPage();
      }

      if (config?.debug) {
        console.log('Rybbit Analytics initialized');
      }
    }
  };
  document.head.appendChild(script);

  // Initialize basic tracking object if script hasn't loaded
  if (!window.rybbit) {
    window.rybbit = {
      track: (eventName: string, properties?: Record<string, any>) => {
        if (config?.debug) {
          console.log(`[Rybbit Mock] Track: ${eventName}`, properties);
        }
      },
      identify: (userId: string, traits?: Record<string, any>) => {
        if (config?.debug) {
          console.log(`[Rybbit Mock] Identify: ${userId}`, traits);
        }
      },
      page: (pageName?: string, properties?: Record<string, any>) => {
        if (config?.debug) {
          console.log(`[Rybbit Mock] Page: ${pageName}`, properties);
        }
      },
    };
  }
}

/**
 * Track a custom event
 * @param eventName - Name of the event
 * @param properties - Event properties
 * @example
 * ```typescript
 * trackEvent('Button Clicked', {
 *   button_id: 'cta-primary',
 *   page: 'landing',
 *   value: 99.90
 * });
 * ```
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, any>
): void {
  if (typeof window === 'undefined' || !window.rybbit) {
    console.warn('Rybbit not initialized');
    return;
  }

  try {
    const eventData = {
      ...properties,
      timestamp: new Date().toISOString(),
    };

    window.rybbit.track(eventName, eventData);

    if (config?.debug) {
      console.log(`Rybbit tracked: ${eventName}`, eventData);
    }
  } catch (error) {
    console.error('Error tracking Rybbit event:', error);
  }
}

/**
 * Identify a user
 * @param userId - Unique user identifier
 * @param traits - User traits/properties
 * @example
 * ```typescript
 * identifyUser('user-123', {
 *   email: 'user@example.com',
 *   name: 'John Doe',
 *   plan: 'premium'
 * });
 * ```
 */
export function identifyUser(userId: string, traits?: UserTraits): void {
  if (typeof window === 'undefined' || !window.rybbit) {
    console.warn('Rybbit not initialized');
    return;
  }

  try {
    window.rybbit.identify(userId, traits);

    if (config?.debug) {
      console.log(`Rybbit identified user: ${userId}`, traits);
    }
  } catch (error) {
    console.error('Error identifying user in Rybbit:', error);
  }
}

/**
 * Track a page view
 * @param pageName - Name of the page
 * @param properties - Page properties
 * @example
 * ```typescript
 * trackPage('Checkout', {
 *   category: 'ecommerce',
 *   product_id: '123'
 * });
 * ```
 */
export function trackPage(
  pageName?: string,
  properties?: Record<string, any>
): void {
  if (typeof window === 'undefined' || !window.rybbit) {
    console.warn('Rybbit not initialized');
    return;
  }

  try {
    const pageData = {
      ...properties,
      path: window.location.pathname,
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
    };

    window.rybbit.page(pageName, pageData);

    if (config?.debug) {
      console.log(`Rybbit page tracked: ${pageName || 'Page View'}`, pageData);
    }
  } catch (error) {
    console.error('Error tracking page in Rybbit:', error);
  }
}

/**
 * Track conversion event with value
 * @param conversionName - Name of the conversion
 * @param value - Monetary value
 * @param currency - Currency code
 * @param properties - Additional properties
 */
export function trackConversion(
  conversionName: string,
  value: number,
  currency: string = 'BRL',
  properties?: Record<string, any>
): void {
  trackEvent('Conversion', {
    conversion_name: conversionName,
    value,
    currency,
    ...properties,
  });
}

/**
 * Track purchase/transaction
 * @param orderId - Order identifier
 * @param revenue - Total revenue
 * @param products - Array of products
 * @param properties - Additional properties
 */
export function trackPurchase(
  orderId: string,
  revenue: number,
  products?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>,
  properties?: Record<string, any>
): void {
  trackEvent('Purchase', {
    order_id: orderId,
    revenue,
    currency: 'BRL',
    products,
    ...properties,
  });
}

/**
 * Track form submission
 */
export function trackFormSubmit(
  formName: string,
  properties?: Record<string, any>
): void {
  trackEvent('Form Submitted', {
    form_name: formName,
    ...properties,
  });
}

/**
 * Track button click
 */
export function trackButtonClick(
  buttonId: string,
  buttonText?: string,
  properties?: Record<string, any>
): void {
  trackEvent('Button Clicked', {
    button_id: buttonId,
    button_text: buttonText,
    ...properties,
  });
}

/**
 * Check if Rybbit is initialized
 */
export function isRybbitReady(): boolean {
  return isInitialized && typeof window !== 'undefined' && !!window.rybbit;
}
