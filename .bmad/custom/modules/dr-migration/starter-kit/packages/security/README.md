# Security Package

Security utilities for bot detection, cloaking protection, and anti-devtools measures.

## Installation

```bash
# Copy the security package to your project
cp -r packages/security ./src/lib/
```

## Usage

### Cloaking Filter (Bot Detection)

Protect your landing pages from bots and scrapers.

```typescript
import {
  detectBot,
  initCloakingFilter,
  setupInteractionTracking,
} from './lib/security';

// Simple bot detection
const result = detectBot({
  enableUserAgentCheck: true,
  enableBehaviorCheck: true,
  strictMode: false,
});

if (result.isBot) {
  console.log('Bot detected:', result.reasons);
  console.log('Confidence:', result.confidence);
  // Redirect to safe page
  window.location.href = '/safe-page';
}

// Automatic initialization with redirect
initCloakingFilter({
  strictMode: false,
  redirectUrl: '/safe-page',
  onBotDetected: (reason) => {
    console.log('Bot detected and redirected:', reason);
    // Send analytics event
  },
});

// Setup interaction tracking
setupInteractionTracking();
```

### Advanced Bot Detection

```typescript
import {
  getBotDetectionReport,
  generateFingerprint,
  checkUserInteraction,
} from './lib/security';

// Get comprehensive report
const report = getBotDetectionReport({
  enableUserAgentCheck: true,
  enableBehaviorCheck: true,
});

console.log('Bot detection report:', {
  isBot: report.result.isBot,
  confidence: report.result.confidence,
  reasons: report.result.reasons,
  fingerprint: report.fingerprint,
  userInteracted: report.userInteracted,
  userAgent: report.userAgent,
  platform: report.platform,
  languages: report.languages,
  screenResolution: report.screenResolution,
});

// Generate unique fingerprint
const fingerprint = generateFingerprint();
console.log('Browser fingerprint:', fingerprint);

// Check if user has interacted
const hasInteracted = checkUserInteraction();
if (!hasInteracted) {
  console.log('User has not interacted with the page');
}
```

### Anti-DevTools Protection

Prevent unauthorized developer tools usage.

```typescript
import {
  initAntiDevTools,
  enableMaxProtection,
  isDevToolsOpen,
  protectCode,
} from './lib/security';

// Initialize with custom config
initAntiDevTools({
  disableRightClick: true,
  disableKeyboardShortcuts: true,
  detectDevTools: true,
  redirectUrl: '/blocked',
  onDevToolsDetected: () => {
    console.log('DevTools detected!');
    // Send alert or log
  },
  debugMode: false,
});

// Enable maximum protection (all features)
enableMaxProtection({
  redirectUrl: '/blocked',
  onDevToolsDetected: () => {
    alert('Developer tools are not allowed on this page');
  },
});

// Check if DevTools is open
if (isDevToolsOpen()) {
  console.log('DevTools is currently open');
}

// Protect specific code execution
try {
  protectCode(() => {
    // Sensitive code here
    const apiKey = 'secret-key';
    console.log('This will throw if DevTools is open');
  });
} catch (error) {
  console.error('Protected code execution failed:', error);
}
```

### String Obfuscation

```typescript
import { obfuscate, deobfuscate } from './lib/security';

// Obfuscate sensitive strings
const apiKey = 'my-secret-api-key';
const encoded = obfuscate(apiKey);
console.log('Encoded:', encoded);

// Deobfuscate when needed
const decoded = deobfuscate(encoded);
console.log('Decoded:', decoded); // 'my-secret-api-key'
```

### Text Selection and Drag Protection

```typescript
import {
  disableTextSelection,
  disableDragDrop,
} from './lib/security';

// Disable text selection
disableTextSelection();

// Disable drag and drop
disableDragDrop();
```

## Next.js Example

### App Layout with Security

