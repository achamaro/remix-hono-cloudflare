import "@remix-run/server-runtime";
declare module "@remix-run/server-runtime" {
  interface AppLoadContext {
    env: AppEnv;
    admin: Admin;
  }
}
