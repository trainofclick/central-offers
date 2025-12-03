/**
 * UTMify Integration Helpers
 * Automatically capture and store UTM parameters for attribution tracking
 */

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  utm_id?: string;
}

export interface UTMifyConfig {
  storageKey?: string;
  expirationDays?: number;
  autoCapture?: boolean;
  includeReferrer?: boolean;
}

const DEFAULT_CONFIG: Required<UTMifyConfig> = {
  storageKey: 'utmify_params',
  expirationDays: 30,
  autoCapture: true,
  includeReferrer: true,
};

/**
 * Initialize UTMify tracking
 * Automatically captures UTM parameters from URL and stores them
 * @param config - Configuration options
 * @example
 * ```typescript
 * initUTMify({
 *   storageKey: 'my_utm_params',
 *   expirationDays: 60
 * });
 * ```
 */
export function initUTMify(config: UTMifyConfig = {}): UTMParams | null {
  if (typeof window === 'undefined') {
    console.warn('UTMify: Window is undefined. Skipping initialization.');
    return null;
  }

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  if (finalConfig.autoCapture) {
    const params = captureUTMParams();

    if (Object.keys(params).length > 0) {
      storeUTMParams(params, finalConfig);
      console.log('UTMify: Captured and stored UTM parameters', params);
      return params;
    }
  }

  // Return stored params if no new ones captured
  return getStoredUTMParams(finalConfig.storageKey);
}

/**
 * Capture UTM parameters from current URL
 * @returns Object containing UTM parameters
 */
export function captureUTMParams(): UTMParams {
  if (typeof window === 'undefined') {
    return {};
  }

  const urlParams = new URLSearchParams(window.location.search);
  const params: UTMParams = {};

  const utmKeys: (keyof UTMParams)[] = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'utm_id',
  ];

  utmKeys.forEach((key) => {
    const value = urlParams.get(key);
    if (value) {
      params[key] = value;
    }
  });

  return params;
}

/**
 * Store UTM parameters in localStorage with expiration
 * @param params - UTM parameters to store
 * @param config - Storage configuration
 */
export function storeUTMParams(
  params: UTMParams,
  config: UTMifyConfig = {}
): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    console.warn('UTMify: localStorage not available');
    return;
  }

  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + finalConfig.expirationDays);

  const dataToStore = {
    params,
    referrer: finalConfig.includeReferrer ? document.referrer : undefined,
    capturedAt: new Date().toISOString(),
    expiresAt: expirationDate.toISOString(),
  };

  try {
    localStorage.setItem(finalConfig.storageKey, JSON.stringify(dataToStore));
  } catch (error) {
    console.error('UTMify: Error storing parameters', error);
  }
}

/**
 * Get stored UTM parameters from localStorage
 * @param storageKey - Key used to store parameters
 * @returns Stored UTM parameters or null if expired/not found
 */
export function getStoredUTMParams(
  storageKey: string = DEFAULT_CONFIG.storageKey
): UTMParams | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      return null;
    }

    const data = JSON.parse(stored);
    const expiresAt = new Date(data.expiresAt);
    const now = new Date();

    // Check if expired
    if (now > expiresAt) {
      localStorage.removeItem(storageKey);
      console.log('UTMify: Stored parameters expired and removed');
      return null;
    }

    return data.params;
  } catch (error) {
    console.error('UTMify: Error retrieving parameters', error);
    return null;
  }
}

/**
 * Get all stored data including metadata
 */
export function getStoredUTMData(
  storageKey: string = DEFAULT_CONFIG.storageKey
): {
  params: UTMParams;
  referrer?: string;
  capturedAt: string;
  expiresAt: string;
} | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      return null;
    }

    const data = JSON.parse(stored);
    const expiresAt = new Date(data.expiresAt);
    const now = new Date();

    // Check if expired
    if (now > expiresAt) {
      localStorage.removeItem(storageKey);
      return null;
    }

    return data;
  } catch (error) {
    console.error('UTMify: Error retrieving data', error);
    return null;
  }
}

/**
 * Clear stored UTM parameters
 * @param storageKey - Key used to store parameters
 */
export function clearUTMParams(
  storageKey: string = DEFAULT_CONFIG.storageKey
): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  localStorage.removeItem(storageKey);
  console.log('UTMify: Parameters cleared');
}

/**
 * Append UTM parameters to a URL
 * @param url - Base URL
 * @param params - UTM parameters to append (uses stored if not provided)
 * @returns URL with UTM parameters
 * @example
 * ```typescript
 * const url = appendUTMToURL('https://example.com/checkout');
 * // Returns: https://example.com/checkout?utm_source=google&utm_medium=cpc...
 * ```
 */
export function appendUTMToURL(
  url: string,
  params?: UTMParams | null
): string {
  const utmParams = params || getStoredUTMParams();

  if (!utmParams || Object.keys(utmParams).length === 0) {
    return url;
  }

  try {
    const urlObj = new URL(url, window.location.origin);

    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) {
        urlObj.searchParams.set(key, value);
      }
    });

    return urlObj.toString();
  } catch (error) {
    console.error('UTMify: Error appending parameters to URL', error);
    return url;
  }
}

/**
 * Get UTM parameters as a query string
 * @param params - UTM parameters (uses stored if not provided)
 * @returns Query string without leading '?'
 */
export function getUTMQueryString(params?: UTMParams | null): string {
  const utmParams = params || getStoredUTMParams();

  if (!utmParams || Object.keys(utmParams).length === 0) {
    return '';
  }

  const searchParams = new URLSearchParams();
  Object.entries(utmParams).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  return searchParams.toString();
}
