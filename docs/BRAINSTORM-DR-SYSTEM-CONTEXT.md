# Direct Response Product System - Brainstorming Context

> **Arquivo de Contexto Persistente** - Atualizado durante as sessoes de brainstorming
> **Ultima Atualizacao:** 2025-11-28
> **Fase Atual:** Morphological Analysis COMPLETA

---

## Objetivo da Sessao

Criar um **Sistema Unificado de Desenvolvimento de Produtos Direct Response** com:
- Processos mapeados e formalizados
- Starter Kit template Astro
- Workflows/Agents para automacao
- Tipos de produtos com features fixas vs addons

---

## Tech Stack Fixa

| Componente | Tecnologia | Versao |
|------------|------------|--------|
| Framework | Astro | 5.16+ |
| Build Tool | Vite | (integrado) |
| Runtime | Bun | 1.2+ |
| Styling | TailwindCSS | V4 |
| Language | TypeScript/TSX | Strict |
| Background Jobs | Trigger.dev | Cloud (Free tier) |
| React Components | React 18/19 | Para islands (SilkHQ) |

---

## Recursos Existentes Identificados

### Skills Documentadas
1. `html-to-astro-migration` - **5 fases de migracao** (analisada em detalhe)
   - Localizacao: `produto-legendarios/produto001/.skills/html-to-astro-migration/`
   - 11 arquivos: setup, componentization, styling, javascript, api-integration
   - 7 decision trees (workflows)
   - 13 issues de troubleshooting
2. `utmify-integration` - Setup completo de tracking
3. `astro-dr` - Landing pages, forms, VSL
4. `infoproduct-dr-system` - ACME framework, scaling

### Componentes Reutilizaveis (produto001)
- Header, Hero, Galeria, ResumoLateral, ResumoMobile
- ConteudoSobre, Comentarios, Footer
- ModalDoacao (29KB - complexo)
- Notificacao

### API Endpoints Existentes
- `/api/create-pix` - Criacao de transacao PIX
- `/api/check-payment` - Polling de status
- `/api/webhook-payment` - Webhook de confirmacao
- `/api/utmify-confirm-payment` - Notificacao Utmify
- `/api/legendarios-data` - Metricas de campanha
- `/api/vakinha-data` - Dados de vaquinha
- `/api/health` - Health check

### Tracking Implementado
- Facebook Pixel
- Google Tag Manager (GTM)
- UTMify (pendente + aprovado)
- Rybbit (analytics)
- UTM forwarding entre paginas

### Protecoes de Seguranca Existentes (BaseLayout.astro)
- Keyboard blocking (F12, Ctrl+Shift+I/J/C, Ctrl+U/S/P)
- Right-click context menu blocking
- Text selection blocking
- DevTools detection via window dimensions (threshold 160px)
- Debugger statement detection (>100ms pause)
- Console method override (todas funcoes viram noop)
- Dev bypass system (`?d=a1b2c3` ou `localStorage._dbg_xyz=1`)

---

## Brainstorming Progress

### Tecnica: Fluxo Progressivo
1. Mind Mapping - **COMPLETO**
2. Morphological Analysis - **COMPLETO**
3. SCAMPER - PENDENTE

---

## MORPHOLOGICAL ANALYSIS COMPLETA

### Matriz Final dos 10 Packages

