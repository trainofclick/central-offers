# DR Migration Module

> Módulo BMAD para migração de produtos Direct Response de HTML para Astro

## Visão Geral

O **DR Migration** é um módulo especializado do BMad Method para migrar funis de venda (landing pages, checkouts, upsells) de HTML legado para Astro com TailwindCSS.

### Para Quem é Este Módulo?

- **Media Buyers** que precisam modernizar funis existentes
- **Desenvolvedores** que mantêm produtos DR (Direct Response)
- **Times** que querem padronizar migrações HTML → Astro

### O Que Este Módulo Faz?

1. **Analisa** projetos HTML e classifica complexidade
2. **Migra** páginas para Astro com componentes reutilizáveis
3. **Configura** integrações (tracking, pagamento, segurança)
4. **Valida** a migração com checklists automatizados

---

## Quick Start

### 1. Invocar o Agente Analista

```
/bmad:dr-migration:agents:analista
```

Depois use `*quick-scan` para análise rápida ou `*analyze` para análise completa.

### 2. Executar Migração

Para projetos simples:
```
/bmad:dr-migration:workflows:quick-migration
```

Para projetos complexos:
```
/bmad:dr-migration:workflows:full-migration
```

### 3. Validar Resultado

```
/bmad:dr-migration:agents:validador
```

Use `*validate` para validação completa.

---

## Agentes

### Analista (`analista.agent.yaml`)

Especialista em análise de projetos HTML para migração.

| Comando | Descrição |
|---------|-----------|
| `*quick-scan` | Scan rápido de complexidade |
| `*analyze` | Análise completa com relatório |
| `*compare` | Comparar antes/depois da migração |
| `*help` | Mostrar menu de comandos |

### Migrador (`migrador.agent.yaml`)

Executor da migração HTML → Astro.

| Comando | Descrição |
|---------|-----------|
| `*migrate` | Migração completa guiada |
| `*quick` | Migração rápida (projetos simples) |
| `*component` | Migrar componente específico |
| `*help` | Mostrar menu de comandos |

### Validador (`validador.agent.yaml`)

Garantia de qualidade pós-migração.

| Comando | Descrição |
|---------|-----------|
| `*validate` | Validação completa |
| `*checklist` | Exibir checklist de validação |
| `*fix` | Corrigir problemas encontrados |
| `*help` | Mostrar menu de comandos |

---

## Workflows

### Full Migration (`workflows/full-migration/`)

Migração completa em 6 fases com documentação.

**Quando usar:** Projetos complexos, múltiplas páginas, integrações críticas.

**Fases:**
1. Análise e planejamento
2. Setup do projeto Astro
3. Migração de páginas e componentes
4. Configuração de integrações
5. Validação e testes
6. Documentação e deploy

### Quick Migration (`workflows/quick-migration/`)

Migração simplificada para projetos pequenos.

**Quando usar:** 1-3 páginas, sem integrações complexas.

**Passos:**
1. Análise rápida
2. Setup básico
3. Migração direta
4. Validação

### Add Packages (`workflows/add-packages/`)

Adicionar packages do sistema DR a um projeto existente.

**Packages disponíveis:**
- `cloaking-filter` - Filtro de bots
- `tracking-snippets` - FB Pixel, UTMify, Rybbit
- `payment-gateway` - PIX via Umbrella
- `ui-gamification` - Partículas, timers
- `security-anticlone` - Proteção DevTools

### Audit Product (`workflows/audit-product/`)

Auditar produto DR existente e gerar relatório de qualidade.

**O que analisa:**
- Estrutura do código
- Performance (Lighthouse)
- Segurança
- Integrações
- Documentação

### Setup Project (`workflows/setup-project/`)

Criar um novo projeto DR do zero usando o starter-kit.

**Passos:**
1. Escolher nome e localização
2. Selecionar categoria (DONATE ou LOAN-CARD)
3. Escolher packages (tracking, payment, security, ui)
4. Gerar projeto e instalar dependências

---

## Starter Kit

O módulo inclui um **starter-kit completo** com Astro 5.x + TailwindCSS V4 + React 19.

### Estrutura

```
starter-kit/
├── base/                    # Configuração base do projeto
│   ├── package.json         # Astro 5.3 + React 19 + Tailwind V4
│   ├── astro.config.mjs     # Configuração Astro
│   ├── tsconfig.json        # TypeScript strict
│   └── src/                 # Layouts, components, lib, styles
│
├── presets/                 # Templates por categoria
│   ├── donate/              # Produtos de doação PIX
│   └── loan-card/           # Leads financeiros
│
└── packages/                # Módulos plug-and-play
    ├── tracking/            # FB Pixel, UTMify, Rybbit
    ├── payment/             # Umbrella PIX Gateway
    ├── security/            # Cloaking, Anti-DevTools
    └── ui/                  # Particles, Confetti, Urgency Bar
```

### Uso Rápido

```bash
# Criar novo projeto com workflow
/bmad:dr-migration:workflows:setup-project

# Ou manualmente
cp -r starter-kit/base/ meu-projeto/
cp -r starter-kit/presets/donate/pages/* meu-projeto/src/pages/
cd meu-projeto && bun install && bun run dev
```

Ver `starter-kit/README.md` para documentação completa.

---

## Categorias de Produto

### DONATE

Produtos de doação/contribuição PIX.

**Características:**
- Valores fixos (R$27, R$47, R$97)
- Botões de doação
- Copy de apoio/contribuição

**Exemplo:** Legendarios

### LOAN-CARD

Produtos de geração de leads financeiros.

**Características:**
- Formulários de cadastro
- Campos CPF, nome, telefone
- Copy sobre crédito/empréstimo

