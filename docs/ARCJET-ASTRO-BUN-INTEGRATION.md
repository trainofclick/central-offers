# 🛡️ Arcjet + Astro + Bun + Trigger.dev - Arquitetura Integrada

> **Stack Completa:** Arcjet (proteção edge) + Astro (frontend) + Bun (runtime) + Trigger.dev (background jobs)

---

## 🎯 Resumo Executivo

**Arcjet e Trigger.dev são COMPLEMENTARES, não excludentes!**

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUXO DE REQUISIÇÃO                       │
└─────────────────────────────────────────────────────────────┘

1️⃣ REQUEST → 2️⃣ ARCJET FILTER → 3️⃣ ASTRO ENDPOINT → 4️⃣ TRIGGER.DEV TASK
   (Cliente)    (Proteção Edge)    (Lógica Imediata)  (Processamento Async)

🔹 Arcjet: Bloqueia ANTES (bots, rate limit, spam)
🔹 Trigger.dev: Processa DEPOIS (PIX, UTMIFY, webhooks)
```

---

## 🏗️ Arquitetura Recomendada

### 📦 Camadas da Stack

| Camada | Tecnologia | Responsabilidade |
|--------|-----------|------------------|
| **1. Proteção Edge** | 🛡️ **Arcjet** | Bot detection, rate limiting, spam filter |
| **2. Frontend/API** | 🚀 **Astro + Bun** | Páginas estáticas + API endpoints |
| **3. Background Jobs** | ⚡ **Trigger.dev** | PIX processing, UTMIFY events, webhooks |
| **4. Tracking** | 📊 **UTMIFY** | Analytics de conversão |

### 🔄 Fluxo Completo (Exemplo: Geração de PIX)

```typescript
// 1. Cliente acessa landing page
GET /produto-legendarios
  ↓
// 2. Arcjet valida request (bot detection)
Arcjet Middleware: ✅ Humano detectado
  ↓
// 3. Cliente clica "Gerar PIX"
POST /api/create-pix
  ↓
// 4. Arcjet valida (rate limit + bot)
Arcjet Protection: ✅ Limite OK, não é bot
  ↓
// 5. Astro endpoint gera PIX
Gateway API: PIX criado (ID: PIX-123)
  ↓
// 6. Trigger.dev processa em background
Task: process-pix-payment (async)
  - Enviar UTMIFY pending ✅
  - Polling status PIX (15min)
  - Se pago → UTMIFY paid ✅
```

---

## 🛡️ Arcjet - Integração com Astro + Bun

### 1️⃣ Instalação

```bash
# No diretório produto-legendarios
bun add @arcjet/bun
```

### 2️⃣ Configuração Base

```typescript
// produto-legendarios/src/lib/arcjet.ts
import arcjet, { 
  detectBot, 
  shield, 
  tokenBucket,
  validateEmail,
  protectSignup 
} from "@arcjet/bun";

export const aj = arcjet({
  key: import.meta.env.ARCJET_KEY, // Obtenha em https://app.arcjet.com
  rules: [
    // Shield: WAF protection
    shield({
      mode: "LIVE", // ou "DRY_RUN" para testar
    }),
    
    // Bot detection global
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc.
      ],
      deny: [
        "AUTOMATED", // Scrapers
      ],
    }),
  ],
});

// Rate limiting específico para API
export const pixRateLimit = tokenBucket({
  mode: "LIVE",
  characteristics: ["ip"], // Por IP
  refillRate: 5, // 5 tokens
  interval: "1m", // por minuto
  capacity: 10, // máx 10 requests acumulados
});

// Signup protection (para formulários)
export const signupProtection = protectSignup({
  email: {
    mode: "LIVE",
    block: ["DISPOSABLE", "NO_MX_RECORDS"],
  },
  bots: {
    mode: "LIVE",
  },
  rateLimit: {
    mode: "LIVE",
    interval: "10m",
    max: 3, // Máx 3 tentativas de signup em 10min
  },
});
```

### 3️⃣ Middleware Global (Astro)

```typescript
// produto-legendarios/src/middleware.ts
import { defineMiddleware } from "astro:middleware";
import { aj } from "./lib/arcjet";