| # | Package | Deps | Complexidade | Tech Stack | Fonte | Status Analise |
|---|---------|------|--------------|------------|-------|----------------|
| a | cloaking-filter | - | ALTA | ua-parser-js + Arcjet (opt) + Cookie/LS | Extrair + Novo | COMPLETO |
| b | astro-migration | j | ALTA | 5 Agentes BMAD + Starter Kit | Skill + Novo | COMPLETO |
| c | tracking-snippets | - | MEDIA | UTMify, Rybbit, FB Pixel | Extrair | COMPLETO |
| d | payment-gateway | - | MEDIA | Umbrella (extensivel) | Extrair | COMPLETO |
| e | utmify-api | - | BAIXA | API client + retry | Extrair | COMPLETO |
| f | ui-gamification | - | MEDIA | Particles, Timer, Animations | Extrair + Novo | PENDENTE |
| g | github-sync | - | BAIXA | GitHub API + README gen | Criar Novo | PENDENTE |
| h | trigger-jobs | - | ALTA | Trigger.dev Cloud | Criar Novo | COMPLETO |
| i | security-anticlone | a, b | ALTA | DevTools block, Console override | Extrair | COMPLETO |
| j | ui-components | - | MEDIA | Astro + React (SilkHQ) | Extrair + SilkHQ | COMPLETO |

### Grafo de Dependencias

```
NIVEL 0 (Independentes - 8 packages):
├── a) cloaking-filter
├── c) tracking-snippets
├── d) payment-gateway
├── e) utmify-api
├── f) ui-gamification
├── g) github-sync
├── h) trigger-jobs
└── j) ui-components

NIVEL 1 (Dependem de nivel 0 - 2 packages):
├── b) astro-migration --> depende de [j]
└── i) security-anticlone --> depende de [a, b]
```

### Natureza dos Packages

| Natureza | Descricao | Packages |
|----------|-----------|----------|
| **Plugavel** | Integra em qualquer funil quando necessario | a, c, d, e, f, j |
| **Processo** | Executa em etapa especifica (build/deploy) | b, g, i |
| **Extensivel** | Base que cresce com novos jobs/funcionalidades | h |

---

## DETALHAMENTO POR PACKAGE

### a) cloaking-filter

**DECISAO TOMADA: Opcao C - Hibrido**

| Aspecto | Decisao |
|---------|---------|
| **Core** | ua-parser-js (sempre ativo) |
| **Premium** | Arcjet (opcional, fallback graceful) |
| **Persistencia** | Cookie + localStorage |
| **Anti-bypass** | Hash de IP+UA armazenado |
| **Configuracao** | YAML ou objeto JS |
| **Export** | Astro middleware + funcoes standalone |

**Arquitetura:**
```
┌─────────────────────────────────────────────────────────────┐
│                   cloaking-filter                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────────────────┐     │
│  │  ua-parser-js   │    │  Arcjet (OPCIONAL)          │     │
│  │  ─────────────  │    │  ───────────────────        │     │
│  │  • Parse UA     │    │  • AI Bot Detection         │     │
│  │  • Device type  │    │  • VPN/Tor/Proxy block      │     │
│  │  • OS/Browser   │    │  • Rate limiting            │     │
│  │  • Bot patterns │    │  • Shield protection        │     │
│  └────────┬────────┘    └──────────┬──────────────────┘     │
│           │                        │                        │
│           └────────────┬───────────┘                        │
│                        ▼                                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Decision Engine                        │    │
│  │  1. Check safe param (?param=ofclick)               │    │
│  │  2. Parse UA (ua-parser-js)                         │    │
│  │  3. Check Arcjet (if configured)                    │    │
│  │  4. Apply rules (mobile/desktop/bot)                │    │
│  │  5. Persist decision (cookie/localStorage)          │    │
│  └─────────────────────────────────────────────────────┘    │
│                        │                                    │
│           ┌────────────┴────────────┐                       │
│           ▼                         ▼                       │
│     ALLOW (real)              BLOCK (honeypot)              │
│                                                             │
│  Anti-Bypass: Cookie visitor_type + hash(IP+UA)             │
└─────────────────────────────────────────────────────────────┘
```

**Codigo existente para extrair:**
- `src/middleware.ts` (130 linhas) - Middleware principal
- `arcjet-files/arcjet-filtro/device-detector.ts` - 100+ patterns de bot
- `arcjet-files/arcjet-filtro/tracker.ts` - Sistema de tracking (IP, UA, sessao)

