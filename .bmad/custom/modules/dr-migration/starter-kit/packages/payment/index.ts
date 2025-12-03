/**
 * Payment Package
 * Unified exports for payment processing
 */

// Umbrella PIX
export {
  initUmbrellaPix,
  createPixPayment,
  checkPaymentStatus,
  pollPaymentStatus,
  cancelPayment,
  refundPayment,
  verifyWebhookSignature,
  isConfigured,
} from './umbrella-pix';

// Types
export type {
  PaymentStatus,
  PaymentMethod,
  PixPayment,
  PaymentMetadata,
  CreatePixPaymentRequest,
  CreatePixPaymentResponse,
  CheckPaymentStatusRequest,
  CheckPaymentStatusResponse,
  PaymentWebhookData,
  RefundRequest,
  RefundResponse,
  PaymentConfig,
  PaymentError,
} from './types';

export {
  PaymentTimeoutError,
  PaymentValidationError,
  PaymentProcessingError,
  PaymentNotFoundError,
} from './types';
