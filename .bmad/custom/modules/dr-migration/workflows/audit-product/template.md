# Relatório de Auditoria DR

**Data:** {{date}}
**Produto:** {{product_name}}
**Auditor:** {{user_name}}

---

## Resumo Executivo

| Categoria | Score | Peso | Contribuição |
|-----------|-------|------|--------------|
| Visual | {{visual_score}}/5 | 25% | {{visual_contribution}} |
| Funcional | {{functional_score}}/5 | 25% | {{functional_contribution}} |
| Tracking | {{tracking_score}}/5 | 20% | {{tracking_contribution}} |
| Segurança | {{security_score}}/5 | 15% | {{security_contribution}} |
| Performance | {{performance_score}}/5 | 15% | {{performance_contribution}} |

### Score Final: {{final_score}}/100 {{status}}

---

## Detalhes por Categoria

### Visual ({{visual_score}}/5)

| Item | Status |
|------|--------|
| Cores correspondem ao original | {{visual_1}} |
| Fontes carregam corretamente | {{visual_2}} |
| Layout responsivo funciona | {{visual_3}} |
| Imagens exibem corretamente | {{visual_4}} |
| Animações funcionam | {{visual_5}} |

### Funcional ({{functional_score}}/5)

| Item | Status |
|------|--------|
| Navegação do funil funciona | {{functional_1}} |
| Formulários submetem corretamente | {{functional_2}} |
| Botões respondem a cliques | {{functional_3}} |
| Modais abrem e fecham | {{functional_4}} |
| State persiste entre páginas | {{functional_5}} |

### Tracking ({{tracking_score}}/5)

| Item | Status |
|------|--------|
| Facebook Pixel inicializa | {{tracking_1}} |
| PageView dispara em cada página | {{tracking_2}} |
| UTMify captura parâmetros | {{tracking_3}} |
| Eventos de conversão disparam | {{tracking_4}} |
| UTMs propagam entre páginas | {{tracking_5}} |

### Segurança ({{security_score}}/5)

| Item | Status |
|------|--------|
| DevTools bloqueados | {{security_1}} |
| Console desabilitado | {{security_2}} |
| Seleção de texto bloqueada | {{security_3}} |
| Right-click bloqueado | {{security_4}} |
| Cloaking filtra bots | {{security_5}} |

### Performance ({{performance_score}}/5)

| Item | Status | Valor |
|------|--------|-------|
| LCP < 2.5s | {{performance_1}} | {{lcp_value}} |
| FID < 100ms | {{performance_2}} | {{fid_value}} |
| CLS < 0.1 | {{performance_3}} | {{cls_value}} |
| First Load < 3s | {{performance_4}} | {{first_load_value}} |
| Bundle < 500KB | {{performance_5}} | {{bundle_size}} |

---

## Recomendações

{{recommendations}}

---

## Próximos Passos

1. {{next_step_1}}
2. {{next_step_2}}
3. {{next_step_3}}

---

*Relatório gerado pelo módulo DR Migration v{{module_version}}*
