# Task: Verificação Rápida de Complexidade

<task id="dr-migration/tasks/check-complexity" name="Quick Complexity Check">
  <objective>Analisar rapidamente um projeto HTML/funil e classificar sua complexidade para migração Astro</objective>

  <input>
    <required>
      <param name="project_path">Caminho para o projeto HTML a ser analisado</param>
    </required>
    <optional>
      <param name="verbose" default="false">Mostrar detalhes da análise</param>
    </optional>
  </input>

  <output>
    <classification>SIMPLES | MEDIO | COMPLEXO</classification>
    <estimated_effort>Estimativa de esforço em horas</estimated_effort>
    <risk_factors>Lista de fatores de risco identificados</risk_factors>
    <recommendation>Workflow recomendado (quick-migration ou full-migration)</recommendation>
  </output>

  <flow>
    <step n="1" goal="Escanear estrutura do projeto">
      <action>Listar todos os arquivos HTML no diretório</action>
      <action>Contar páginas únicas (index, checkout, upsell, etc.)</action>
      <action>Identificar assets (imagens, CSS, JS)</action>
      <metrics>
        - total_html_files: número de arquivos .html
        - total_css_files: número de arquivos .css
        - total_js_files: número de arquivos .js
        - total_images: número de imagens
        - has_subdirectories: projeto tem subpastas?
      </metrics>
    </step>

    <step n="2" goal="Analisar características do código">
      <action>Verificar presença de frameworks/bibliotecas</action>
      <action>Identificar padrões de JavaScript</action>
      <action>Detectar integrações de terceiros</action>
      <checklist>
        - [ ] jQuery presente?
        - [ ] Bootstrap/outro framework CSS?
        - [ ] JavaScript inline vs externo?
        - [ ] Pixel do Facebook?
        - [ ] Google Analytics/Tag Manager?
        - [ ] Integração de pagamento?
        - [ ] Formulários complexos?
        - [ ] Animações/carrosséis?
        - [ ] Vídeos embarcados?
        - [ ] Popup/modais?
      </checklist>
    </step>

    <step n="3" goal="Detectar categoria do produto">
      <action>Analisar conteúdo para determinar categoria</action>
      <categories>
        <category id="DONATE">
          <indicators>
            - Botões de doação PIX
            - Valores fixos (R$27, R$47, R$97)
            - Linguagem de contribuição/apoio
            - Copy tipo "ajude", "contribua", "doe"
          </indicators>
        </category>
        <category id="LOAN-CARD">
          <indicators>
            - Formulários de lead/cadastro
            - CPF, nome, telefone, email
            - Copy sobre crédito/empréstimo/cartão
            - Parceiros financeiros mencionados
          </indicators>
        </category>
        <category id="OTHER">
          <indicators>
            - Não se encaixa nas categorias acima
            - Requer análise manual
          </indicators>
        </category>
      </categories>
    </step>

    <step n="4" goal="Calcular score de complexidade">
      <scoring>
        ## Critérios de Pontuação

        ### Estrutura (0-10 pontos)
        - 1-2 páginas HTML: 0 pts
        - 3-5 páginas HTML: 3 pts
        - 6-10 páginas HTML: 6 pts
        - 10+ páginas HTML: 10 pts

        ### JavaScript (0-10 pontos)
        - Nenhum/básico: 0 pts
        - jQuery simples: 3 pts
        - Lógica complexa: 6 pts
        - Framework SPA: 10 pts

        ### Integrações (0-10 pontos)
        - Nenhuma: 0 pts
        - Tracking básico: 2 pts
        - Pagamento simples: 5 pts
        - Múltiplas integrações: 8 pts
        - APIs customizadas: 10 pts

        ### Assets (0-5 pontos)
        - Poucos (1-10): 0 pts
        - Moderado (11-30): 2 pts
        - Muitos (31+): 5 pts

        ### CSS (0-5 pontos)
        - Inline/simples: 0 pts
        - Framework CSS: 2 pts
        - CSS customizado extenso: 5 pts
      </scoring>
      <classification-rules>
        - 0-12 pontos: SIMPLES (quick-migration recomendado)
        - 13-25 pontos: MEDIO (full-migration recomendado)
        - 26+ pontos: COMPLEXO (full-migration com análise detalhada)
      </classification-rules>
    </step>

    <step n="5" goal="Gerar relatório de complexidade">
      <action>Compilar resultados em formato estruturado</action>
      <output-format>
        ```
        ══════════════════════════════════════════════
        📊 ANÁLISE DE COMPLEXIDADE - DR MIGRATION
        ══════════════════════════════════════════════

        📁 Projeto: {{project_name}}
        📅 Data: {{date}}

        ─────────────────────────────────────────────
        CLASSIFICAÇÃO: {{classification}}
        ─────────────────────────────────────────────

        📈 Score Total: {{total_score}}/40 pontos

        Detalhamento:
        • Estrutura:    {{structure_score}}/10
        • JavaScript:   {{js_score}}/10
        • Integrações:  {{integration_score}}/10
        • Assets:       {{assets_score}}/5
        • CSS:          {{css_score}}/5

        ─────────────────────────────────────────────
        CATEGORIA DETECTADA: {{category}}
        ─────────────────────────────────────────────

        {{category_indicators}}

        ─────────────────────────────────────────────
        FATORES DE RISCO
        ─────────────────────────────────────────────

        {{risk_factors}}

        ─────────────────────────────────────────────
        RECOMENDAÇÃO
        ─────────────────────────────────────────────

        Workflow: {{recommended_workflow}}
        Esforço estimado: {{estimated_hours}} horas

        {{additional_notes}}

        ══════════════════════════════════════════════
        ```
      </output-format>
    </step>
  </flow>

  <risk-factors-catalog>
    <risk level="alto" id="inline-js">JavaScript inline extenso - requer refatoração significativa</risk>
    <risk level="alto" id="external-deps">Dependências externas críticas - verificar compatibilidade</risk>
    <risk level="alto" id="complex-forms">Formulários com validação complexa - testar thoroughly</risk>
    <risk level="medio" id="custom-animations">Animações customizadas - pode precisar reescrita</risk>
    <risk level="medio" id="legacy-patterns">Padrões legados (document.write, etc.) - refatorar</risk>
    <risk level="medio" id="hardcoded-urls">URLs hardcoded - extrair para config</risk>
    <risk level="baixo" id="image-optimization">Imagens não otimizadas - processar com Astro</risk>
    <risk level="baixo" id="css-specificity">CSS com alta especificidade - pode conflitar com Tailwind</risk>
  </risk-factors-catalog>

  <usage-examples>
    <example title="Uso via agente Analista">
      ```
      /bmad:dr-migration:agents:analista
      *quick-scan
      > Caminho: ./produto-legendarios/produto001
      ```
    </example>
    <example title="Uso direto como task">
      ```
      Executar task check-complexity com:
      - project_path: ./will-offer
      - verbose: true
      ```
    </example>
  </usage-examples>
</task>
