/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/cloudflare" />
/// <reference types="@cloudflare/workers-types" />

declare module "__STATIC_CONTENT_MANIFEST" {
  const manifest: string;
  export default manifest;
}

type Admin = {
  id: string;
};

import "hono";
import "hono/jwt";
declare module "hono" {
  interface ContextVariableMap {
    admin: Admin;
  }
}
declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    env: AppEnv;
    admin: Admin;
  }
}

declare global {
  declare type AppEnv = {
    BUCKET: R2Bucket;

    MAIL_HOST: string;
    MAIL_PORT: string;
    MAIL_USERNAME: string;
    MAIL_PASSWORD: string;
    MAIL_FROM: string;
    MAIL_TO: string;

    BASIC_AUTH_USERNAME?: string;
    BASIC_AUTH_PASSWORD?: string;

    ADMIN_JWT_SECRET: string;
    ADMIN_CREDENTIALS: string;

    DKIM_KEY: string;
  };
}
