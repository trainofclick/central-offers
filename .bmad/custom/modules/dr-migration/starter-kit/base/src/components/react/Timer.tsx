/**
 * Timer.tsx
 * Countdown timer React component para urgência
 */

import { useState, useEffect } from "react";

interface TimerProps {
  /** Tempo inicial em segundos */
  initialSeconds?: number;
  /** Tempo inicial em minutos (alternativo) */
  initialMinutes?: number;
  /** Callback quando timer chega a zero */
  onExpire?: () => void;
  /** Mostrar horas */
  showHours?: boolean;
  /** Classes CSS customizadas */
  className?: string;
  /** Texto antes do timer */
  prefix?: string;
  /** Texto depois do timer */
  suffix?: string;
}

export default function Timer({
  initialSeconds = 0,
  initialMinutes = 10,
  onExpire,
  showHours = false,
  className = "",
  prefix = "Oferta expira em:",
  suffix = "",
}: TimerProps) {
  const totalSeconds = initialSeconds || initialMinutes * 60;
  const [seconds, setSeconds] = useState(totalSeconds);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (seconds <= 0) {
      setIsExpired(true);
      onExpire?.();
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, onExpire]);

  const formatTime = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const pad = (n: number) => n.toString().padStart(2, "0");

    if (showHours) {
      return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
    }
    return `${pad(minutes)}:${pad(secs)}`;
  };

  if (isExpired) {
    return (
      <div className={`text-error font-bold ${className}`}>
        Oferta expirada!
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center gap-2 font-mono ${className}`}
    >
      {prefix && <span className="text-text-muted">{prefix}</span>}
      <span
        className={`
        text-2xl font-bold tabular-nums
        ${seconds <= 60 ? "text-error animate-pulse" : "text-primary"}
      `}
      >
        {formatTime(seconds)}
      </span>
      {suffix && <span className="text-text-muted">{suffix}</span>}
    </div>
  );
}
