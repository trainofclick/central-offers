/**
 * Security Package
 * Unified exports for security utilities
 */

// Cloaking Filter
export {
  detectBot,
  isDatacenterIP,
  initCloakingFilter,
  generateFingerprint,
  checkUserInteraction,
  setupInteractionTracking,
  getBotDetectionReport,
  type BotDetectionConfig,
  type DetectionResult,
} from './cloaking-filter';

// Anti-DevTools
export {
  initAntiDevTools,
  stopAntiDevTools,
  isDevToolsOpen,
  protectCode,
  obfuscate,
  deobfuscate,
  disableTextSelection,
  disableDragDrop,
  enableMaxProtection,
  isProtectionActive,
  getProtectionStatus,
  type AntiDevToolsConfig,
} from './anti-devtools';
