/**
 * Cloaking Filter
 * Bot detection and filtering logic to protect landing pages
 */

export interface BotDetectionConfig {
  enableUserAgentCheck?: boolean;
  enableIPCheck?: boolean;
  enableBehaviorCheck?: boolean;
  customUserAgents?: string[];
  customIPs?: string[];
  strictMode?: boolean;
  onBotDetected?: (reason: string) => void;
}

export interface DetectionResult {
  isBot: boolean;
  reasons: string[];
  confidence: number; // 0-1
}

const DEFAULT_CONFIG: Required<BotDetectionConfig> = {
  enableUserAgentCheck: true,
  enableIPCheck: false,
  enableBehaviorCheck: true,
  customUserAgents: [],
  customIPs: [],
  strictMode: false,
  onBotDetected: () => {},
};

// Known bot user agent patterns
const BOT_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'telegram',
  'discord',
  'slack',
  'bot',
  'crawler',
  'spider',
  'scraper',
  'headless',
  'phantom',
  'selenium',
  'puppeteer',
  'playwright',
];

// Known cloud/datacenter IP ranges (simplified)
const DATACENTER_IPS = [
  '35.', // Google Cloud
  '34.', // Google Cloud
  '104.', // Cloudflare
  '172.', // AWS (partial)
  '3.', // AWS
  '13.', // AWS
  '18.', // AWS
];

/**
 * Detect if current visitor is a bot
 * @param config - Detection configuration
 * @returns Detection result with confidence score
 * @example
 * ```typescript
 * const result = detectBot({
 *   enableUserAgentCheck: true,
 *   enableBehaviorCheck: true,
 *   strictMode: false,
 * });
 *
 * if (result.isBot) {
 *   console.log('Bot detected:', result.reasons);
 *   window.location.href = '/safe-page';
 * }
 * ```
 */
export function detectBot(config: BotDetectionConfig = {}): DetectionResult {
  if (typeof window === 'undefined') {
    return { isBot: false, reasons: [], confidence: 0 };
  }

  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const reasons: string[] = [];
  let confidence = 0;

  // User Agent Check
  if (finalConfig.enableUserAgentCheck) {
    const uaResult = checkUserAgent(finalConfig);
    if (uaResult.isBot) {
      reasons.push(...uaResult.reasons);
      confidence += 0.4;
    }
  }

  // Behavior Check
  if (finalConfig.enableBehaviorCheck) {
    const behaviorResult = checkBehavior();
    if (behaviorResult.isBot) {
      reasons.push(...behaviorResult.reasons);
      confidence += 0.3;
    }
  }

  // Browser Features Check
  const featuresResult = checkBrowserFeatures();
  if (featuresResult.isBot) {
    reasons.push(...featuresResult.reasons);
    confidence += 0.3;
  }

  const isBot = finalConfig.strictMode
    ? confidence > 0
    : confidence >= 0.5;

  if (isBot && finalConfig.onBotDetected) {
    finalConfig.onBotDetected(reasons.join(', '));
  }

  return {
    isBot,
    reasons,
    confidence: Math.min(confidence, 1),
  };
}

/**
 * Check user agent for bot patterns
 */
function checkUserAgent(config: Required<BotDetectionConfig>): DetectionResult {
  const ua = navigator.userAgent.toLowerCase();
  const reasons: string[] = [];

  // Check against known bot patterns
  const botPatterns = [...BOT_USER_AGENTS, ...config.customUserAgents];

  for (const pattern of botPatterns) {
    if (ua.includes(pattern.toLowerCase())) {
      reasons.push(`User agent matches bot pattern: ${pattern}`);
    }
  }

  // Check for headless browser indicators
  if (ua.includes('headless')) {
    reasons.push('Headless browser detected');
  }

  return {
    isBot: reasons.length > 0,
    reasons,
    confidence: reasons.length > 0 ? 1 : 0,
  };
}

/**
 * Check browser behavior for bot indicators
 */