export const onRequest = defineMiddleware(async (context, next) => {
  // Converte Request do Astro para formato Arcjet
  const request = new Request(context.url, {
    headers: context.request.headers,
    method: context.request.method,
  });

  // Aplica proteções Arcjet
  const decision = await aj.protect(request);

  // Se bloqueado, retorna 403
  if (decision.isDenied()) {
    return new Response(
      JSON.stringify({
        error: "Acesso bloqueado",
        reason: decision.reason,
        ruleId: decision.ruleResults[0]?.ruleId,
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Se permitido, continua
  return next();
});
```

### 4️⃣ Endpoint com Arcjet + Trigger.dev

```typescript
// produto-legendarios/src/pages/api/create-pix.ts
import type { APIRoute } from "astro";
import { aj, pixRateLimit } from "../../lib/arcjet";
import { processPixPayment } from "../../tasks/pix-processor"; // Trigger.dev task

export const POST: APIRoute = async ({ request }) => {
  // 1. Proteção Arcjet (rate limit específico)
  const decision = await aj.protect(request, {
    requested: 1, // Consome 1 token
    ...pixRateLimit,
  });

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return new Response(
        JSON.stringify({
          error: "Muitas tentativas. Aguarde 1 minuto.",
          remaining: decision.reason.remaining,
          resetTime: decision.reason.resetTime,
        }),
        { status: 429 }
      );
    }

    if (decision.reason.isBot()) {
      return new Response(
        JSON.stringify({ error: "Bot detectado" }),
        { status: 403 }
      );
    }

    return new Response(
      JSON.stringify({ error: "Acesso negado" }),
      { status: 403 }
    );
  }

  // 2. Se passou Arcjet, processa PIX
  const body = await request.json();
  
  try {
    // Gerar PIX no Gateway (síncrono)
    const pixData = await fetch(import.meta.env.GATEWAY_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: body.amount,
        customer: body.customer,
      }),
    }).then(r => r.json());

    // 3. Trigger.dev processa em background (assíncrono)
    await processPixPayment.trigger({
      pixId: pixData.id,
      productId: "legendarios",
      amount: body.amount,
      utmParams: body.utmParams || {},
      userAgent: request.headers.get("user-agent") || "",
      ip: request.headers.get("x-forwarded-for") || "",
    });

    // 4. Resposta imediata ao cliente
    return new Response(
      JSON.stringify({
        success: true,
        pixId: pixData.id,
        qrCode: pixData.qrCode,
        pixCopyPaste: pixData.pixCopyPaste,
      }),
      { status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erro ao gerar PIX" }),
      { status: 500 }
    );
  }
};
```

### 5️⃣ Bot Detection Avançado

```typescript
// produto-legendarios/src/pages/api/filter-access.ts
import type { APIRoute } from "astro";
import { detectBot } from "@arcjet/bun";
import { aj } from "../../lib/arcjet";

// Filtro dedicado bot/concorrente
const botFilter = detectBot({
  mode: "LIVE",
  allow: [], // Não permite nenhum bot
});

export const POST: APIRoute = async ({ request }) => {
  const decision = await aj.protect(request, {
    ...botFilter,
  });

  const userAgent = request.headers.get("user-agent") || "";
  const isMobile = /Mobile|Android|iPhone/i.test(userAgent);

  // Se é bot
  if (decision.isDenied() && decision.reason.isBot()) {
    return new Response(
      JSON.stringify({
        redirect: "/blocked",
        reason: "Bot detectado",
      }),
      { status: 403 }
    );
  }

  // Se passou, redireciona baseado em device
  return new Response(
    JSON.stringify({
      redirect: isMobile ? "/mobile-offer" : "/desktop-offer",
      device: isMobile ? "mobile" : "desktop",
    }),
    { status: 200 }
  );
};
```

---

## ⚡ Trigger.dev - Background Jobs

### Task Reutilizável (Todos os Produtos)

```typescript
// shared/tasks/pix-processor.ts (reutilizável)
import { task } from "@trigger.dev/sdk/v3";

export interface PixPayload {
  pixId: string;
  productId: string;
  amount: number;
  utmParams: Record<string, string>;
  userAgent: string;
  ip: string;
}

export const processPixPayment = task({
  id: "process-pix-payment",
  retry: { maxAttempts: 3 },
  run: async (payload: PixPayload) => {
    // 1. Validar se não é bot (redundância, já passou Arcjet)
    // Arcjet já validou, mas podemos logar
    console.log(`Processing PIX for ${payload.productId}:${payload.pixId}`);

    // 2. Enviar evento UTMIFY pending
    await sendUTMIFY({
      event: "pending",
      orderId: payload.pixId,
      platform: "landing_page",
      paymentMethod: "pix",
      status: "pending",
      trackingParameters: {
        utmSource: payload.utmParams.utm_source,
        utmMedium: payload.utmParams.utm_medium,
        utmCampaign: payload.utmParams.utm_campaign,
      },
      products: [{
        productId: 1,
        name: `Doação ${payload.productId}`,
        quantity: 1,
        price: payload.amount,
      }],
    });

    // 3. Polling status PIX (15min max)
    for (let i = 0; i < 180; i++) {
      const status = await checkPixStatus(payload.pixId);

      if (status === "paid") {
        // Enviar UTMIFY paid
        await sendUTMIFY({
          event: "paid",
          orderId: payload.pixId,
          status: "approved",
          approvedDate: new Date().toISOString(),
        });

        return { status: "paid", attempts: i + 1 };
      }

      if (status === "expired") {
        return { status: "expired", attempts: i + 1 };
      }

      // Aguardar 5s
      await new Promise(r => setTimeout(r, 5000));
    }

    return { status: "timeout", attempts: 180 };
  },
});

