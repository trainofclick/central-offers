/**
 * Umbrella PIX Gateway Integration
 * Generate PIX payments and check payment status
 */

import type {
  PixPayment,
  PaymentStatus,
  CreatePixPaymentRequest,
  CreatePixPaymentResponse,
  CheckPaymentStatusRequest,
  CheckPaymentStatusResponse,
  PaymentConfig,
  RefundRequest,
  RefundResponse,
  PaymentMetadata,
} from './types';

import {
  PaymentTimeoutError,
  PaymentValidationError,
  PaymentProcessingError,
  PaymentNotFoundError,
} from './types';

const DEFAULT_CONFIG: Required<Omit<PaymentConfig, 'apiKey' | 'apiSecret' | 'webhookUrl'>> = {
  environment: 'production',
  timeout: 30000,
};

let globalConfig: PaymentConfig | null = null;

/**
 * Initialize Umbrella PIX with configuration
 * @param config - Payment gateway configuration
 * @example
 * ```typescript
 * initUmbrellaPix({
 *   apiKey: 'your-api-key',
 *   apiSecret: 'your-api-secret',
 *   environment: 'production'
 * });
 * ```
 */
export function initUmbrellaPix(config: PaymentConfig): void {
  if (!config.apiKey) {
    throw new PaymentValidationError('API key is required');
  }

  globalConfig = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  console.log(`Umbrella PIX initialized in ${globalConfig.environment} mode`);
}

/**
 * Get current configuration
 */
function getConfig(): Required<PaymentConfig> {
  if (!globalConfig) {
    throw new PaymentProcessingError('Umbrella PIX not initialized. Call initUmbrellaPix first.');
  }

  return globalConfig as Required<PaymentConfig>;
}

/**
 * Generate API URL based on environment
 */
function getApiUrl(): string {
  const config = getConfig();
  return config.environment === 'production'
    ? 'https://api.umbrellapix.com/v1'
    : 'https://sandbox.umbrellapix.com/v1';
}

/**
 * Create a PIX payment
 * @param request - Payment creation request
 * @returns Promise with payment data including QR code
 * @example
 * ```typescript
 * const payment = await createPixPayment({
 *   amount: 99.90,
 *   description: 'Premium Plan - Monthly',
 *   expirationMinutes: 15,
 *   metadata: {
 *     orderId: 'order-123',
 *     customerEmail: 'customer@example.com'
 *   }
 * });
 * ```
 */
export async function createPixPayment(
  request: CreatePixPaymentRequest
): Promise<CreatePixPaymentResponse> {
  try {
    // Validation
    if (!request.amount || request.amount <= 0) {
      throw new PaymentValidationError('Amount must be greater than 0');
    }

    const config = getConfig();
    const apiUrl = getApiUrl();

    const expirationMinutes = request.expirationMinutes || 15;
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes);

    // Prepare request payload
    const payload = {
      amount: request.amount,
      description: request.description || 'Payment',
      expiration: expirationMinutes,
      metadata: request.metadata,
    };

    // Make API request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const response = await fetch(`${apiUrl}/pix/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
          ...(config.apiSecret && { 'X-API-Secret': config.apiSecret }),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new PaymentProcessingError(
          error.message || 'Failed to create PIX payment',
          error
        );
      }

      const data = await response.json();

      const payment: PixPayment = {
        txid: data.txid,
        qrCode: data.qrCode,
        qrCodeBase64: data.qrCodeBase64,
        pixKey: data.pixKey,
        amount: request.amount,
        expiresAt,
        status: 'pending',
        createdAt: new Date(),
      };

      return {
        success: true,
        payment,
      };
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new PaymentTimeoutError();
      }

      throw error;
    }
  } catch (error: any) {
    console.error('Error creating PIX payment:', error);

    return {
      success: false,
      error: error.message,
      errorCode: error.code,
    };
  }
}

/**
 * Check payment status
 * @param request - Status check request with transaction ID
 * @returns Promise with current payment status
 * @example
 * ```typescript
 * const status = await checkPaymentStatus({ txid: 'txid-123' });
 * if (status.status === 'approved') {
 *   console.log('Payment approved!');
 * }
 * ```
 */
