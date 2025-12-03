/**
 * Particles Component
 * React component for celebration particle effects
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface ParticlesConfig {
  count?: number;
  colors?: string[];
  duration?: number;
  speed?: number;
  size?: { min: number; max: number };
  shapes?: ('circle' | 'square' | 'triangle')[];
  gravity?: number;
  spread?: number;
  fadeOut?: boolean;
  autoStart?: boolean;
}

export interface ParticlesProps extends ParticlesConfig {
  trigger?: boolean;
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  shape: 'circle' | 'square' | 'triangle';
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  life: number;
  maxLife: number;
}

const DEFAULT_CONFIG: Required<ParticlesConfig> = {
  count: 50,
  colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
  duration: 3000,
  speed: 5,
  size: { min: 4, max: 12 },
  shapes: ['circle', 'square', 'triangle'],
  gravity: 0.5,
  spread: Math.PI * 2,
  fadeOut: true,
  autoStart: false,
};

/**
 * Particles component for celebration effects
 * @example
 * ```tsx
 * <Particles
 *   trigger={isPurchaseComplete}
 *   count={100}
 *   colors={['#FFD700', '#FF69B4', '#00FFFF']}
 *   duration={5000}
 *   onComplete={() => console.log('Animation complete')}
 * />
 * ```
 */
export function Particles({
  trigger = false,
  count = DEFAULT_CONFIG.count,
  colors = DEFAULT_CONFIG.colors,
  duration = DEFAULT_CONFIG.duration,
  speed = DEFAULT_CONFIG.speed,
  size = DEFAULT_CONFIG.size,
  shapes = DEFAULT_CONFIG.shapes,
  gravity = DEFAULT_CONFIG.gravity,
  spread = DEFAULT_CONFIG.spread,
  fadeOut = DEFAULT_CONFIG.fadeOut,
  autoStart = DEFAULT_CONFIG.autoStart,
  onComplete,
  className = '',
  style = {},
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  const createParticle = (centerX: number, centerY: number): Particle => {
    const angle = Math.random() * spread - spread / 2;
    const velocity = Math.random() * speed + speed / 2;
    const particleSize = Math.random() * (size.max - size.min) + size.min;

    return {
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - Math.random() * speed,
      size: particleSize,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      opacity: 1,
      life: 0,
      maxLife: duration,
    };
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = particle.color;

    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);

    switch (particle.shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'square':
        ctx.fillRect(
          -particle.size / 2,
          -particle.size / 2,
          particle.size,
          particle.size
        );
        break;

      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -particle.size);
        ctx.lineTo(particle.size, particle.size);
        ctx.lineTo(-particle.size, particle.size);
        ctx.closePath();
        ctx.fill();
        break;
    }

    ctx.restore();
  };

  const updateParticle = (particle: Particle, deltaTime: number) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += gravity;
    particle.rotation += particle.rotationSpeed;
    particle.life += deltaTime;

    if (fadeOut) {
      particle.opacity = Math.max(0, 1 - particle.life / particle.maxLife);
    }

    return particle.life < particle.maxLife;
  };

  const animate = (timestamp: number) => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (startTimeRef.current === 0) {
      startTimeRef.current = timestamp;
    }

    const deltaTime = timestamp - startTimeRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter((particle) => {
      const isAlive = updateParticle(particle, deltaTime / 60);
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
    if (!canvasRef.current || isAnimating) return;

    const canvas = canvasRef.current;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Create particles
    particlesRef.current = Array.from({ length: count }, () =>
      createParticle(centerX, centerY)
    );

    setIsAnimating(true);
    startTimeRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (trigger) {
      startAnimation();
    }
  }, [trigger]);

  useEffect(() => {
    if (autoStart) {
      startAnimation();
    }
  }, [autoStart]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
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
      className={`particles-canvas ${className}`}
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
 * Hook for controlling particles programmatically
 */
export function useParticles(config?: ParticlesConfig) {
  const [trigger, setTrigger] = useState(false);

  const start = () => {
    setTrigger(true);
    setTimeout(() => setTrigger(false), 100);
  };

  const ParticlesComponent = () => (
    <Particles {...config} trigger={trigger} />
  );

  return {
    start,
    Particles: ParticlesComponent,
  };
}

export default Particles;
