# Add Packages - Instructions

<critical>Workflow para adicionar packages a projeto Astro existente</critical>
<critical>Comunicar em {communication_language}</critical>

<workflow>

<step n="1" goal="Verificar projeto existente">
<action>Verificar se {target_folder} existe</action>
<action>Verificar se é um projeto Astro válido (astro.config existe)</action>
<action>Identificar BaseLayout.astro</action>

<check if="not valid astro project">
  <action>Erro: "Projeto Astro não encontrado em {target_folder}"</action>
  <goto step="exit" />
</check>
</step>

<step n="2" goal="Selecionar packages">
<ask>Quais packages deseja adicionar?

[1] Tracking Snippets (UTMify, FB Pixel, Rybbit)
[2] Payment Gateway (PIX/Umbrella)
[3] Security Anti-Clone (DevTools block, cloaking)
[4] Todos os acima
[5] Cancelar

Escolha (pode selecionar múltiplos, ex: 1,3):</ask>

<action>Armazenar seleção do usuário</action>
</step>

<step n="3" goal="Adicionar Tracking" if="tracking selected">
<action>Localizar BaseLayout.astro</action>

<action>Adicionar UTMify Script:</action>
```astro
<!-- UTMify Tracking -->
<script is:inline>
  window.pixelId = "SEU_PIXEL_ID";
  var a = document.createElement("script");
  a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
  document.head.appendChild(a);
</script>
```

<action>Adicionar Facebook Pixel:</action>
```astro
<!-- Facebook Pixel -->
<script is:inline>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'SEU_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

<action>Adicionar Rybbit Analytics:</action>
```astro
<!-- Rybbit Analytics -->
<script is:inline src="https://app.rybbit.io/api/script.js" data-site-id="SEU_SITE_ID"></script>
```

<ask>Informe os IDs dos pixels:
- UTMify Pixel ID:
- Facebook Pixel ID:
- Rybbit Site ID:</ask>

<action>Substituir placeholders com IDs fornecidos</action>
</step>

<step n="4" goal="Adicionar Payment" if="payment selected">
<action>Verificar se output: 'server' está configurado</action>

<check if="output != server">
  <action>Atualizar astro.config.mjs para output: 'server'</action>
  <action>Adicionar adapter @astrojs/node</action>
</check>

<action>Criar src/lib/umbrella-api.ts</action>
<action>Criar src/pages/api/create-pix.ts</action>
<action>Criar src/pages/api/check-payment.ts</action>
<action>Criar src/pages/api/webhook-payment.ts</action>

<ask>Informe as credenciais da Umbrella API:
- UMBRELLA_API_KEY:
- UMBRELLA_API_URL:</ask>

<action>Criar arquivo .env com variáveis</action>
</step>

<step n="5" goal="Adicionar Security" if="security selected">
<action>Localizar BaseLayout.astro</action>

<action>Adicionar DevTools Blocker:</action>
```astro
<!-- DevTools Blocker -->
<script is:inline>
  (function() {
    // Keyboard blocking
    document.addEventListener('keydown', function(e) {
      if (e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) ||
          (e.ctrlKey && ['U','S','P'].includes(e.key))) {
        e.preventDefault();
        return false;
      }
    });

    // Right-click blocking
    document.addEventListener('contextmenu', e => e.preventDefault());

    // Text selection blocking
    document.addEventListener('selectstart', e => e.preventDefault());

    // DevTools detection
    setInterval(function() {
      if (window.outerHeight - window.innerHeight > 160 ||
          window.outerWidth - window.innerWidth > 160) {
        window.location.href = '/blocked';
      }
    }, 1000);

    // Console override
    ['log','warn','error','info','debug'].forEach(m => console[m] = () => {});
  })();
</script>
```

<action>Criar src/middleware.ts para cloaking</action>
<action>Configurar regras de bot detection</action>
</step>

<step n="6" goal="Verificar instalação">
<action>Executar bun run build para verificar erros</action>
<action>Listar packages adicionados</action>

<action>Informar: "Packages adicionados com sucesso!"</action>
</step>

<step n="exit" goal="Encerrar">
<action>Informar status final</action>
</step>

</workflow>