function checkBehavior(): DetectionResult {
  const reasons: string[] = [];

  // Check if WebDriver is present (automation tools)
  if (navigator.webdriver) {
    reasons.push('WebDriver detected (automation tool)');
  }

  // Check for common automation properties
  if ((window as any).__nightmare) {
    reasons.push('Nightmare.js detected');
  }

  if ((window as any).__phantomas) {
    reasons.push('PhantomJS detected');
  }

  if ((window as any).callPhantom || (window as any)._phantom) {
    reasons.push('PhantomJS properties detected');
  }

  // Check for unusual window dimensions
  if (window.outerWidth === 0 || window.outerHeight === 0) {
    reasons.push('Suspicious window dimensions');
  }

  return {
    isBot: reasons.length > 0,
    reasons,
    confidence: reasons.length > 0 ? 0.8 : 0,
  };
}

/**
 * Check browser features for bot indicators
 */
function checkBrowserFeatures(): DetectionResult {
  const reasons: string[] = [];

  // Check for missing common browser features
  if (!navigator.languages || navigator.languages.length === 0) {
    reasons.push('No browser languages detected');
  }

  // Check for plugin indicators
  if (navigator.plugins.length === 0) {
    reasons.push('No browser plugins detected');
  }

  // Check for unusual platform
  if (!navigator.platform) {
    reasons.push('No platform information');
  }

  // Check for missing browser APIs
  if (!window.requestAnimationFrame) {
    reasons.push('Missing requestAnimationFrame API');
  }

  // Check permissions API
  if (!navigator.permissions) {
    reasons.push('Missing permissions API');
  }

  return {
    isBot: reasons.length >= 3, // Multiple missing features indicate bot
    reasons,
    confidence: reasons.length >= 3 ? 0.6 : 0,
  };
}

/**
 * Check if IP is from a datacenter (requires IP from backend)
 * @param ip - IP address to check
 */
export function isDatacenterIP(ip: string): boolean {
  if (!ip) return false;

  // Check against known datacenter ranges
  for (const prefix of DATACENTER_IPS) {
    if (ip.startsWith(prefix)) {
      return true;
    }
  }

  return false;
}

/**
 * Initialize cloaking protection
 * Automatically redirects bots to a safe page
 * @param config - Detection and redirect configuration
 * @example
 * ```typescript
 * initCloakingFilter({
 *   strictMode: false,
 *   redirectUrl: '/safe-page',
 *   onBotDetected: (reason) => {
 *     console.log('Bot detected and redirected:', reason);
 *   }
 * });
 * ```
 */
export function initCloakingFilter(
  config: BotDetectionConfig & { redirectUrl?: string } = {}
): void {
  if (typeof window === 'undefined') {
    return;
  }

  const result = detectBot(config);

  if (result.isBot) {
    console.log('Bot detected:', result.reasons);

    if (config.redirectUrl) {
      window.location.href = config.redirectUrl;
    }
  }
}

/**
 * Advanced bot detection with fingerprinting
 * Generates a unique fingerprint to track suspicious patterns
 */
export function generateFingerprint(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const components = [
    navigator.userAgent,
    navigator.language,
    navigator.platform,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 0,
    navigator.deviceMemory || 0,
  ];

  // Simple hash function
  const str = components.join('|');
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36);
}

/**
 * Check if request is suspicious based on behavior patterns
 * Should be called after user interaction
 */
export function checkUserInteraction(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check if user has interacted with the page
  const hasScrolled = window.scrollY > 0;
  const hasClicked = document.querySelectorAll('a[data-clicked]').length > 0;
  const hasMoved = document.body.dataset.mouseMoved === 'true';

  return hasScrolled || hasClicked || hasMoved;
}

/**
 * Setup interaction tracking
 * Call this on page load to track user behavior
 */
export function setupInteractionTracking(): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Track mouse movement
  let mouseMoved = false;
  document.addEventListener('mousemove', () => {
    if (!mouseMoved) {
      mouseMoved = true;
      document.body.dataset.mouseMoved = 'true';
    }
  }, { once: true });

  // Track clicks
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A') {
      target.dataset.clicked = 'true';
    }
  });
}

/**
 * Get comprehensive bot detection report
 */
export function getBotDetectionReport(
  config: BotDetectionConfig = {}
): {
  result: DetectionResult;
  fingerprint: string;
  userInteracted: boolean;
  userAgent: string;
  platform: string;
  languages: string[];
  screenResolution: string;
} {
  const result = detectBot(config);

  return {
    result,
    fingerprint: generateFingerprint(),
    userInteracted: checkUserInteraction(),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    languages: navigator.languages ? Array.from(navigator.languages) : [],
    screenResolution: `${screen.width}x${screen.height}`,
  };
}
