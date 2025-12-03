# Audit Product - Instructions

<critical>Workflow de auditoria completa de produto DR</critical>
<critical>Comunicar em {communication_language}</critical>

<workflow>

<step n="1" goal="Preparar auditoria">
<action>Verificar se projeto existe em {target_folder}</action>
<action>Identificar tipo de produto (DONATE ou LOAN-CARD)</action>
<action>Carregar checklist de auditoria de {data_path}</action>

<ask>Qual o nome do produto para o relatório?</ask>
</step>

<step n="2" goal="Auditoria Visual (25%)">
<action>Verificar cada item do checklist visual:</action>

**Checklist Visual:**
- [ ] Cores correspondem ao design original
- [ ] Fontes carregam corretamente
- [ ] Layout responsivo funciona (mobile/tablet/desktop)
- [ ] Imagens exibem sem distorção
- [ ] Animações e transições funcionam

<ask>Quantos itens passaram? (0-5)</ask>

<template-output>visual_score</template-output>
</step>

<step n="3" goal="Auditoria Funcional (25%)">
<action>Verificar cada item do checklist funcional:</action>

**Checklist Funcional:**
- [ ] Navegação do funil funciona (todas as páginas)
- [ ] Formulários submetem corretamente
- [ ] Botões e CTAs respondem a cliques
- [ ] Modais/drawers abrem e fecham
- [ ] State persiste entre páginas (localStorage/cookies)

<ask>Quantos itens passaram? (0-5)</ask>

<template-output>functional_score</template-output>
</step>

<step n="4" goal="Auditoria de Tracking (20%)">
<action>Verificar cada item do checklist de tracking:</action>

**Checklist Tracking:**
- [ ] Facebook Pixel inicializa sem erros
- [ ] PageView dispara em cada página
- [ ] UTMify captura parâmetros da URL
- [ ] Eventos de conversão disparam corretamente
- [ ] UTMs propagam entre páginas do funil

<action>Usar FB Pixel Helper ou Console para verificar</action>

<ask>Quantos itens passaram? (0-5)</ask>

<template-output>tracking_score</template-output>
</step>

<step n="5" goal="Auditoria de Segurança (15%)">
<action>Verificar cada item do checklist de segurança:</action>

**Checklist Segurança:**
- [ ] F12/DevTools são bloqueados
- [ ] Console está desabilitado
- [ ] Seleção de texto está bloqueada
- [ ] Right-click está bloqueado
- [ ] Cloaking filtra bots/crawlers

<action>Testar cada proteção manualmente</action>

<ask>Quantos itens passaram? (0-5)</ask>

<template-output>security_score</template-output>
</step>

<step n="6" goal="Auditoria de Performance (15%)">
<action>Medir Core Web Vitals com Lighthouse ou PageSpeed:</action>

**Checklist Performance:**
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] First Load < 3s em mobile 3G
- [ ] Bundle size < 500KB

<ask>Quantos itens passaram? (0-5)</ask>

<template-output>performance_score</template-output>
</step>

<step n="7" goal="Calcular score final">
<action>Calcular score por categoria:</action>
- Visual: (visual_score / 5) * 25
- Funcional: (functional_score / 5) * 25
- Tracking: (tracking_score / 5) * 20
- Segurança: (security_score / 5) * 15
- Performance: (performance_score / 5) * 15

<action>Calcular score total (0-100)</action>

<action>Determinar status:</action>
- 90-100: ✅ Excelente - Pronto para produção
- 70-89: 🟡 Bom - Pequenos ajustes recomendados
- 50-69: 🟠 Regular - Correções necessárias
- 0-49: 🔴 Crítico - Não aprovar para produção

<template-output>final_score, status</template-output>
</step>

<step n="8" goal="Gerar recomendações">
<action>Para cada item que falhou, gerar recomendação de correção</action>
<action>Priorizar itens críticos (funcional > tracking > visual)</action>
<action>Listar próximos passos</action>

<template-output>recommendations</template-output>
</step>

<step n="9" goal="Salvar relatório">
<action>Compilar todas as informações no template</action>
<action>Salvar em {output_folder}</action>
<action>Informar localização do arquivo</action>
</step>

</workflow>
