/**
 * config.ts
 * Configuração centralizada do projeto
 */

/**
 * Configuração do site
 */
export const siteConfig = {
  name: import.meta.env.PUBLIC_SITE_NAME || "DR Product",
  url: import.meta.env.PUBLIC_SITE_URL || "http://localhost:4321",
  locale: "pt-BR",
  currency: "BRL",
} as const;

/**
 * Configuração de tracking
 */
export const trackingConfig = {
  fbPixelId: import.meta.env.PUBLIC_FB_PIXEL_ID || null,
  utmifyPixelId: import.meta.env.PUBLIC_UTMIFY_PIXEL_ID || null,
  gtmId: import.meta.env.PUBLIC_GTM_ID || null,
  rybbitSiteId: import.meta.env.PUBLIC_RYBBIT_SITE_ID || null,
} as const;

/**
 * Configuração de pagamento
 */
export const paymentConfig = {
  umbrellaPublicKey: import.meta.env.PUBLIC_UMBRELLA_PUBLIC_KEY || null,
  // Add other payment configs here
} as const;

/**
 * Verifica se está em desenvolvimento
 */
export const isDev = import.meta.env.DEV;

/**
 * Verifica se está em produção
 */
export const isProd = import.meta.env.PROD;

/**
 * Retorna a URL completa para um path
 */
export function getFullUrl(path: string): string {
  const base = siteConfig.url.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

/**
 * Configuração de valores de produto (exemplo)
 * Customize conforme seu produto
 */
export const productConfig = {
  // Valores para DONATE
  donationValues: [
    { value: 27, label: "R$ 27", popular: false },
    { value: 47, label: "R$ 47", popular: true },
    { value: 97, label: "R$ 97", popular: false },
  ],

  // Valores para produtos
  productValues: [
    { value: 97, label: "R$ 97", original: 197 },
    { value: 197, label: "R$ 197", original: 397 },
  ],
} as const;

/**
 * Textos padrão (customize conforme necessário)
 */
export const defaultTexts = {
  cta: {
    donate: "QUERO CONTRIBUIR AGORA",
    buy: "QUERO GARANTIR O MEU",
    lead: "QUERO SABER MAIS",
    submit: "ENVIAR",
  },
  timer: {
    prefix: "Oferta expira em:",
    expired: "Oferta expirada!",
  },
  form: {
    requiredField: "Campo obrigatório",
    invalidEmail: "Email inválido",
    invalidCPF: "CPF inválido",
    invalidPhone: "Telefone inválido",
  },
} as const;