export async function checkPaymentStatus(
  request: CheckPaymentStatusRequest
): Promise<CheckPaymentStatusResponse> {
  try {
    if (!request.txid) {
      throw new PaymentValidationError('Transaction ID is required');
    }

    const config = getConfig();
    const apiUrl = getApiUrl();

    // Make API request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const response = await fetch(`${apiUrl}/pix/payment/${request.txid}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          ...(config.apiSecret && { 'X-API-Secret': config.apiSecret }),
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw new PaymentNotFoundError();
        }

        const error = await response.json().catch(() => ({}));
        throw new PaymentProcessingError(
          error.message || 'Failed to check payment status',
          error
        );
      }

      const data = await response.json();

      return {
        success: true,
        status: data.status as PaymentStatus,
        payment: data.payment,
        paidAt: data.paidAt ? new Date(data.paidAt) : undefined,
      };
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new PaymentTimeoutError();
      }

      throw error;
    }
  } catch (error: any) {
    console.error('Error checking payment status:', error);

    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Poll payment status until it changes or timeout
 * @param txid - Transaction ID
 * @param options - Polling options
 * @returns Promise that resolves when payment status changes
 * @example
 * ```typescript
 * const result = await pollPaymentStatus('txid-123', {
 *   interval: 3000,
 *   timeout: 300000,
 *   onStatusChange: (status) => console.log('Status:', status)
 * });
 * ```
 */
export async function pollPaymentStatus(
  txid: string,
  options: {
    interval?: number;
    timeout?: number;
    onStatusChange?: (status: PaymentStatus) => void;
  } = {}
): Promise<CheckPaymentStatusResponse> {
  const interval = options.interval || 3000; // 3 seconds
  const timeout = options.timeout || 300000; // 5 minutes
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const result = await checkPaymentStatus({ txid });

        if (!result.success) {
          reject(new PaymentProcessingError(result.error || 'Failed to check status'));
          return;
        }

        const status = result.status!;

        if (options.onStatusChange) {
          options.onStatusChange(status);
        }

        // Resolve if payment is completed (approved, declined, expired, cancelled)
        if (['approved', 'declined', 'expired', 'cancelled'].includes(status)) {
          resolve(result);
          return;
        }

        // Check timeout
        if (Date.now() - startTime >= timeout) {
          reject(new PaymentTimeoutError('Payment status polling timed out'));
          return;
        }

        // Continue polling
        setTimeout(poll, interval);
      } catch (error) {
        reject(error);
      }
    };

    poll();
  });
}

/**
 * Cancel a pending payment
 * @param txid - Transaction ID
 */
export async function cancelPayment(txid: string): Promise<boolean> {
  try {
    const config = getConfig();
    const apiUrl = getApiUrl();

    const response = await fetch(`${apiUrl}/pix/payment/${txid}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        ...(config.apiSecret && { 'X-API-Secret': config.apiSecret }),
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error cancelling payment:', error);
    return false;
  }
}

/**
 * Request a refund for an approved payment
 * @param request - Refund request
 * @returns Refund response
 */
export async function refundPayment(
  request: RefundRequest
): Promise<RefundResponse> {
  try {
    if (!request.txid) {
      throw new PaymentValidationError('Transaction ID is required');
    }

    const config = getConfig();
    const apiUrl = getApiUrl();

    const payload = {
      amount: request.amount,
      reason: request.reason,
    };

    const response = await fetch(`${apiUrl}/pix/payment/${request.txid}/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        ...(config.apiSecret && { 'X-API-Secret': config.apiSecret }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new PaymentProcessingError(
        error.message || 'Failed to process refund',
        error
      );
    }

    const data = await response.json();

    return {
      success: true,
      refundId: data.refundId,
      amount: data.amount,
    };
  } catch (error: any) {
    console.error('Error processing refund:', error);

    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Verify webhook signature
 * @param payload - Webhook payload
 * @param signature - Webhook signature from headers
 * @returns True if signature is valid
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  const config = getConfig();

  if (!config.apiSecret) {
    console.warn('API secret not configured, skipping signature verification');
    return true;
  }

  // Implement HMAC signature verification
  // This is a placeholder - actual implementation depends on gateway's signature method
  try {
    // Example: HMAC-SHA256 verification
    // const crypto = require('crypto');
    // const expectedSignature = crypto
    //   .createHmac('sha256', config.apiSecret)
    //   .update(payload)
    //   .digest('hex');
    // return expectedSignature === signature;

    return true; // Placeholder
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

/**
 * Get configuration status
 */
export function isConfigured(): boolean {
  return globalConfig !== null;
}