// Helpers
async function sendUTMIFY(data: any) {
  await fetch(process.env.UTMIFY_API_URL!, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.UTMIFY_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

async function checkPixStatus(pixId: string) {
  const res = await fetch(`${process.env.GATEWAY_API_URL}/status/${pixId}`);
  const data = await res.json();
  return data.status; // "pending" | "paid" | "expired"
}
```

---

## 🎯 Funcionalidades Arcjet Úteis para DR

### 1. **Email Validation** (Formulários de Captura)

```typescript
// src/pages/api/submit-lead.ts
import { validateEmail } from "@arcjet/bun";
import { aj } from "../../lib/arcjet";

const emailValidator = validateEmail({
  mode: "LIVE",
  block: [
    "DISPOSABLE", // Emails temporários
    "NO_MX_RECORDS", // Domínio sem servidor email
    "INVALID", // Formato inválido
  ],
});

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  
  const decision = await aj.protect(request, {
    email: body.email,
    ...emailValidator,
  });

  if (decision.isDenied()) {
    return new Response(
      JSON.stringify({ error: "Email inválido ou temporário" }),
      { status: 400 }
    );
  }

  // Salvar lead...
};
```

### 2. **Sensitive Info Detection** (PII)

```typescript
import { detectBot, sensitiveInfo } from "@arcjet/bun";

const piiProtection = sensitiveInfo({
  mode: "LIVE",
  deny: ["EMAIL", "PHONE", "CREDIT_CARD", "IP_ADDRESS"],
});

// Bloqueia se alguém tentar enviar dados sensíveis em campos públicos
const decision = await aj.protect(request, {
  ...piiProtection,
});
```

### 3. **Signup Form Protection**

```typescript
// src/pages/api/signup.ts
import { protectSignup } from "@arcjet/bun";

const signupProtection = protectSignup({
  email: { mode: "LIVE", block: ["DISPOSABLE"] },
  bots: { mode: "LIVE" },
  rateLimit: {
    mode: "LIVE",
    interval: "10m",
    max: 3,
  },
});

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  const decision = await aj.protect(request, {
    email: body.email,
    ...signupProtection,
  });

  if (decision.isDenied()) {
    if (decision.reason.isEmail()) {
      return new Response(
        JSON.stringify({ error: "Email inválido" }),
        { status: 400 }
      );
    }
    if (decision.reason.isRateLimit()) {
      return new Response(
        JSON.stringify({ error: "Muitas tentativas" }),
        { status: 429 }
      );
    }
  }

  // Processar signup...
};
```

---

## 💰 Custo Arcjet

### Planos (2024)

| Plano | Requests/Mês | Custo | Ideal Para |
|-------|--------------|-------|------------|
| **Free** | 100.000 | $0 | Teste/MVP |
| **Starter** | 1.000.000 | $20/mês | Small business |
| **Business** | 10.000.000 | $200/mês | Scale-up |

**💡 Para DR:** Plano Free é suficiente para começar (100k requests = ~3.300/dia)

---

## 📊 Comparação: Arcjet vs Implementação Manual

| Feature | Com Arcjet | Sem Arcjet (Manual) |
|---------|------------|---------------------|
| **Bot Detection** | ✅ ML-powered, 99%+ accuracy | ❌ User-Agent check (50% accuracy) |
| **Rate Limiting** | ✅ Token bucket distribuído | ❌ In-memory (perde ao reiniciar) |
| **Email Validation** | ✅ MX, disposable, syntax | ❌ Regex básico |
| **DDoS Protection** | ✅ Shield WAF | ❌ Vulnerável |
| **Tempo Implementação** | 🟢 30min | 🔴 2-3 dias |
| **Manutenção** | 🟢 Zero | 🔴 Alta |
| **Falsos Positivos** | 🟢 <1% | 🔴 10-20% |

---

## 🚀 Setup Completo - Passo a Passo

### Semana 1: Arcjet + Astro

```bash
# 1. Instalar Arcjet
cd produto-legendarios
bun add @arcjet/bun

# 2. Obter chave API (grátis)
# Acesse: https://app.arcjet.com
# Crie conta → Novo projeto → Copie a chave

# 3. Adicionar ao .env
echo "ARCJET_KEY=ajkey_..." >> .env

