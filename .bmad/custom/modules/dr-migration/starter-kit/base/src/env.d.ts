/// <reference types="astro/client" />

interface ImportMetaEnv {
  // Site
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_SITE_NAME: string;

  // Tracking
  readonly PUBLIC_FB_PIXEL_ID: string;
  readonly PUBLIC_FB_ACCESS_TOKEN: string;
  readonly PUBLIC_UTMIFY_PIXEL_ID: string;
  readonly PUBLIC_RYBBIT_SITE_ID: string;
  readonly PUBLIC_GTM_ID: string;

  // Payment
  readonly PUBLIC_UMBRELLA_PUBLIC_KEY: string;
  readonly UMBRELLA_API_KEY: string;
  readonly UMBRELLA_WEBHOOK_SECRET: string;

  // UTMify API
  readonly UTMIFY_API_TOKEN: string;

  // Trigger.dev
  readonly TRIGGER_API_KEY: string;
  readonly TRIGGER_API_URL: string;

  // Security
  readonly CLOAKING_WHITELIST_IPS: string;
  readonly CLOAKING_BLOCK_COUNTRIES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