**Estrutura proposta:**
```
cloaking-filter/
├── src/
│   ├── core/
│   │   ├── ua-parser.ts          # Wrapper ua-parser-js
│   │   ├── device-detector.ts    # Deteccao de dispositivo
│   │   └── bot-detector.ts       # Patterns de bot
│   ├── arcjet/
│   │   ├── client.ts             # Arcjet client (opcional)
│   │   └── rules.ts              # Regras Arcjet
│   ├── persistence/
│   │   ├── cookie.ts             # Cookie manager
│   │   └── storage.ts            # localStorage manager
│   ├── middleware/
│   │   └── astro.ts              # Astro middleware export
│   └── index.ts
├── package.json
└── README.md
```

---

### b) astro-migration

**Sistema de 5 Agentes BMAD para Migracao**

| Agente | Responsabilidade | Inputs | Outputs |
|--------|------------------|--------|---------|
| **Analyzer** | Analisa HTML/CSS/JS original | Arquivos fonte | Relatorio de estrutura |
| **Migrator** | Converte para Astro + Tailwind | Relatorio + Kit | Codigo Astro migrado |
| **Validator** | Compara visual original vs migrado | Screenshots/DOM | Relatorio de diferencas |
| **Optimizer** | Performance + Bun + Astro tricks | Codigo migrado | Codigo otimizado |
| **Security** | Anti-clone + protecoes | Codigo final | Codigo protegido |

**Skill existente analisada:** `html-to-astro-migration`
- 5 fases: Setup, Componentization, Styling, JavaScript, API Integration
- 7 decision trees (flowcharts mermaid)
- 13 issues de troubleshooting documentados
- Exemplos: basic-migration.md, api-integration.md

**Fluxo por Categoria:**
```
CATEGORIA --> Configuracao especifica:

┌─ DONATE (ex: legendarios)
│   └─ Migrator + Payment Gateway + UTMify + Gamification + Security
│
├─ LOAN-CARD (ex: will-offer)
│   └─ Migrator + Quiz Gamificado + Lead Forms + Tracking + Security
│
└─ FUTURAS CATEGORIAS
    └─ Migrator + [Addons especificos]
```

**Estrutura proposta:**
```
astro-migration/
├── src/
│   ├── agents/
│   │   ├── analyzer/
│   │   │   ├── agent.yaml           # BMAD agent config
│   │   │   └── prompts/
│   │   │       ├── analyze-html.md
│   │   │       ├── analyze-css.md
│   │   │       └── analyze-js.md
│   │   ├── migrator/
│   │   │   ├── agent.yaml
│   │   │   └── prompts/
│   │   │       ├── setup-astro.md
│   │   │       ├── convert-components.md
│   │   │       └── convert-styles.md
│   │   ├── validator/
│   │   │   ├── agent.yaml
│   │   │   └── prompts/
│   │   ├── optimizer/
│   │   │   ├── agent.yaml
│   │   │   └── prompts/
│   │   └── security/
│   │       ├── agent.yaml
│   │       └── prompts/
│   ├── workflows/
│   │   ├── full-migration.yaml
│   │   ├── quick-migration.yaml
│   │   └── category-specific/
│   │       ├── donate.yaml
│   │       └── loan-card.yaml
│   ├── starter-kit/
│   │   ├── astro.config.mjs
│   │   ├── package.json
│   │   └── src/
│   └── cli/
│       └── migrate.ts
└── package.json
```

---

### c) tracking-snippets

**Fonte:** Extrair de `BaseLayout.astro`, `pix-handler.js`

**Snippets incluidos:**
1. UTMify Tracking (inclui FB Pixel integrado)
2. Rybbit Analytics (site-id: a5c0f8a5d15c)
3. UTM Capture (URL params --> cookie --> forward)
4. Cookies: `_fbp`, `_fbc`, UTM params

**Estrutura proposta:**
```
tracking-snippets/
├── src/
│   ├── components/
│   │   ├── UTMifyScript.astro
│   │   ├── RybbitScript.astro
│   │   └── FacebookPixel.astro
│   ├── utils/
│   │   ├── utm-capture.ts
│   │   └── cookie-manager.ts
│   └── index.ts
└── package.json
```