**Exemplo:** Will Offer

---

## Estrutura do Módulo

```
.bmad/custom/modules/dr-migration/
├── agents/
│   ├── analista.agent.yaml     # Agente de análise
│   ├── migrador.agent.yaml     # Agente de migração
│   └── validador.agent.yaml    # Agente de validação
├── workflows/
│   ├── full-migration/         # Migração completa
│   ├── quick-migration/        # Migração rápida
│   ├── add-packages/           # Adicionar packages
│   └── audit-product/          # Auditoria de produto
├── tasks/
│   └── check-complexity.md     # Task de análise rápida
├── templates/
│   └── migration-report.md     # Template de relatório
├── data/
│   └── migration-checklist.csv # Checklist de migração
├── _module-installer/
│   └── install-config.yaml     # Configuração de instalação
├── config.yaml                 # Configuração do módulo
└── README.md                   # Este arquivo
```

---

## Tech Stack Suportada

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Astro | 5.16+ | Framework principal |
| Bun | 1.2+ | Runtime JavaScript |
| TailwindCSS | V4 | Estilização |
| TypeScript | 5.x | Linguagem |
| React | 18/19 | Islands (SilkHQ) |
| Trigger.dev | Cloud | Background jobs |

---

## Packages do Sistema DR

| # | Package | Descrição |
|---|---------|-----------|
| a | `cloaking-filter` | Filtro de bots e honeypot |
| b | `tracking-snippets` | UTMify, FB Pixel, Rybbit |
| c | `payment-gateway` | PIX via Umbrella |
| d | `utmify-api` | Cliente API UTMify |
| e | `ui-gamification` | Partículas, timers, animações |
| f | `github-sync` | Sincronização GitHub |
| g | `trigger-jobs` | Background jobs |
| h | `security-anticlone` | Bloqueio DevTools |
| i | `ui-components` | Componentes Astro/React |

---

## Checklist de Migração

O módulo inclui um checklist completo de 42 tarefas em 6 fases:

1. **Análise** (7 tarefas) - Entender o projeto original
2. **Setup** (6 tarefas) - Configurar projeto Astro
3. **Migração** (9 tarefas) - Converter páginas e componentes
4. **Integração** (5 tarefas) - Configurar tracking e pagamento
5. **Validação** (9 tarefas) - Testar tudo
6. **Deploy** (7 tarefas) - Publicar e documentar

Ver `data/migration-checklist.csv` para lista completa.

---

## Exemplos de Uso

### Exemplo 1: Migração Simples

```bash
# 1. Analisar projeto
> /bmad:dr-migration:agents:analista
> *quick-scan ./meu-projeto

# 2. Se SIMPLES, usar quick migration
> /bmad:dr-migration:workflows:quick-migration

# 3. Validar
> /bmad:dr-migration:agents:validador
> *validate
```

### Exemplo 2: Migração Complexa

```bash
# 1. Análise completa
> /bmad:dr-migration:agents:analista
> *analyze ./meu-projeto-complexo

# 2. Full migration
> /bmad:dr-migration:workflows:full-migration

# 3. Validação detalhada
> /bmad:dr-migration:agents:validador
> *validate
> *checklist
```

### Exemplo 3: Adicionar Package

```bash
# Adicionar tracking a projeto existente
> /bmad:dr-migration:workflows:add-packages
# Selecionar: tracking-snippets
```

---

## Referências

### Documentação Relacionada

- `docs/BRAINSTORM-DR-SYSTEM-CONTEXT.md` - Contexto completo do sistema DR
- `docs/OPCOES-WORKFLOW-DR-ASTRO.md` - Opções de workflow

### Projetos de Referência

- `produto-legendarios/produto001/` - Produto DR migrado (DONATE)
- `will-offer/` - Produto DR (LOAN-CARD)

### Módulos BMAD

- `.bmad/bmm/` - BMad Method Module
- `.bmad/cis/` - Creative Innovation System
- `.bmad/bmb/` - BMad Builder

---

## Troubleshooting

### Build falha com erro de TypeScript

```bash
# Verificar tipos
bun run check

# Limpar cache
rm -rf node_modules/.astro
bun run build
```

### Tailwind não aplica estilos

```bash
# Verificar se arquivo está no content
# tailwind.config.js → content: ["./src/**/*.{astro,tsx}"]
```

### Tracking não dispara

1. Verificar variáveis de ambiente
2. Verificar se pixel está no `<head>`
3. Testar com Facebook Pixel Helper

### Pagamento não processa

1. Verificar credenciais Umbrella
2. Testar em modo sandbox primeiro
3. Verificar logs no Trigger.dev

---

## Changelog

### v1.1.0 (2025-12-02)

- **Starter Kit Completo**
  - Base Astro 5.3 + TailwindCSS V4 + React 19
  - Preset DONATE (doação PIX)
  - Preset LOAN-CARD (leads financeiros)
  - 4 packages modulares: tracking, payment, security, ui
- **Novo workflow: setup-project**
  - Criar projetos do zero usando starter-kit
- Documentação expandida

### v1.0.0 (2025-11-28)

- Versão inicial do módulo
- 3 agentes: Analista, Migrador, Validador
- 4 workflows: full-migration, quick-migration, add-packages, audit-product
- Task check-complexity
- Template migration-report
- Checklist com 42 tarefas em 6 fases

---

## Contribuindo

Este módulo faz parte do BMad Method. Para contribuir:

1. Siga as convenções do BMad Core
2. Teste alterações com projetos reais
3. Atualize a documentação
4. Submeta via PR

---

*Módulo criado com BMad Builder - BMad Method v6*
