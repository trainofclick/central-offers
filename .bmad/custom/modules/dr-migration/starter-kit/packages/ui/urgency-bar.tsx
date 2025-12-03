/**
 * Urgency Bar Component
 * React component for displaying urgency/countdown bars
 */

'use client';

import React, { useEffect, useState } from 'react';

export interface UrgencyBarProps {
  message?: string;
  endTime?: Date | string | number;
  duration?: number; // milliseconds
  showCountdown?: boolean;
  position?: 'top' | 'bottom';
  backgroundColor?: string;
  textColor?: string;
  height?: string;
  animateProgress?: boolean;
  onExpire?: () => void;
  className?: string;
  style?: React.CSSProperties;
  autoHide?: boolean;
  showCloseButton?: boolean;
  icon?: React.ReactNode;
}

/**
 * Calculate time remaining until end time
 */
function calculateTimeRemaining(endTime: Date): {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const total = endTime.getTime() - Date.now();

  if (total <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { total, days, hours, minutes, seconds };
}

/**
 * Format time component with leading zero
 */
function formatTimeComponent(value: number): string {
  return value.toString().padStart(2, '0');
}

/**
 * UrgencyBar component for creating countdown timers and urgency messages
 * @example
 * ```tsx
 * // Time-based countdown
 * <UrgencyBar
 *   message="Limited Time Offer"
 *   endTime={new Date('2024-12-31T23:59:59')}
 *   showCountdown
 *   position="top"
 *   onExpire={() => console.log('Offer expired')}
 * />
 *
 * // Duration-based countdown
 * <UrgencyBar
 *   message="Special Price Ends In:"
 *   duration={3600000} // 1 hour
 *   showCountdown
 *   animateProgress
 * />
 * ```
 */
export function UrgencyBar({
  message = 'Limited Time Offer!',
  endTime,
  duration,
  showCountdown = true,
  position = 'top',
  backgroundColor = '#ff4444',
  textColor = '#ffffff',
  height = '60px',
  animateProgress = false,
  onExpire,
  className = '',
  style = {},
  autoHide = false,
  showCloseButton = false,
  icon,
}: UrgencyBarProps) {
  const [timeRemaining, setTimeRemaining] = useState({ total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(true);
  const [targetEndTime, setTargetEndTime] = useState<Date | null>(null);

  useEffect(() => {
    // Determine end time
    let end: Date;

    if (endTime) {
      end = new Date(endTime);
    } else if (duration) {
      end = new Date(Date.now() + duration);
    } else {
      // Default to 1 hour from now
      end = new Date(Date.now() + 3600000);
    }

    setTargetEndTime(end);

    const startTime = Date.now();
    const totalDuration = end.getTime() - startTime;

    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining(end);
      setTimeRemaining(remaining);

      // Update progress bar
      if (animateProgress) {
        const elapsed = Date.now() - startTime;
        const progressPercentage = Math.max(0, 100 - (elapsed / totalDuration) * 100);
        setProgress(progressPercentage);
      }

      // Check if expired
      if (remaining.total <= 0) {
        clearInterval(interval);
        if (onExpire) {
          onExpire();
        }
        if (autoHide) {
          setIsVisible(false);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, duration, animateProgress, onExpire, autoHide]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  const isExpired = timeRemaining.total <= 0;

  return (
    <div
      className={`urgency-bar ${className}`}
      style={{
        position: 'fixed',
        [position]: 0,
        left: 0,
        right: 0,
        height,
        backgroundColor: isExpired ? '#666666' : backgroundColor,
        color: textColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '0 20px',
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        ...style,
      }}
    >
      {animateProgress && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              width: `${progress}%`,
              transition: 'width 1s linear',
            }}
          />
        </div>
      )}

      {icon && <div style={{ display: 'flex', alignItems: 'center' }}>{icon}</div>}

      <div style={{ fontSize: '16px', fontWeight: 600 }}>
        {isExpired ? 'Offer Expired' : message}
      </div>

      {showCountdown && !isExpired && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            fontSize: '18px',
            fontWeight: 700,
            fontFamily: 'monospace',
          }}
        >
          {timeRemaining.days > 0 && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div>{formatTimeComponent(timeRemaining.days)}</div>
                <div style={{ fontSize: '10px', fontWeight: 400 }}>DAYS</div>
              </div>
              <div style={{ fontSize: '24px', lineHeight: '1' }}>:</div>
            </>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div>{formatTimeComponent(timeRemaining.hours)}</div>
            <div style={{ fontSize: '10px', fontWeight: 400 }}>HRS</div>
          </div>

          <div style={{ fontSize: '24px', lineHeight: '1' }}>:</div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div>{formatTimeComponent(timeRemaining.minutes)}</div>
            <div style={{ fontSize: '10px', fontWeight: 400 }}>MIN</div>
          </div>

          <div style={{ fontSize: '24px', lineHeight: '1' }}>:</div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div>{formatTimeComponent(timeRemaining.seconds)}</div>
            <div style={{ fontSize: '10px', fontWeight: 400 }}>SEC</div>
          </div>
        </div>
      )}

      {showCloseButton && (
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: textColor,
            fontSize: '24px',
            cursor: 'pointer',
            padding: '0',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.7,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
        >
          ×
        </button>
      )}
    </div>
  );
}

/**
 * Hook for controlling urgency bar state
 */
export function useUrgencyBar(config: UrgencyBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpired, setIsExpired] = useState(false);

  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);

  const handleExpire = () => {
    setIsExpired(true);
    if (config.onExpire) {
      config.onExpire();
    }
  };

  const UrgencyBarComponent = () => (
    <>
      {isVisible && (
        <UrgencyBar {...config} onExpire={handleExpire} />
      )}
    </>
  );

  return {
    show,
    hide,
    isVisible,
    isExpired,
    UrgencyBar: UrgencyBarComponent,
  };
}

/**
 * Urgency Bar presets for common scenarios
 */
export const UrgencyBarPresets = {
  flash_sale: {
    message: '⚡ Flash Sale - Limited Time Only!',
    backgroundColor: '#ff3366',
    animateProgress: true,
  },
  countdown: {
    message: '🔥 Offer Ends Soon',
    backgroundColor: '#ff4444',
    showCountdown: true,
  },
  last_chance: {
    message: '⏰ Last Chance - Don\'t Miss Out!',
    backgroundColor: '#ff6600',
    animateProgress: true,
  },
  limited_stock: {
    message: '📦 Limited Stock Available',
    backgroundColor: '#9b59b6',
    showCountdown: false,
  },
  early_bird: {
    message: '🎯 Early Bird Special',
    backgroundColor: '#3498db',
    showCountdown: true,
  },
};

export default UrgencyBar;