# 4. Criar configuração
touch src/lib/arcjet.ts
# (Cole código da seção 2️⃣)

# 5. Adicionar middleware
touch src/middleware.ts
# (Cole código da seção 3️⃣)

# 6. Testar
bun run dev
```

### Semana 2: Trigger.dev

```bash
# 1. Setup Trigger.dev (Docker/Railway)
# Ver: docs/TRIGGER-VS-N8N-DIRECT-RESPONSE-ANALYSIS.md

# 2. Criar task reutilizável
mkdir -p shared/tasks
touch shared/tasks/pix-processor.ts

# 3. Integrar com Arcjet endpoints
# (Modificar create-pix.ts conforme seção 4️⃣)
```

---

## 🎯 Arquitetura Final - Produto Legendários

```typescript
┌──────────────────────────────────────────────────────────────┐
│                  PRODUTO-LEGENDARIOS                          │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  📄 Frontend (Astro SSG)                                      │
│  ├─ index.astro                 → Landing page                │
│  ├─ obrigado.astro             → Página de obrigado          │
│  └─ blocked.astro              → Bloqueado por bot           │
│                                                               │
│  🔌 API Endpoints (Astro SSR)                                 │
│  ├─ /api/create-pix            → Gera PIX (Arcjet + Trigger) │
│  ├─ /api/filter-access         → Bot detection               │
│  └─ /api/submit-lead           → Email validation            │
│                                                               │
│  🛡️ Arcjet Protection (Edge)                                  │
│  ├─ middleware.ts              → Proteção global             │
│  ├─ lib/arcjet.ts              → Configurações               │
│  └─ detectBot + rateLimit + shield                           │
│                                                               │
│  ⚡ Trigger.dev Tasks (Background)                            │
│  └─ shared/tasks/              → Reutilizáveis               │
│      └─ pix-processor.ts       → PIX + UTMIFY                │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔍 Monitoramento e Logs

### Arcjet Dashboard

```
https://app.arcjet.com

Métricas disponíveis:
✅ Total requests blocked
✅ Bot detection stats
✅ Rate limit hits
✅ Top blocked IPs
✅ Email validation failures
```

### Logs Combinados

```typescript
// Em cada endpoint
console.log({
  timestamp: new Date().toISOString(),
  arcjet: {
    decision: decision.conclusion,
    reason: decision.reason?.type,
    ip: request.headers.get("x-forwarded-for"),
  },
  trigger: {
    taskId: result.id,
    status: "triggered",
  },
});
```

---

## ✅ Checklist de Implementação

- [ ] Instalar Arcjet via Bun
- [ ] Configurar chave API no .env
- [ ] Criar lib/arcjet.ts com regras
- [ ] Adicionar middleware.ts global
- [ ] Implementar rate limit em /api/create-pix
- [ ] Implementar bot detection em /api/filter-access
- [ ] Testar em desenvolvimento (DRY_RUN mode)
- [ ] Ativar LIVE mode em produção
- [ ] Configurar Trigger.dev (ver outro doc)
- [ ] Integrar tasks Trigger.dev com endpoints
- [ ] Monitar dashboard Arcjet
- [ ] Ajustar thresholds conforme necessário

---

## 🎓 Recursos Adicionais

**Arcjet:**
- 📖 Docs: https://docs.arcjet.com
- 💻 GitHub Astro Example: https://github.com/arcjet/example-astro
- 💬 Discord: https://discord.gg/arcjet

**Bun:**
- 📖 Arcjet + Bun: https://docs.arcjet.com/get-started/bun

---

## 🎬 Conclusão

### ✅ Arcjet + Trigger.dev = Stack Completa

| Camada | Tecnologia | Função |
|--------|-----------|--------|
| **Edge Protection** | 🛡️ Arcjet | Bloqueia ameaças instantaneamente |
| **Background Jobs** | ⚡ Trigger.dev | Processa tarefas assíncronas |

**Não são concorrentes, são complementares!**

- **Arcjet:** Protege ANTES de processar (síncrono, <10ms)
- **Trigger.dev:** Processa DEPOIS de validar (assíncrono, background)

### 💰 Custo Total Estimado

```
Arcjet Free:        $0/mês (até 100k requests)
Trigger.dev VPS:    R$ 35/mês (Hetzner)
TOTAL:              R$ 35/mês

vs

Implementação Manual + N8n:  R$ 65/mês
vs
Zapier + Cloudflare WAF:     R$ 1.800+/mês
```

**🏆 Economia: 98% vs soluções cloud!**

---

**📅 Criado:** Novembro 2024  
**🔄 Stack:** Arcjet + Astro + Bun + Trigger.dev  
**✍️ Baseado em:** Docs oficiais Arcjet + pesquisas 2024