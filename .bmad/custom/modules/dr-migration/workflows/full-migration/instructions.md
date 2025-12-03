# Full Migration - Instructions

<critical>O workflow execution engine é governado por: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>Você DEVE ter carregado: {project-root}/.bmad/dr-migration/workflows/full-migration/workflow.yaml</critical>
<critical>Comunicar em {communication_language} durante todo o processo</critical>

<workflow>

<step n="0" goal="Descobrir e carregar contexto do projeto">
<invoke-protocol name="discover_inputs" />

<action>Verificar se source_folder existe: {source_folder}</action>
<action>Verificar se target_folder já existe: {target_folder}</action>

<check if="target_folder exists">
  <ask>A pasta de destino já existe. Deseja sobrescrever? [s/n]</ask>
</check>

<template-output>project_context</template-output>
</step>

<step n="1" goal="FASE 1: Análise do Projeto HTML">
<action>Escanear todas as pastas em {source_folder}</action>
<action>Identificar páginas do funil e ordem de navegação</action>
<action>Extrair design system global (cores, fontes, espaçamentos)</action>
<action>Detectar tracking scripts existentes</action>
<action>Classificar complexidade do projeto</action>

**Estrutura a analisar:**
- Quantas páginas existem?
- Qual a ordem do funil?
- Quais assets são compartilhados?
- Quais tracking scripts estão presentes?
- Qual a complexidade estimada?

<ask>Deseja ver o relatório de análise detalhado? [s/n]</ask>

<template-output>analysis_report</template-output>
</step>

<step n="2" goal="FASE 2: Setup do Projeto Astro">
<action>Criar projeto Astro em {target_folder}</action>

```bash
cd {target_folder_parent}
bun create astro@latest {target_folder_name} --template minimal --typescript strict
cd {target_folder}
bun add tailwindcss @tailwindcss/vite
```

<action>Configurar TailwindCSS V4</action>
<action>Criar estrutura de pastas padrão</action>

```
src/
├── components/
│   ├── layout/
│   └── ui/
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   └── index.astro
├── lib/
├── stores/
└── styles/
    └── global.css
public/
├── images/
├── fonts/
└── videos/
```

<action>Copiar assets de {source_folder} para public/</action>

<check if="include_tracking == true">
  <action>Preparar placeholders para tracking scripts no BaseLayout</action>
</check>

<check if="include_payment == true">
  <action>Instalar dependências de pagamento</action>
  <action>Configurar output: 'server' no astro.config</action>
</check>

<template-output>setup_complete</template-output>
</step>

<step n="3" goal="FASE 3: Migração de Componentes">
<action>Para cada página identificada na análise:</action>

<iterate for-each="page in funnel_pages">
  <action>Identificar seções do HTML</action>
  <action>Criar componentes Astro correspondentes</action>
  <action>Definir interfaces de Props em TypeScript</action>
  <action>Converter CSS inline para classes Tailwind</action>
  <action>Migrar JavaScript para is:inline ou módulos</action>
</iterate>

**Padrões de conversão:**
- `<div class="...">` → Classes Tailwind equivalentes
- `<script>` DOM manipulation → `<script is:inline>`
- `<script>` business logic → `src/lib/utils.ts`
- CSS inline → `@apply` em global.css ou classes Tailwind

<ask>Quantas páginas foram migradas com sucesso?</ask>

<template-output>migration_progress</template-output>
</step>

<step n="4" goal="FASE 4: Integração de Packages">
<check if="include_tracking == true">
  <action>Adicionar UTMify Script ao BaseLayout</action>
  <action>Adicionar Facebook Pixel ao BaseLayout</action>
  <action>Adicionar Rybbit Analytics ao BaseLayout</action>
  <action>Implementar UTM Capture em cada página</action>
</check>

<check if="include_payment == true">
  <action>Criar /api/create-pix endpoint</action>
  <action>Criar /api/check-payment endpoint</action>
  <action>Criar /api/webhook-payment endpoint</action>
  <action>Integrar com UTMify para eventos pending/approved</action>
</check>

<check if="include_security == true">
  <action>Adicionar DevTools Blocker ao BaseLayout</action>
  <action>Adicionar Console Override</action>
  <action>Adicionar Keyboard Blocker</action>
  <action>Configurar Cloaking Middleware</action>
</check>

<template-output>packages_integrated</template-output>
</step>

<step n="5" goal="FASE 5: Validação Final">
<action>Executar checklist de validação visual</action>
<action>Testar navegação do funil completo</action>
<action>Verificar tracking scripts com DevTools</action>

<check if="include_payment == true">
  <action>Testar fluxo de pagamento em sandbox</action>
</check>

<check if="include_security == true">
  <action>Verificar proteções anti-clone</action>
</check>

<action>Medir Core Web Vitals</action>

**Checklist Final:**
- [ ] Visual corresponde ao original
- [ ] Navegação do funil funciona
- [ ] Tracking dispara em todas as páginas
- [ ] Pagamento funciona (se aplicável)
- [ ] Proteções ativas (se aplicável)
- [ ] Performance adequada (LCP < 2.5s)

<template-output>validation_report</template-output>
</step>

<step n="6" goal="Gerar Relatório Final">
<action>Compilar todos os resultados em relatório final</action>
<action>Listar próximos passos recomendados</action>
<action>Salvar relatório em {output_folder}</action>

<template-output>final_report</template-output>
</step>

</workflow>