---

### d) payment-gateway

**DECISAO:** Umbrella por enquanto, extensivel para outros gateways

**Natureza:** PLUGAVEL - Integra em qualquer funil para gerar pagamento

**Fonte:** Extrair de `umbrella-api.ts`, `create-pix.ts`, `check-payment.ts`

**Estrutura proposta:**
```
payment-gateway/
├── src/
│   ├── gateways/
│   │   ├── umbrella.ts      # Adapter Umbrella
│   │   ├── interface.ts     # Gateway interface (extensivel)
│   │   └── [futuro: stripe.ts, mercadopago.ts]
│   ├── methods/
│   │   └── pix.ts           # PIX logic
│   ├── polling/
│   │   └── status-checker.ts
│   └── index.ts
└── package.json
```

---

### e) utmify-api

**Complexidade:** BAIXA - Quase pronto para extrair

**Fonte:** `utmify-integration.ts` (284 linhas)

**Eventos:** pending, approved, refused
**Retry:** Exponential backoff (ja implementado)

**Estrutura proposta:**
```
utmify-api/
├── src/
│   ├── client.ts           # API client
│   ├── events.ts           # Event builders
│   ├── retry.ts            # Retry logic
│   └── types.ts            # TypeScript types
└── package.json
```

---

### h) trigger-jobs

**DECISAO:** Usar Trigger.dev Cloud (Free tier)

**Pesquisa realizada:**

| Aspecto | Detalhe |
|---------|---------|
| **Bun Support** | Nativo (v3+) |
| **Astro Support** | Via API routes |
| **Free Tier** | $5/month compute, 20 concurrent, 60 req/min |
| **Custo estimado** | ~$1.60/mes para 3000 pagamentos |
| **Wait System** | `wait.for()` --> Checkpointed (nao paga durante espera!) |
| **Webhook** | `wait.forToken()` --> Ideal para PIX |
| **Retry** | Built-in com exponential backoff |

**Comparacao com alternativas:**
- vs BullMQ: Trigger.dev mais facil, menos infraestrutura
- vs Inngest: Similar, mas Trigger.dev tem melhor free tier e docs Bun

**Padrao recomendado para Payment Flow:**
```typescript
// trigger/pix-payment.ts
export const pixPaymentWorkflow = task({
  id: "pix-payment-workflow",
  run: async (payload) => {
    // Step 1: Create PIX payment
    const pixPayment = await createPixPayment(payload);

    // Step 2: Send pending event to UTMify
    await sendToUtmify({ event: "payment.pending", ... });

    // Step 3: Poll payment status (checkpointed - no cost during wait!)
    while (status === "pending") {
      await wait.for({ seconds: 30 }); // FREE durante espera
      status = await checkPixStatus(pixPayment.id);
    }

    // Step 4: Send approved event
    await sendToUtmify({ event: "payment.approved", ... });
  }
});
```

**Estrutura proposta:**
```
trigger-jobs/
├── src/
│   ├── tasks/
│   │   ├── pix-payment.ts       # Payment workflow
│   │   ├── utmify-events.ts     # UTMify integration
│   │   └── index.ts
│   ├── utils/
│   │   └── retry.ts
│   └── trigger.config.ts
└── package.json
```

---

### i) security-anticlone

**Analise do codigo existente em BaseLayout.astro:**

| Protecao | Implementacao | Localizacao |
|----------|---------------|-------------|
| Keyboard Blocking | F12, Ctrl+Shift+I/J/C, Ctrl+U/S/P | lines 129-179 |
| Right-click Block | contextmenu preventDefault | lines 111-115 |
| Text Selection | selectstart + dragstart block | lines 117-127 |
| DevTools Detection | outerHeight - innerHeight > 160px | lines 181-202 |
| Debugger Detection | performance.now() em debugger | lines 224-236 |
| Console Override | Todas funcoes --> noop | lines 238-245 |

