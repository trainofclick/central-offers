# Setup Project - Instruções do Workflow

<critical>Este workflow cria um novo projeto DR usando o starter-kit pré-configurado</critical>
<critical>Comunique em {communication_language}</critical>

<workflow>

<step n="1" goal="Coletar informações do projeto">
  <action>Perguntar ao usuário as informações necessárias:</action>

  <ask>
    1. **Nome do projeto** (slug, ex: `meu-produto-001`)
       - Será usado como nome da pasta
       - Use apenas letras minúsculas, números e hífens

    2. **Caminho de destino**
       - Onde criar o projeto?
       - Sugestão: `{project-root}/` ou pasta específica

    3. **Categoria do produto**
       - **DONATE**: Produtos de doação/contribuição PIX
       - **LOAN-CARD**: Produtos de geração de leads financeiros

    4. **Packages a incluir** (selecione um ou mais):
       - [ ] **tracking** - FB Pixel, UTMify, Rybbit
       - [ ] **payment** - Umbrella PIX Gateway
       - [ ] **security** - Cloaking filter, anti-DevTools
       - [ ] **ui** - Particles, confetti, urgency bar
  </ask>

  <action>Validar inputs:
    - Nome do projeto é válido (slug format)?
    - Caminho de destino existe?
    - Categoria é válida?
  </action>
</step>

<step n="2" goal="Criar estrutura do projeto">
  <action>Criar diretório do projeto:</action>
  ```bash
  mkdir -p {{project_path}}/{{project_name}}
  ```

  <action>Copiar arquivos base do starter-kit:</action>
  ```bash
  cp -r {starter_kit_path}/base/* {{project_path}}/{{project_name}}/
  ```

  <action>Informar usuário sobre arquivos copiados:
    - package.json (Astro 5.x + React 19 + TailwindCSS V4)
    - astro.config.mjs (configuração Astro)
    - tsconfig.json (TypeScript)
    - .env.example (variáveis de ambiente)
    - .gitignore
    - src/layouts/BaseLayout.astro
    - src/components/ (Button, Card, Section, Timer)
    - src/lib/ (utils, tracking, config)
    - src/styles/global.css
  </action>
</step>

<step n="3" goal="Aplicar preset da categoria">
  <check if="category == DONATE">
    <action>Copiar preset DONATE:</action>
    ```bash
    cp -r {starter_kit_path}/presets/donate/pages/* {{project_path}}/{{project_name}}/src/pages/
    cp -r {starter_kit_path}/presets/donate/components/* {{project_path}}/{{project_name}}/src/components/react/
    ```

    <action>Informar páginas criadas:
      - `/` (index.astro) - Landing page com VSL e CTA
      - `/checkout` (checkout.astro) - Seleção de valor e PIX
      - `/obrigado` (obrigado.astro) - Thank you page
    </action>

    <action>Informar componentes adicionados:
      - DonationSelector.tsx - Seletor de valores de doação
    </action>
  </check>

  <check if="category == LOAN-CARD">
    <action>Copiar preset LOAN-CARD:</action>
    ```bash
    cp -r {starter_kit_path}/presets/loan-card/pages/* {{project_path}}/{{project_name}}/src/pages/
    cp -r {starter_kit_path}/presets/loan-card/components/* {{project_path}}/{{project_name}}/src/components/react/
    ```

    <action>Informar páginas criadas:
      - `/` (index.astro) - Landing page com benefícios
      - `/cadastro` (cadastro.astro) - Formulário multi-step
      - `/analise` (analise.astro) - Página de loading/análise
      - `/resultado` (resultado.astro) - Ofertas de parceiros
    </action>

    <action>Informar componentes adicionados:
      - LeadForm.tsx - Formulário de captura de leads
    </action>
  </check>
</step>

