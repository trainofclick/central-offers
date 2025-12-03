# UI Package

React 19 components for direct response marketing pages including particles, confetti, and urgency bars.

## Installation

```bash
# Copy the ui package to your project
cp -r packages/ui ./src/components/
```

## Components

### Particles

Celebration particle effects for success states.

```tsx
import { Particles, useParticles } from '@/components/ui';

// Basic usage with trigger
function SuccessPage() {
  const [showParticles, setShowParticles] = useState(false);

  return (
    <>
      <Particles
        trigger={showParticles}
        count={100}
        colors={['#FFD700', '#FF69B4', '#00FFFF']}
        duration={5000}
        speed={6}
        gravity={0.5}
        onComplete={() => console.log('Animation complete')}
      />

      <button onClick={() => setShowParticles(true)}>
        Celebrate!
      </button>
    </>
  );
}

// Using hook
function PurchaseComplete() {
  const { start, Particles } = useParticles({
    count: 150,
    colors: ['#FFD700', '#FFA500', '#FF6347'],
    duration: 4000,
  });

  useEffect(() => {
    start(); // Auto-start on mount
  }, []);

  return (
    <>
      <Particles />
      <h1>Purchase Complete!</h1>
    </>
  );
}
```

### Confetti

Realistic confetti effects with multiple presets.

```tsx
import { Confetti, useConfetti, ConfettiPresets } from '@/components/ui';

// Basic usage
function Celebration() {
  const [celebrate, setCelebrate] = useState(false);

  return (
    <>
      <Confetti
        trigger={celebrate}
        particleCount={200}
        spread={90}
        origin={{ x: 0.5, y: 0.6 }}
      />

      <button onClick={() => setCelebrate(true)}>
        Fire Confetti!
      </button>
    </>
  );
}

// Using hook with preset
function OrderSuccess() {
  const { fire, Confetti } = useConfetti(ConfettiPresets.realistic);

  return (
    <>
      <Confetti />
      <div>
        <h1>Order Successful!</h1>
        <button onClick={fire}>Celebrate</button>
      </div>
    </>
  );
}

// Multiple bursts
function MultipleBursts() {
  const { fire, Confetti } = useConfetti(ConfettiPresets.fireworks);

  const fireworksSequence = () => {
    fire();
    setTimeout(() => fire(), 300);
    setTimeout(() => fire(), 600);
  };

  return (
    <>
      <Confetti recycle />
      <button onClick={fireworksSequence}>Launch Fireworks</button>
    </>
  );
}
```

#### Confetti Presets

```tsx
// Default burst
ConfettiPresets.default

// Fireworks effect
ConfettiPresets.fireworks

// Star burst
ConfettiPresets.stars

// Realistic physics
ConfettiPresets.realistic

// Cannon shot
ConfettiPresets.cannon
```

### Urgency Bar

Countdown timers and urgency messages.

```tsx
import { UrgencyBar, useUrgencyBar, UrgencyBarPresets } from '@/components/ui';

// Time-based countdown
function OfferPage() {
  return (
    <UrgencyBar
      message="Limited Time Offer!"
      endTime={new Date('2024-12-31T23:59:59')}
      showCountdown
      position="top"
      backgroundColor="#ff4444"
      animateProgress
      onExpire={() => console.log('Offer expired')}
    />
  );
}

// Duration-based countdown
function FlashSale() {
  return (
    <UrgencyBar
      message="⚡ Flash Sale - 50% OFF"
      duration={3600000} // 1 hour in milliseconds
      showCountdown
      animateProgress
      position="top"
      autoHide // Hide when expired
    />
  );
}

// With custom styling
function CustomBar() {
  return (
    <UrgencyBar
      message="🔥 Special Discount Ending Soon"
      endTime={new Date(Date.now() + 7200000)} // 2 hours
      showCountdown
      position="bottom"
      backgroundColor="#9b59b6"
      textColor="#ffffff"
      height="70px"
      showCloseButton
      icon={<span style={{ fontSize: '24px' }}>🎁</span>}
    />
  );
}

// Using hook
function ControlledBar() {
  const { show, hide, isVisible, isExpired, UrgencyBar } = useUrgencyBar({
    message: 'Limited Offer',
    duration: 1800000, // 30 minutes
    showCountdown: true,
    onExpire: () => alert('Offer expired!'),
  });

  return (
    <>
      <UrgencyBar />
      <button onClick={show}>Show Bar</button>
      <button onClick={hide}>Hide Bar</button>
      <p>Visible: {isVisible ? 'Yes' : 'No'}</p>
      <p>Expired: {isExpired ? 'Yes' : 'No'}</p>
    </>
  );
}

// Using preset
function PresetBar() {
  return (
    <UrgencyBar
      {...UrgencyBarPresets.flash_sale}
      duration={3600000}
    />
  );
}
```