**Sistema de Bypass (dev-bypass.ts):**
- `import.meta.env.DEV === true` --> automatico
- Localhost/127.0.0.1 --> `?d=a1b2c3` ou `localStorage._dbg_xyz=1`
- Producao --> totalmente bloqueado

**Estrutura proposta:**
```
security-anticlone/
├── src/
│   ├── protections/
│   │   ├── devtools-blocker.ts   # Deteccao + redirect
│   │   ├── keyboard-blocker.ts   # Shortcuts
│   │   ├── console-override.ts   # Disable console
│   │   └── selection-blocker.ts  # Text selection
│   ├── bypass/
│   │   └── dev-bypass.ts         # Sistema de bypass
│   ├── components/
│   │   └── ProtectionScript.astro
│   └── index.ts
└── package.json
```

---

### j) ui-components

**DECISAO:** Astro components + React islands (SilkHQ obrigatorio)

**Analise do SilkHQ:**

| Aspecto | Detalhe |
|---------|---------|
| **O que e** | Biblioteca React premium de Sheet/Drawer |
| **Licenca** | Comercial (requer compra) |
| **React Required** | Obrigatorio (Compound Component Pattern) |
| **Estilo** | Headless (CSS e responsabilidade do dev) |
| **Animacoes** | Travel-driven + Spring physics |
| **Acessibilidade** | WAI-ARIA completo |
| **Mobile** | Swipe gestures nativos |
| **Localizacao** | `will-offer/docs/silk-component/` |

**Integracao com Astro:**
```astro
---
import PaymentSheet from '../components/PaymentSheet';
---
<PaymentSheet client:visible />
```

**Comunicacao com Astro (Custom Events):**
```javascript
// Dispatch do React
window.dispatchEvent(new CustomEvent('payment:complete', { detail: {...} }));

// Listen no Astro
window.addEventListener('payment:complete', (e) => { ... });
```

**Estrutura proposta:**
```
ui-components/
├── src/
│   ├── astro/                    # Componentes Astro puros
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── Galeria.astro
│   │   ├── Comentarios.astro
│   │   └── ...
│   ├── react/                    # Componentes React (islands)
│   │   ├── PaymentSheet/
│   │   │   ├── PaymentSheet.tsx
│   │   │   ├── PaymentSheet.module.css
│   │   │   └── index.ts
│   │   ├── Drawer/
│   │   └── Toast/
│   ├── shared/
│   │   ├── styles/
│   │   └── hooks/
│   └── index.ts
├── package.json
└── tsconfig.json
```

**Dependencias:**
```json
{
  "dependencies": {
    "@silk-hq/components": "^latest",
    "react": "^18.x || ^19.x",
    "react-dom": "^18.x || ^19.x"
  },
  "peerDependencies": {
    "astro": ">=4.0.0"
  }
}
```

---

## Categorias de Produtos

### Hierarquia de Produtos

```
CATEGORIA (tipo de produto DR)
    └── PRODUTO (instancia especifica)
            ├── Processos Fixos (da categoria)
            └── Addons (especificos do produto)
```

### Categorias Identificadas

| # | Categoria | Produtos Exemplo | Descricao | Modelo de Monetizacao |
|---|-----------|------------------|-----------|----------------------|
| 1 | **donate** | Legendarios | Produtos de doacao/crowdfunding | Doacoes diretas (PIX) |
| 2 | **loan-card** | will-offer, card-shopee | Solicitacao de emprestimo ou cartao | Afiliado/Lead |

### Caracteristicas por Categoria

**1. DONATE (Doacoes)**
- Foco: Arrecadacao de fundos
- Funil: Landing --> Modal de Doacao --> PIX --> Confirmacao
- Elementos: Meta de arrecadacao, progresso visual, comentarios sociais
- Tracking: UTMify com eventos pending/approved
- Payment: PIX via Umbrella API

