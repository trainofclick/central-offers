# Relatório de Migração DR

**Data:** {{date}}
**Projeto:** {{project_name}}
**Executado por:** {{user_name}}

---

## Contexto do Projeto

{{project_context}}

---

## Fase 1: Análise

### Estrutura do Funil

{{analysis_report}}

### Complexidade Identificada

| Métrica | Valor |
|---------|-------|
| Páginas | {{page_count}} |
| Componentes | {{component_count}} |
| Assets | {{asset_count}} |
| Complexidade | {{complexity_level}} |

---

## Fase 2: Setup

### Projeto Astro Criado

{{setup_complete}}

### Estrutura de Pastas

```
{{folder_structure}}
```

---

## Fase 3: Migração

### Progresso da Migração

{{migration_progress}}

### Componentes Criados

| Componente | Tipo | Status |
|------------|------|--------|
{{#each components}}
| {{name}} | {{type}} | {{status}} |
{{/each}}

---

## Fase 4: Integração de Packages

{{packages_integrated}}

### Packages Ativados

- [{{#if include_tracking}}x{{else}} {{/if}}] Tracking Snippets (UTMify, FB Pixel, Rybbit)
- [{{#if include_payment}}x{{else}} {{/if}}] Payment Gateway (PIX/Umbrella)
- [{{#if include_security}}x{{else}} {{/if}}] Security Anti-Clone

---

## Fase 5: Validação

### Relatório de Validação

{{validation_report}}

### Checklist de QA

| Item | Status |
|------|--------|
| Visual corresponde ao original | {{visual_status}} |
| Navegação do funil funciona | {{navigation_status}} |
| Tracking dispara corretamente | {{tracking_status}} |
| Pagamento funciona | {{payment_status}} |
| Proteções ativas | {{security_status}} |
| Performance adequada | {{performance_status}} |

### Core Web Vitals

| Métrica | Valor | Status |
|---------|-------|--------|
| LCP | {{lcp_value}} | {{lcp_status}} |
| FID | {{fid_value}} | {{fid_status}} |
| CLS | {{cls_value}} | {{cls_status}} |

---

## Resultado Final

{{final_report}}

### Próximos Passos Recomendados

1. {{next_step_1}}
2. {{next_step_2}}
3. {{next_step_3}}

---

## Arquivos Gerados

- Projeto Astro: `{{target_folder}}`
- Relatório: `{{output_file}}`

---

*Relatório gerado pelo módulo DR Migration v{{module_version}}*
