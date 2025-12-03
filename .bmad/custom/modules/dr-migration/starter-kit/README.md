# DR Migration Starter Kit

> Template Astro 5.x pré-configurado para produtos Direct Response

## Visão Geral

Este starter-kit fornece uma base completa para criar projetos DR (Direct Response) usando:

- **Astro 5.3+** - Framework web moderno
- **TailwindCSS V4** - Utility-first CSS
- **React 19** - Para componentes interativos (islands)
- **TypeScript** - Type safety
- **Bun** - Runtime JavaScript rápido

## Estrutura

```
starter-kit/
├── base/                    # Arquivos base do projeto
│   ├── package.json         # Dependências
│   ├── astro.config.mjs     # Configuração Astro
│   ├── tsconfig.json        # Configuração TypeScript
│   ├── .env.example         # Template de variáveis
│   ├── .gitignore
│   └── src/
│       ├── layouts/         # BaseLayout.astro
│       ├── components/      # Button, Card, Section, Timer
│       ├── lib/             # utils, tracking, config
│       └── styles/          # global.css (Tailwind V4)
│
├── presets/                 # Templates por categoria
│   ├── donate/              # Produtos de doação PIX
│   │   ├── routes.json      # Mapa de rotas
│   │   ├── pages/           # index, checkout, obrigado
│   │   └── components/      # DonationSelector
│   │
│   └── loan-card/           # Leads financeiros
│       ├── routes.json      # Mapa de rotas
│       ├── pages/           # index, cadastro, analise, resultado
│       └── components/      # LeadForm
│
└── packages/                # Módulos plug-and-play
    ├── tracking/            # FB Pixel, UTMify, Rybbit
    ├── payment/             # Umbrella PIX Gateway
    ├── security/            # Cloaking, Anti-DevTools
    └── ui/                  # Particles, Confetti, Urgency Bar
```

## Quick Start

### Usando o Workflow (Recomendado)

```bash
# Invocar o agente migrador
/bmad:dr-migration:agents:migrador

# Usar comando de novo projeto
*new-project
```

O workflow irá guiar você através das opções.

### Manualmente

```bash
# 1. Copiar base
cp -r starter-kit/base/ meu-projeto/

# 2. Copiar preset (escolha um)
cp -r starter-kit/presets/donate/pages/* meu-projeto/src/pages/
# OU
cp -r starter-kit/presets/loan-card/pages/* meu-projeto/src/pages/

# 3. Copiar packages desejados
cp -r starter-kit/packages/tracking meu-projeto/src/packages/

# 4. Instalar e rodar
cd meu-projeto
bun install
bun run dev
```

## Base

### Configuração Astro

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### Componentes Incluídos

| Componente | Tipo | Descrição |
|------------|------|-----------|
| BaseLayout.astro | Layout | Layout base com meta tags e tracking |
| Button.astro | Astro | Botão com variantes |
| Card.astro | Astro | Container estilizado |
| Section.astro | Astro | Seção com container |
| Timer.tsx | React | Countdown timer |

### Utilitários

| Arquivo | Funções |
|---------|---------|
| utils.ts | formatCurrency, formatCPF, isValidCPF, isValidEmail, etc. |
| tracking.ts | trackFBEvent, fbEvents, trackConversion, trackLead |
| config.ts | siteConfig, trackingConfig, productConfig |

## Presets

### DONATE

Para produtos de doação/contribuição PIX.

**Páginas:**
- `/` - Landing page com VSL e CTA
- `/checkout` - Seleção de valor e QR Code PIX
- `/obrigado` - Confirmação de pagamento

**Componentes:**
- `DonationSelector.tsx` - Seletor de valores (R$27, R$47, R$97)

### LOAN-CARD

Para produtos de geração de leads financeiros.

**Páginas:**
- `/` - Landing page com benefícios
- `/cadastro` - Formulário multi-step (CPF, nome, telefone, email)
- `/analise` - Loading animado com passos
- `/resultado` - Ofertas de parceiros

**Componentes:**
- `LeadForm.tsx` - Formulário de captura com validação

## Packages

### tracking/

Integração com plataformas de tracking.

```typescript
import { fbEvents, trackConversion } from "@packages/tracking";

// Track page view
fbEvents.viewContent({ contentName: "Landing Page" });

// Track conversion
trackConversion({ value: 47, orderId: "123" });
```

### payment/

Gateway de pagamento PIX (Umbrella).

```typescript
import { createPixPayment, getPaymentStatus } from "@packages/payment";

// Gerar PIX
const payment = await createPixPayment({
  amount: 4700, // centavos
  description: "Contribuição",
});

// Verificar status
const status = await getPaymentStatus(payment.id);
```

### security/

Proteção contra bots e cópias.

```typescript
import { detectBot, initAntiDevTools } from "@packages/security";

// Detectar bot
const isBot = await detectBot();

// Bloquear DevTools
initAntiDevTools({ redirectUrl: "https://google.com" });
```

### ui/

Efeitos visuais e componentes de urgência.

```tsx
import { Particles, Confetti, UrgencyBar } from "@packages/ui";

// Partículas de celebração
<Particles type="celebration" />

// Confetti
<Confetti active={showConfetti} />

// Barra de urgência
<UrgencyBar endTime={deadline} />
```

## Variáveis de Ambiente

```env
# Site
PUBLIC_SITE_URL=https://seu-dominio.com
PUBLIC_SITE_NAME="Nome do Produto"

# Tracking
PUBLIC_FB_PIXEL_ID=123456789
PUBLIC_UTMIFY_PIXEL_ID=abc123

# Pagamento
PUBLIC_UMBRELLA_PUBLIC_KEY=pk_xxx
UMBRELLA_API_KEY=sk_xxx
```

## Customização

### Cores

Edite `src/styles/global.css`:

```css
@theme {
  --color-primary: #seu-cor;
  --color-secondary: #sua-cor;
  --color-accent: #sua-cor;
}
```

### Fontes

Edite `src/layouts/BaseLayout.astro`:

```html
<link href="https://fonts.googleapis.com/css2?family=SuaFonte&display=swap" rel="stylesheet" />
```

### Componentes

Adicione novos componentes em:
- `src/components/astro/` - Componentes Astro
- `src/components/react/` - Componentes React (islands)

## Scripts

```bash
bun run dev       # Desenvolvimento
bun run build     # Build produção
bun run preview   # Preview do build
bun run check     # Verificar tipos
```

## Requisitos

- Bun 1.2+
- Node.js 20+ (opcional, para compatibilidade)

## Extensibilidade

O starter-kit foi projetado para ser moldável:

1. **Novos Presets**: Adicione em `presets/` seguindo a estrutura existente
2. **Novos Packages**: Adicione em `packages/` com index.ts e README.md
3. **Componentes**: Adicione em `base/src/components/`
4. **Utilitários**: Adicione em `base/src/lib/`

---

*Parte do módulo DR Migration - BMad Method v6*
