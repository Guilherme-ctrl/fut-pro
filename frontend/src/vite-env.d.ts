/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base da API em produção (ex.: https://seu-app.onrender.com). Em dev, deixe vazio para usar o proxy do Vite. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
