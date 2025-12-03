# Relatório de Migração DR - {{project_name}}

> **Gerado por:** DR Migration Module
> **Data:** {{date}}
> **Versão:** 1.0

---

## Sumário Executivo

| Campo | Valor |
|-------|-------|
| **Projeto** | {{project_name}} |
| **Categoria** | {{category}} |
| **Complexidade** | {{complexity}} |
| **Status** | {{status}} |
| **Esforço Total** | {{total_hours}} horas |

### Resultado da Migração

{{migration_summary}}

---

## 1. Análise Inicial

### 1.1 Estrutura Original

```
{{original_structure}}
```

### 1.2 Inventário de Arquivos

| Tipo | Quantidade | Observações |
|------|------------|-------------|
| HTML | {{html_count}} | {{html_notes}} |
| CSS | {{css_count}} | {{css_notes}} |
| JavaScript | {{js_count}} | {{js_notes}} |
| Imagens | {{img_count}} | {{img_notes}} |
| Outros | {{other_count}} | {{other_notes}} |

### 1.3 Integrações Identificadas

{{integrations_list}}

### 1.4 Fatores de Risco

| Risco | Nível | Mitigação |
|-------|-------|-----------|
{{risk_table}}

---

## 2. Plano de Migração

### 2.1 Páginas a Migrar

| # | Página Original | Página Astro | Status |
|---|-----------------|--------------|--------|
{{pages_table}}

### 2.2 Componentes Criados

| Componente | Tipo | Descrição |
|------------|------|-----------|
{{components_table}}

### 2.3 Packages Habilitados

{{packages_enabled}}

---

## 3. Transformações Aplicadas

### 3.1 HTML para Astro

{{html_transformations}}

### 3.2 CSS para TailwindCSS

{{css_transformations}}

### 3.3 JavaScript para TypeScript

{{js_transformations}}

### 3.4 Assets e Imagens

{{asset_transformations}}

---

## 4. Configurações

### 4.1 Variáveis de Ambiente

```env
{{env_variables}}
```

### 4.2 Configuração Astro

```typescript
// astro.config.mjs
{{astro_config}}
```

### 4.3 Configuração TailwindCSS

```javascript
// tailwind.config.js
{{tailwind_config}}
```

---

## 5. Integrações Configuradas

### 5.1 Tracking

{{tracking_config}}

### 5.2 Pagamento

{{payment_config}}

### 5.3 Segurança

{{security_config}}

---

## 6. Testes e Validação

### 6.1 Checklist de Validação

- [ ] Build sem erros
- [ ] Preview funcional
- [ ] Links funcionando
- [ ] Formulários submetendo
- [ ] Tracking disparando
- [ ] Pagamento processando (sandbox)
- [ ] Mobile responsivo
- [ ] Performance aceitável (Lighthouse 90+)
- [ ] SEO meta tags presentes
- [ ] Sem erros no console

### 6.2 Resultados dos Testes

| Teste | Resultado | Observações |
|-------|-----------|-------------|
{{test_results}}

### 6.3 Métricas de Performance

| Métrica | Antes | Depois | Delta |
|---------|-------|--------|-------|
| Lighthouse Score | {{lighthouse_before}} | {{lighthouse_after}} | {{lighthouse_delta}} |
| First Contentful Paint | {{fcp_before}} | {{fcp_after}} | {{fcp_delta}} |
| Time to Interactive | {{tti_before}} | {{tti_after}} | {{tti_delta}} |
| Total Bundle Size | {{bundle_before}} | {{bundle_after}} | {{bundle_delta}} |

---

## 7. Estrutura Final

```
{{final_structure}}
```

---

## 8. Próximos Passos

### 8.1 Ações Imediatas

{{immediate_actions}}

### 8.2 Recomendações Futuras

{{future_recommendations}}

### 8.3 Documentação Relacionada

- [Guia de Manutenção](./MAINTENANCE.md)
- [Changelog](./CHANGELOG.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

---

## 9. Notas Técnicas

### 9.1 Decisões de Arquitetura

{{architecture_decisions}}

### 9.2 Workarounds Aplicados

{{workarounds}}

### 9.3 Dívida Técnica

{{technical_debt}}

---

## 10. Histórico de Alterações

| Data | Versão | Autor | Descrição |
|------|--------|-------|-----------|
| {{date}} | 1.0 | DR Migration | Migração inicial |

---

*Relatório gerado automaticamente pelo módulo DR Migration do BMad Method*