<step n="4" goal="Adicionar packages selecionados">
  <action>Para cada package selecionado:</action>

  <check if="tracking in packages">
    <action>Copiar package tracking:</action>
    ```bash
    mkdir -p {{project_path}}/{{project_name}}/src/packages/tracking
    cp -r {starter_kit_path}/packages/tracking/* {{project_path}}/{{project_name}}/src/packages/tracking/
    ```
    <action>Informar: Package de tracking adicionado (FB Pixel, UTMify, Rybbit)</action>
  </check>

  <check if="payment in packages">
    <action>Copiar package payment:</action>
    ```bash
    mkdir -p {{project_path}}/{{project_name}}/src/packages/payment
    cp -r {starter_kit_path}/packages/payment/* {{project_path}}/{{project_name}}/src/packages/payment/
    ```
    <action>Informar: Package de pagamento adicionado (Umbrella PIX)</action>
  </check>

  <check if="security in packages">
    <action>Copiar package security:</action>
    ```bash
    mkdir -p {{project_path}}/{{project_name}}/src/packages/security
    cp -r {starter_kit_path}/packages/security/* {{project_path}}/{{project_name}}/src/packages/security/
    ```
    <action>Informar: Package de segurança adicionado (Cloaking, Anti-DevTools)</action>
  </check>

  <check if="ui in packages">
    <action>Copiar package ui:</action>
    ```bash
    mkdir -p {{project_path}}/{{project_name}}/src/packages/ui
    cp -r {starter_kit_path}/packages/ui/* {{project_path}}/{{project_name}}/src/packages/ui/
    ```
    <action>Informar: Package UI adicionado (Particles, Confetti, Urgency Bar)</action>
  </check>
</step>

<step n="5" goal="Configurar variáveis de ambiente">
  <action>Criar arquivo .env a partir do .env.example:</action>
  ```bash
  cp {{project_path}}/{{project_name}}/.env.example {{project_path}}/{{project_name}}/.env
  ```

  <action>Atualizar .env com valores básicos:</action>
  - PUBLIC_SITE_URL=http://localhost:4321
  - PUBLIC_SITE_NAME={{project_name}}
  - NODE_ENV=development

  <ask>
    Deseja configurar as variáveis de tracking agora?
    - FB Pixel ID
    - UTMify Pixel ID
    - Outras variáveis

    (Pode configurar depois editando o arquivo .env)
  </ask>
</step>

<step n="6" goal="Inicializar projeto">
  <action>Navegar para o diretório do projeto:</action>
  ```bash
  cd {{project_path}}/{{project_name}}
  ```

  <action>Instalar dependências com Bun:</action>
  ```bash
  bun install
  ```

  <action>Verificar se instalação foi bem-sucedida</action>
</step>

<step n="7" goal="Apresentar resultado final">
  <action>Mostrar resumo do projeto criado:</action>

  ```
  ══════════════════════════════════════════════════════════════
  ✅ PROJETO CRIADO COM SUCESSO!
  ══════════════════════════════════════════════════════════════

  📁 Localização: {{project_path}}/{{project_name}}
  📂 Categoria: {{category}}
  📦 Packages: {{packages}}

  ─────────────────────────────────────────────────────────────
  ESTRUTURA DO PROJETO
  ─────────────────────────────────────────────────────────────

  {{project_name}}/
  ├── src/
  │   ├── pages/          # Páginas Astro
  │   ├── layouts/        # Layouts base
  │   ├── components/     # Componentes Astro e React
  │   ├── lib/            # Utilitários
  │   ├── packages/       # Packages instalados
  │   └── styles/         # Estilos globais
  ├── public/             # Assets estáticos
  ├── astro.config.mjs    # Config Astro
  ├── tailwind.config.js  # Config Tailwind (se aplicável)
  ├── tsconfig.json       # Config TypeScript
  ├── package.json        # Dependências
  └── .env                # Variáveis de ambiente

  ─────────────────────────────────────────────────────────────
  PRÓXIMOS PASSOS
  ─────────────────────────────────────────────────────────────

  1. Navegue para o projeto:
     cd {{project_path}}/{{project_name}}

  2. Configure as variáveis de ambiente:
     Edite o arquivo .env com suas credenciais

  3. Inicie o servidor de desenvolvimento:
     bun run dev

  4. Acesse no navegador:
     http://localhost:4321

  5. Customize seu produto:
     - Edite textos e imagens em src/pages/
     - Ajuste cores em src/styles/global.css
     - Configure tracking no .env

  ─────────────────────────────────────────────────────────────
  COMANDOS ÚTEIS
  ─────────────────────────────────────────────────────────────

  bun run dev      # Servidor de desenvolvimento
  bun run build    # Build de produção
  bun run preview  # Preview do build
  bun run check    # Verificar tipos TypeScript

  ══════════════════════════════════════════════════════════════
  ```

  <ask>
    Deseja:
    1. Iniciar o servidor de desenvolvimento agora?
    2. Abrir o projeto no editor?
    3. Receber mais instruções de customização?
    4. Finalizar
  </ask>
</step>

</workflow>
