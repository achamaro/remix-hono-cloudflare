import { createRequestHandler } from "@remix-run/cloudflare";
import * as build from "@remix-run/dev/server-build";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { basicAuth } from "hono/basic-auth";
import { serveStatic } from "hono/cloudflare-workers";
import { verify } from "hono/jwt";

import { adminToken } from "~/cookie.server";

const handleRemixRequest = createRequestHandler(build, process.env.NODE_ENV);

const app = new Hono<{ Bindings: AppEnv }>();

// Basic Auth
app.use("/*", (c, next) => {
  if (c.env?.BASIC_AUTH_USERNAME && c.env?.BASIC_AUTH_PASSWORD) {
    return basicAuth({
      username: c.env.BASIC_AUTH_USERNAME,
      password: c.env.BASIC_AUTH_PASSWORD,
    })(c, next);
  }
  return next();
});

// Admin Auth
app.use("/admin/*", async (c, next) => {
  // AuthorizationヘッダーまたはCookieからトークンを取得
  const [type, credentials] = c.req.header("Authorization")?.split(" ") ?? [];
  const token =
    type === "Bearer"
      ? credentials
      : await adminToken.parse(c.req.header("Cookie") ?? "");

  let admin;
  if (token) {
    try {
      const payload = await verify(token, c.env.ADMIN_JWT_SECRET, "HS256");
      admin = payload.data;
    } catch (e) {
      //
    }
  }

  c.set("admin", admin);

  // 認証エラーの場合
  if (!c.req.path.startsWith("/admin/login") && !admin) {
    const loginUrl = "/admin/login";

    if (c.req.header("Accept")?.includes("text/html")) {
      // 画面遷移してきた場合はリダイレクトを返す
      return c.redirect(loginUrl);
    } else {
      // APIリクエストの場合は `X-Remix-Redirect` ヘッダーを返す
      return new Response(null, {
        status: 204,
        statusText: "No Content",
        headers: {
          "X-Remix-Redirect": loginUrl,
          "X-Remix-Status": "302",
        },
      });
    }
  }

  await next();
});

// Static assets
app.get(
  "/build/*",
  serveStatic({
    root: "./",
  })
);

// Mount Remix app
app.mount("/", handleRemixRequest, (c) => {
  return { env: env(c), admin: c.get("admin") };
});

export default app;