**2. LOAN-CARD (Emprestimo/Cartao)**
- Foco: Captura de leads para produtos financeiros
- Funil: Landing --> Quiz Gamificado --> Formulario CPF --> Analise --> Oferta
- Variantes:
  - will-offer: Solicitacao direta
  - card-shopee: Quiz gamificado com valor pre-aprovado
- Tracking: Facebook Pixel, GTM, UTMify
- Monetizacao: Afiliado (por lead qualificado)

### Categorias Futuras (a definir quando necessario)

| # | Categoria Potencial | Descricao |
|---|---------------------|-----------|
| ? | **infoproduct** | Venda de cursos/ebooks |
| ? | **ecommerce** | Produtos fisicos DR |
| ? | **lead-gen** | Captura de leads generica |
| ? | **quiz-funnel** | Funis baseados em quiz |
| ? | **webinar** | Funis de webinar/VSL |

---

## Estrutura Monorepo Proposta

```
central-offers/
├── packages/
│   ├── cloaking-filter/        # a) Filtro/Honeypot
│   ├── astro-migration/        # b) Sistema de migracao
│   ├── tracking-snippets/      # c) UTMify, Rybbit, UTM
│   ├── payment-gateway/        # d) Umbrella, PIX, QR
│   ├── utmify-api/             # e) Integracao UTMify
│   ├── ui-gamification/        # f) Particulas, timers
│   ├── github-sync/            # g) Sync GitHub
│   ├── trigger-jobs/           # h) Trigger.dev jobs
│   ├── security-anticlone/     # i) Obfuscacao, protecao
│   └── ui-components/          # j) Componentes base + React
│
├── templates/
│   └── starter-kit/            # Template Astro base
│
├── products/                   # Produtos especificos
│   ├── legendarios/
│   ├── will-offer/
│   └── card-shopee/
│
├── agents/                     # Workflows de agentes BMAD
│   ├── analyzer/
│   ├── migrator/
│   ├── validator/
│   ├── optimizer/
│   └── security-auditor/
│
└── docs/
    └── ...
```

---

## Decisoes Tomadas

| # | Data | Decisao | Contexto |
|---|------|---------|----------|
| 1 | 2025-11-27 | Tech stack fixa: Astro + Bun + Tailwind V4 + TSX | Padrao para todos os produtos |
| 2 | 2025-11-27 | Abordagem: Fluxo Progressivo para brainstorming | Mind Mapping --> Morphological --> SCAMPER |
| 3 | 2025-11-27 | Estrutura Monorepo para packages | 10 packages identificados |
| 4 | 2025-11-27 | Foco inicial: Features Fixas (antes de categorias) | Categorias/Addons depois |
| 5 | 2025-11-27 | Hierarquia: Categoria --> Produto --> (Fixos + Addons) | Estrutura clara de heranca |
| 6 | 2025-11-28 | **cloaking-filter: Opcao C - Hibrido** | ua-parser-js + Arcjet opcional |
| 7 | 2025-11-28 | **payment-gateway: Extensivel** | Umbrella agora, outros depois |
| 8 | 2025-11-28 | **trigger-jobs: Trigger.dev Cloud** | Free tier suficiente |
| 9 | 2025-11-28 | **ui-components: Astro + React (SilkHQ)** | React obrigatorio para payment sheet |
| 10 | 2025-11-28 | **astro-migration: 5 Agentes BMAD** | Analyzer, Migrator, Validator, Optimizer, Security |

---

## Status da Sessao (PARA CONTINUAR)

**Sessao atualizada em:** 2025-11-28
**Tecnica atual:** Fluxo Progressivo
**Fase atual:** Morphological Analysis COMPLETO --> Proximo: SCAMPER

