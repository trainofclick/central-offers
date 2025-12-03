# Quick Migration - Instructions

<critical>Workflow para migração rápida de projetos SIMPLES (até 3 páginas)</critical>
<critical>Comunicar em {communication_language}</critical>

<workflow>

<step n="1" goal="Verificar elegibilidade">
<action>Escanear {source_folder} rapidamente</action>
<action>Contar número de páginas</action>

<check if="pages > 3">
  <action>Informar: "Este projeto tem mais de 3 páginas. Use *migrate para migração completa."</action>
  <goto step="exit" />
</check>

<check if="has_api_requirements">
  <action>Informar: "Este projeto requer API. Use *migrate para migração completa."</action>
  <goto step="exit" />
</check>

<action>Confirmar: "Projeto elegível para migração rápida!"</action>
</step>

<step n="2" goal="Setup Express">
<action>Criar projeto Astro com template mínimo</action>
<action>Instalar TailwindCSS V4</action>
<action>Copiar todos os assets para public/</action>
</step>

<step n="3" goal="Migração Direta">
<action>Para cada página HTML:</action>
  - Converter HTML para Astro
  - Aplicar classes Tailwind
  - Manter scripts com is:inline

<action>Criar BaseLayout com estrutura básica</action>
<action>Criar páginas em src/pages/</action>
</step>

<step n="4" goal="Teste Rápido">
<action>Executar bun run dev</action>
<action>Verificar visualmente cada página</action>
<action>Confirmar navegação funciona</action>

<ask>Migração concluída! Deseja adicionar packages? [s/n]</ask>

<check if="yes">
  <action>Invocar workflow add-packages</action>
</check>
</step>

<step n="exit" goal="Encerrar">
<action>Informar status final</action>
</step>

</workflow>