#### Urgency Bar Presets

```tsx
// Flash sale
UrgencyBarPresets.flash_sale

// Countdown emphasis
UrgencyBarPresets.countdown

// Last chance message
UrgencyBarPresets.last_chance

// Limited stock
UrgencyBarPresets.limited_stock

// Early bird special
UrgencyBarPresets.early_bird
```

## Combined Example

Complete checkout success page with multiple effects:

```tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Confetti,
  Particles,
  UrgencyBar,
  ConfettiPresets,
} from '@/components/ui';

export default function CheckoutSuccess() {
  const [showEffects, setShowEffects] = useState(false);

  useEffect(() => {
    // Trigger celebration effects
    setShowEffects(true);
  }, []);

  return (
    <div>
      {/* Confetti celebration */}
      <Confetti
        trigger={showEffects}
        {...ConfettiPresets.realistic}
      />

      {/* Particle effects */}
      <Particles
        trigger={showEffects}
        count={100}
        colors={['#FFD700', '#FFA500', '#FF6347']}
        duration={4000}
      />

      {/* Urgency bar for upsell */}
      <UrgencyBar
        message="⚡ Add Premium Support - Limited Time!"
        duration={600000} // 10 minutes
        showCountdown
        animateProgress
        position="top"
        backgroundColor="#9b59b6"
      />

      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h1>Purchase Complete!</h1>
        <p>Thank you for your order.</p>
      </div>
    </div>
  );
}
```

## Server Components vs Client Components

All UI components are client components (use 'use client') and must be imported in client components:

```tsx
// app/page.tsx (Server Component)
import SuccessContent from './SuccessContent'; // Client component

export default function Page() {
  return <SuccessContent />;
}

// SuccessContent.tsx (Client Component)
'use client';

import { Confetti } from '@/components/ui';

export default function SuccessContent() {
  return <Confetti trigger={true} />;
}
```

## Props Reference

### Particles Props

```typescript
interface ParticlesProps {
  trigger?: boolean;
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
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}
```

### Confetti Props

```typescript
interface ConfettiProps {
  trigger?: boolean;
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
  recycle?: boolean;
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}
```

### UrgencyBar Props

```typescript
interface UrgencyBarProps {
  message?: string;
  endTime?: Date | string | number;
  duration?: number;
  showCountdown?: boolean;
  position?: 'top' | 'bottom';
  backgroundColor?: string;
  textColor?: string;
  height?: string;
  animateProgress?: boolean;
  autoHide?: boolean;
  showCloseButton?: boolean;
  icon?: React.ReactNode;
  onExpire?: () => void;
  className?: string;
  style?: React.CSSProperties;
}
```

## Performance Tips

1. Use `trigger` prop instead of mounting/unmounting components
2. Set appropriate `duration` values to clean up animations
3. Limit `particleCount` on mobile devices
4. Use `onComplete` callbacks to clean up state
5. Consider using presets for optimized configurations

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

All components use Canvas API for optimal performance.

## License

MIT