```typescript
// app/layout.tsx
'use client';

import { useEffect } from 'react';
import {
  initCloakingFilter,
  enableMaxProtection,
  setupInteractionTracking,
} from '@/lib/security';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize bot detection
    initCloakingFilter({
      strictMode: false,
      redirectUrl: '/safe-page',
      enableUserAgentCheck: true,
      enableBehaviorCheck: true,
    });

    // Setup interaction tracking
    setupInteractionTracking();

    // Enable anti-devtools in production
    if (process.env.NODE_ENV === 'production') {
      enableMaxProtection({
        redirectUrl: '/blocked',
      });
    }
  }, []);

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

### Protected Component

```typescript
// components/ProtectedContent.tsx
'use client';

import { useEffect, useState } from 'react';
import { detectBot, isDevToolsOpen } from '@/lib/security';

export function ProtectedContent({ children }: { children: React.ReactNode }) {
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    // Check for bots
    const botResult = detectBot({
      enableUserAgentCheck: true,
      enableBehaviorCheck: true,
    });

    if (botResult.isBot) {
      setIsBlocked(true);
      window.location.href = '/safe-page';
      return;
    }

    // Monitor DevTools
    const interval = setInterval(() => {
      if (isDevToolsOpen()) {
        setIsBlocked(true);
        window.location.href = '/blocked';
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (isBlocked) {
    return (
      <div>
        <h1>Access Denied</h1>
        <p>Your access has been restricted.</p>
      </div>
    );
  }

  return <>{children}</>;
}
```

### API Route for Server-Side Bot Detection

```typescript
// app/api/check-bot/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BOT_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'bot',
  'crawler',
  'spider',
];

export async function GET(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const ua = userAgent.toLowerCase();

  // Check user agent
  const isBot = BOT_USER_AGENTS.some(pattern => ua.includes(pattern));

  // Check IP (example)
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             'unknown';

  return NextResponse.json({
    isBot,
    userAgent,
    ip,
    timestamp: new Date().toISOString(),
  });
}
```

### Middleware for Bot Blocking

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BOT_USER_AGENTS = ['bot', 'crawler', 'spider'];

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const ua = userAgent.toLowerCase();

  // Check for bots
  const isBot = BOT_USER_AGENTS.some(pattern => ua.includes(pattern));

  if (isBot) {
    // Redirect bots to safe page
    return NextResponse.redirect(new URL('/safe-page', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/offer/:path*', '/checkout/:path*'],
};
```

## Configuration Options

### Bot Detection Config

```typescript
interface BotDetectionConfig {
  enableUserAgentCheck?: boolean;
  enableIPCheck?: boolean;
  enableBehaviorCheck?: boolean;
  customUserAgents?: string[];
  customIPs?: string[];
  strictMode?: boolean;
  onBotDetected?: (reason: string) => void;
}
```

### Anti-DevTools Config

```typescript
interface AntiDevToolsConfig {
  disableRightClick?: boolean;
  disableKeyboardShortcuts?: boolean;
  disableConsole?: boolean;
  detectDevTools?: boolean;
  redirectUrl?: string;
  onDevToolsDetected?: () => void;
  debugMode?: boolean;
}
```

## API Reference

### Cloaking Filter

- `detectBot(config?)` - Detect if visitor is a bot
- `initCloakingFilter(config)` - Initialize automatic bot filtering
- `generateFingerprint()` - Generate browser fingerprint
- `checkUserInteraction()` - Check if user has interacted
- `setupInteractionTracking()` - Setup interaction tracking
- `getBotDetectionReport(config?)` - Get comprehensive report

### Anti-DevTools

- `initAntiDevTools(config)` - Initialize protection
- `stopAntiDevTools()` - Stop protection
- `isDevToolsOpen()` - Check if DevTools is open
- `protectCode(fn)` - Protect code execution
- `obfuscate(str)` - Obfuscate string
- `deobfuscate(str)` - Deobfuscate string
- `disableTextSelection()` - Disable text selection
- `disableDragDrop()` - Disable drag and drop
- `enableMaxProtection(config)` - Enable all protections
- `getProtectionStatus()` - Get protection status

## Best Practices

1. **Bot Detection**: Use moderate strictness to avoid false positives
2. **DevTools Protection**: Only enable in production
3. **User Experience**: Don't block legitimate users
4. **Testing**: Always test with actual bots/tools
5. **Monitoring**: Log detection events for analysis
6. **Legal**: Ensure compliance with local laws

## License

MIT