### Completado nesta sessao:
- [x] Mind Mapping dos 10 packages
- [x] Morphological Analysis de 8/10 packages (f, g pendentes)
- [x] Analise da skill html-to-astro-migration (11 arquivos, 5 fases)
- [x] Analise do SilkHQ React component
- [x] Pesquisa Trigger.dev (features, pricing, integracao)
- [x] Analise DevTools protection existente
- [x] Decisoes arquiteturais para packages a, b, d, h, i, j
- [x] Estruturas propostas para cada package
- [x] Grafo de dependencias entre packages

### Para continuar:
1. [ ] Finalizar Morphological Analysis (f, g)
2. [ ] **SCAMPER** - Refinar e otimizar os packages
3. [ ] Definir prioridade de implementacao
4. [ ] Criar Product Brief final
5. [ ] Iniciar implementacao do primeiro package

---

## Proximos Passos (Ordem de Prioridade)

### Imediato (proxima sessao):
1. [ ] Completar analise de f (ui-gamification) e g (github-sync)
2. [ ] Aplicar SCAMPER nos packages criticos
3. [ ] Priorizar ordem de implementacao

### Curto prazo:
4. [ ] Estruturar Starter Kit Astro
5. [ ] Criar primeiro package (sugestao: e - utmify-api, mais simples)
6. [ ] Configurar Trigger.dev no projeto

### Medio prazo:
7. [ ] Criar agentes BMAD para migracao
8. [ ] Implementar cloaking-filter
9. [ ] Extrair ui-components + integrar SilkHQ

---

## Notas e Insights

### Insight 1: Hierarquia Clara
```
CATEGORIA (donate, loan-card, etc)
    └── PRODUTO (legendarios, will-offer, etc)
            ├── Processos Fixos (10 packages - iguais para todos)
            └── Addons (especificos do produto/categoria)
```

### Insight 2: Packages por Complexidade
- ALTA (priorizar design): cloaking-filter, astro-migration, trigger-jobs, security-anticlone
- MEDIA (extrair do existente): tracking-snippets, payment-gateway, ui-gamification, ui-components
- BAIXA (simples): utmify-api, github-sync

### Insight 3: Codigo Existente para Extrair
- **Legendarios (produto001)**: UTMify, Payment, Tracking, Components, Security
- **will-offer archive**: Nanostores, Zod schemas, CVA components, SilkHQ docs
- **arcjet-files/**: Device detector, tracker, middleware alternativo

### Insight 4: Agentes BMAD Necessarios
1. Agente Analisador (HTML/CSS/JS)
2. Agente Migrador (Astro)
3. Agente Validador (comparacao visual)
4. Agente Otimizador (performance)
5. Agente de Seguranca (anti-clone)

### Insight 5: Trigger.dev e Ideal
- wait.for() checkpointed = nao paga durante espera
- Custo estimado: ~$1.60/mes para 3000 pagamentos
- Free tier: $5/month compute
- Bun support nativo

### Insight 6: SilkHQ Requer React
- Componente comercial premium
- Obrigatorio usar React islands no Astro
- Comunicacao via Custom Events
- Licenca comercial necessaria

---

## Referencias de Arquivos Importantes

### Skill de Migracao
- `produto-legendarios/produto001/.skills/html-to-astro-migration/`

### Protecoes de Seguranca
- `produto-legendarios/produto001/src/layouts/BaseLayout.astro` (lines 85-248)
- `produto-legendarios/produto001/src/lib/dev-bypass.ts`

### Cloaking/Filtro
- `produto-legendarios/produto001/src/middleware.ts`
- `produto-legendarios/produto001/arcjet-files/arcjet-filtro/`

### Payment/UTMify
- `produto-legendarios/produto001/src/lib/umbrella-api.ts`
- `produto-legendarios/produto001/src/lib/utmify-integration.ts`
- `produto-legendarios/produto001/src/pages/api/`

### SilkHQ
- `will-offer/docs/silk-component/`

### Documentacao
- `produto-legendarios/produto001/docs/` (14 arquivos de documentacao)

---

*Este arquivo e atualizado continuamente durante as sessoes de brainstorming*
*Ultima atualizacao: 2025-11-28 por Mary (Business Analyst Agent)*
