/**
 * Anti-DevTools Protection
 * Detect and prevent unauthorized developer tools usage
 */

export interface AntiDevToolsConfig {
  disableRightClick?: boolean;
  disableKeyboardShortcuts?: boolean;
  disableConsole?: boolean;
  detectDevTools?: boolean;
  redirectUrl?: string;
  onDevToolsDetected?: () => void;
  debugMode?: boolean;
}

const DEFAULT_CONFIG: Required<AntiDevToolsConfig> = {
  disableRightClick: true,
  disableKeyboardShortcuts: true,
  disableConsole: false,
  detectDevTools: true,
  redirectUrl: '',
  onDevToolsDetected: () => {},
  debugMode: false,
};

let isInitialized = false;
let devToolsOpen = false;
let checkInterval: NodeJS.Timeout | null = null;

/**
 * Initialize anti-devtools protection
 * @param config - Protection configuration
 * @example
 * ```typescript
 * initAntiDevTools({
 *   disableRightClick: true,
 *   disableKeyboardShortcuts: true,
 *   detectDevTools: true,
 *   redirectUrl: '/blocked',
 *   onDevToolsDetected: () => {
 *     console.log('DevTools detected!');
 *   }
 * });
 * ```
 */
export function initAntiDevTools(config: AntiDevToolsConfig = {}): void {
  if (typeof window === 'undefined') {
    console.warn('Anti-DevTools: Window is undefined. Skipping initialization.');
    return;
  }

  if (isInitialized) {
    console.warn('Anti-DevTools already initialized');
    return;
  }

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Disable right-click
  if (finalConfig.disableRightClick) {
    disableRightClick();
  }

  // Disable keyboard shortcuts
  if (finalConfig.disableKeyboardShortcuts) {
    disableKeyboardShortcuts();
  }

  // Disable console
  if (finalConfig.disableConsole) {
    disableConsole();
  }

  // Detect DevTools
  if (finalConfig.detectDevTools) {
    startDevToolsDetection(finalConfig);
  }

  isInitialized = true;

  if (finalConfig.debugMode) {
    console.log('Anti-DevTools protection initialized');
  }
}

/**
 * Disable right-click context menu
 */
function disableRightClick(): void {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });
}

/**
 * Disable common keyboard shortcuts for DevTools
 */
function disableKeyboardShortcuts(): void {
  document.addEventListener('keydown', (e) => {
    // F12 - DevTools
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+I or Cmd+Option+I - DevTools
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+J or Cmd+Option+J - Console
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+C or Cmd+Option+C - Element Inspector
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      return false;
    }

    // Ctrl+U or Cmd+U - View Source
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
      e.preventDefault();
      return false;
    }

    // Ctrl+S or Cmd+S - Save Page
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      return false;
    }
  });
}

/**
 * Disable console methods
 */
function disableConsole(): void {
  const noop = () => {};

  // Override console methods
  (console as any).log = noop;
  (console as any).warn = noop;
  (console as any).error = noop;
  (console as any).info = noop;
  (console as any).debug = noop;
  (console as any).trace = noop;
  (console as any).dir = noop;
  (console as any).dirxml = noop;
  (console as any).group = noop;
  (console as any).groupEnd = noop;
  (console as any).time = noop;
  (console as any).timeEnd = noop;
  (console as any).assert = noop;
  (console as any).profile = noop;
}

/**
 * Detect if DevTools is open
 * Uses multiple detection methods for better accuracy
 */
function detectDevToolsOpen(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const threshold = 160;
  const widthThreshold = window.outerWidth - window.innerWidth > threshold;
  const heightThreshold = window.outerHeight - window.innerHeight > threshold;

  // Check window size difference (DevTools docked)
  if (widthThreshold || heightThreshold) {
    return true;
  }

  // Check debugger statement performance
  const start = performance.now();
  // eslint-disable-next-line no-debugger
  debugger;
  const end = performance.now();

  // If debugger statement takes time, DevTools is likely open
  if (end - start > 100) {
    return true;
  }

  // Check console.log toString behavior
  const element = new Image();
  let devtoolsDetected = false;

  Object.defineProperty(element, 'id', {
    get: function () {
      devtoolsDetected = true;
      return 'devtools-detected';
    },
  });

  console.log('%c', element);

  return devtoolsDetected;
}

/**
 * Start periodic DevTools detection
 */
function startDevToolsDetection(config: Required<AntiDevToolsConfig>): void {
  checkInterval = setInterval(() => {
    const isOpen = detectDevToolsOpen();

    if (isOpen && !devToolsOpen) {
      devToolsOpen = true;
      handleDevToolsDetected(config);
    } else if (!isOpen && devToolsOpen) {
      devToolsOpen = false;
    }
  }, 1000);
}

/**
 * Handle DevTools detection
 */
function handleDevToolsDetected(config: Required<AntiDevToolsConfig>): void {
  if (config.debugMode) {
    console.log('DevTools detected!');
  }

  if (config.onDevToolsDetected) {
    config.onDevToolsDetected();
  }

  if (config.redirectUrl) {
    window.location.href = config.redirectUrl;
  }
}

/**
 * Stop DevTools detection
 */
export function stopAntiDevTools(): void {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }

  isInitialized = false;
  devToolsOpen = false;
}

/**
 * Check if DevTools is currently open
 */
export function isDevToolsOpen(): boolean {
  return devToolsOpen;
}

/**
 * Protect specific code execution
 * Throws error if DevTools is open
 */
export function protectCode<T>(fn: () => T): T | null {
  if (detectDevToolsOpen()) {
    throw new Error('Unauthorized access detected');
  }

  return fn();
}

/**
 * Obfuscate sensitive strings in production
 * Simple encoding to prevent casual inspection
 */
export function obfuscate(str: string): string {
  return btoa(encodeURIComponent(str));
}

/**
 * Deobfuscate strings
 */
export function deobfuscate(str: string): string {
  try {
    return decodeURIComponent(atob(str));
  } catch {
    return str;
  }
}

/**
 * Prevent text selection on page
 */
export function disableTextSelection(): void {
  if (typeof window === 'undefined') {
    return;
  }

  document.body.style.userSelect = 'none';
  document.body.style.webkitUserSelect = 'none';
  (document.body.style as any).mozUserSelect = 'none';
  (document.body.style as any).msUserSelect = 'none';

  document.addEventListener('selectstart', (e) => {
    e.preventDefault();
    return false;
  });
}

/**
 * Prevent drag and drop
 */
export function disableDragDrop(): void {
  if (typeof window === 'undefined') {
    return;
  }

  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  });

  document.addEventListener('drop', (e) => {
    e.preventDefault();
    return false;
  });
}

/**
 * Comprehensive protection bundle
 * Enables all protection features at once
 */
export function enableMaxProtection(config: {
  redirectUrl?: string;
  onDevToolsDetected?: () => void;
} = {}): void {
  initAntiDevTools({
    disableRightClick: true,
    disableKeyboardShortcuts: true,
    disableConsole: true,
    detectDevTools: true,
    redirectUrl: config.redirectUrl,
    onDevToolsDetected: config.onDevToolsDetected,
  });

  disableTextSelection();
  disableDragDrop();
}

/**
 * Check if protection is active
 */
export function isProtectionActive(): boolean {
  return isInitialized;
}

/**
 * Get protection status report
 */
export function getProtectionStatus(): {
  initialized: boolean;
  devToolsOpen: boolean;
  timestamp: string;
} {
  return {
    initialized: isInitialized,
    devToolsOpen: devToolsOpen,
    timestamp: new Date().toISOString(),
  };
}
