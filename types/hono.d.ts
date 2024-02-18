import "hono";
declare module "hono" {
  interface ContextVariableMap {
    admin: Admin;
  }
}
