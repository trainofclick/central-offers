/**
 * Payment Types
 * TypeScript type definitions for payment processing
 */

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'approved'
  | 'declined'
  | 'expired'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 'pix' | 'credit_card' | 'boleto';

export interface PixPayment {
  txid: string;
  qrCode: string;
  qrCodeBase64?: string;
  pixKey: string;
  amount: number;
  expiresAt: Date;
  status: PaymentStatus;
  createdAt: Date;
}

export interface PaymentMetadata {
  orderId: string;
  customerId?: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  products?: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  utmParams?: Record<string, string>;
  [key: string]: any;
}

export interface CreatePixPaymentRequest {
  amount: number;
  description?: string;
  expirationMinutes?: number;
  metadata?: PaymentMetadata;
}

export interface CreatePixPaymentResponse {
  success: boolean;
  payment?: PixPayment;
  error?: string;
  errorCode?: string;
}

export interface CheckPaymentStatusRequest {
  txid: string;
}

export interface CheckPaymentStatusResponse {
  success: boolean;
  status?: PaymentStatus;
  payment?: PixPayment;
  error?: string;
  paidAt?: Date;
}

export interface PaymentWebhookData {
  txid: string;
  status: PaymentStatus;
  amount: number;
  paidAt?: string;
  metadata?: PaymentMetadata;
}

export interface RefundRequest {
  txid: string;
  amount?: number; // Partial refund if specified
  reason?: string;
}

export interface RefundResponse {
  success: boolean;
  refundId?: string;
  amount?: number;
  error?: string;
}

export interface PaymentConfig {
  apiKey: string;
  apiSecret?: string;
  environment?: 'production' | 'sandbox';
  webhookUrl?: string;
  timeout?: number;
}

export interface PaymentError extends Error {
  code: string;
  statusCode?: number;
  details?: any;
}

export class PaymentTimeoutError extends Error implements PaymentError {
  code = 'PAYMENT_TIMEOUT';
  statusCode = 408;

  constructor(message: string = 'Payment request timed out') {
    super(message);
    this.name = 'PaymentTimeoutError';
  }
}

export class PaymentValidationError extends Error implements PaymentError {
  code = 'VALIDATION_ERROR';
  statusCode = 400;

  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'PaymentValidationError';
  }
}

export class PaymentProcessingError extends Error implements PaymentError {
  code = 'PROCESSING_ERROR';
  statusCode = 500;

  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'PaymentProcessingError';
  }
}

export class PaymentNotFoundError extends Error implements PaymentError {
  code = 'NOT_FOUND';
  statusCode = 404;

  constructor(message: string = 'Payment not found') {
    super(message);
    this.name = 'PaymentNotFoundError';
  }
}
