/**
 * Confetti Component
 * React confetti effect component for celebrations
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface ConfettiConfig {
  particleCount?: number;
  colors?: string[];
  spread?: number;
  startVelocity?: number;
  decay?: number;
  gravity?: number;
  drift?: number;
  ticks?: number;
  origin?: { x: number; y: number };
  scalar?: number;
}

export interface ConfettiProps extends ConfettiConfig {
  trigger?: boolean;
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
  recycle?: boolean;
}

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  width: number;
  height: number;
  opacity: number;
  tick: number;
  totalTicks: number;
  wobble: number;
  wobbleSpeed: number;
}

const DEFAULT_CONFIG: Required<ConfettiConfig> = {
  particleCount: 150,
  colors: [
    '#26ccff',
    '#a25afd',
    '#ff5e7e',
    '#88ff5a',
    '#fcff42',
    '#ffa62d',
    '#ff36ff',
  ],
  spread: 360,
  startVelocity: 45,
  decay: 0.9,
  gravity: 1,
  drift: 0,
  ticks: 200,
  origin: { x: 0.5, y: 0.5 },
  scalar: 1,
};

/**
 * Confetti component for celebration effects
 * @example
 * ```tsx
 * <Confetti
 *   trigger={isPurchaseComplete}
 *   particleCount={200}
 *   spread={90}
 *   origin={{ x: 0.5, y: 0.6 }}
 *   onComplete={() => console.log('Confetti complete')}
 * />
 * ```
 */
export function Confetti({
  trigger = false,
  particleCount = DEFAULT_CONFIG.particleCount,
  colors = DEFAULT_CONFIG.colors,
  spread = DEFAULT_CONFIG.spread,
  startVelocity = DEFAULT_CONFIG.startVelocity,
  decay = DEFAULT_CONFIG.decay,
  gravity = DEFAULT_CONFIG.gravity,
  drift = DEFAULT_CONFIG.drift,
  ticks = DEFAULT_CONFIG.ticks,
  origin = DEFAULT_CONFIG.origin,
  scalar = DEFAULT_CONFIG.scalar,
  onComplete,
  className = '',
  style = {},
  recycle = false,
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const particlesRef = useRef<ConfettiParticle[]>([]);
  const animationFrameRef = useRef<number>();

  const randomRange = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
  };

  const createParticle = (canvas: HTMLCanvasElement): ConfettiParticle => {
    const angle = randomRange(0, 360) * (Math.PI / 180);
    const velocity = randomRange(startVelocity * 0.75, startVelocity);
    const spreadRad = spread * (Math.PI / 180);

    const vx =
      Math.sin(angle - spreadRad / 2 + Math.random() * spreadRad) * velocity;
    const vy = Math.cos(angle - spreadRad / 2 + Math.random() * spreadRad) * velocity;

    return {
      x: canvas.width * origin.x,
      y: canvas.height * origin.y,
      vx: vx,
      vy: -Math.abs(vy),
      rotation: randomRange(0, 360),
      rotationSpeed: randomRange(-10, 10),
      color: colors[Math.floor(Math.random() * colors.length)],
      width: randomRange(5, 10) * scalar,
      height: randomRange(10, 20) * scalar,
      opacity: 1,
      tick: 0,
      totalTicks: ticks,
      wobble: randomRange(0, 10),
      wobbleSpeed: randomRange(0.1, 0.2),
    };
  };

  const updateParticle = (particle: ConfettiParticle): boolean => {
    particle.tick++;

    // Apply physics
    particle.vx += drift * 0.01;
    particle.vy += gravity * 0.5;

    particle.vx *= decay;
    particle.vy *= decay;

    particle.x += particle.vx;
    particle.y += particle.vy;

    particle.rotation += particle.rotationSpeed;
    particle.wobble += particle.wobbleSpeed;

    // Fade out
    const progress = particle.tick / particle.totalTicks;
    particle.opacity = Math.max(0, 1 - progress);

    // Check if particle is alive
    return particle.tick < particle.totalTicks && particle.y < canvasRef.current!.height;
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: ConfettiParticle) => {
    ctx.save();

    ctx.translate(particle.x, particle.y);
    ctx.rotate((particle.rotation * Math.PI) / 180);

    const wobbleX = Math.sin(particle.wobble) * 3;

    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = particle.color;

    ctx.fillRect(
      wobbleX - particle.width / 2,
      -particle.height / 2,
      particle.width,
      particle.height
    );

    ctx.restore();
  };

  const animate = () => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter((particle) => {
      const isAlive = updateParticle(particle);
      if (isAlive) {
        drawParticle(ctx, particle);
      }
      return isAlive;
    });

    // Continue animation if particles exist
    if (particlesRef.current.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      setIsAnimating(false);
      if (onComplete) {
        onComplete();
      }
    }
  };

  const startAnimation = () => {
    if (!canvasRef.current || (isAnimating && !recycle)) return;

    const canvas = canvasRef.current;

    // Create particles
    const newParticles = Array.from({ length: particleCount }, () =>
      createParticle(canvas)
    );

    if (recycle) {
      particlesRef.current = [...particlesRef.current, ...newParticles];
    } else {
      particlesRef.current = newParticles;
    }

    setIsAnimating(true);
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (trigger) {
      startAnimation();
    }
  }, [trigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`confetti-canvas ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
        ...style,
      }}
    />
  );
}

/**
 * Hook for controlling confetti programmatically
 */
export function useConfetti(config?: ConfettiConfig) {
  const [trigger, setTrigger] = useState(false);

  const fire = () => {
    setTrigger(true);
    setTimeout(() => setTrigger(false), 100);
  };

  const ConfettiComponent = () => (
    <Confetti {...config} trigger={trigger} />
  );

  return {
    fire,
    Confetti: ConfettiComponent,
  };
}

/**
 * Confetti presets for common scenarios
 */
export const ConfettiPresets = {
  default: {
    particleCount: 150,
    spread: 360,
    origin: { x: 0.5, y: 0.5 },
  },
  fireworks: {
    particleCount: 50,
    spread: 60,
    startVelocity: 60,
    origin: { x: 0.5, y: 0.8 },
  },
  stars: {
    particleCount: 100,
    spread: 26,
    startVelocity: 55,
    origin: { x: 0.5, y: 0.3 },
    colors: ['#FFD700', '#FFA500', '#FFFF00'],
  },
  realistic: {
    particleCount: 200,
    spread: 100,
    startVelocity: 40,
    decay: 0.91,
    gravity: 0.7,
    origin: { x: 0.5, y: 0.3 },
  },
  cannon: {
    particleCount: 50,
    spread: 70,
    startVelocity: 45,
    origin: { x: 0.5, y: 0.7 },
  },
};

export default Confetti;
