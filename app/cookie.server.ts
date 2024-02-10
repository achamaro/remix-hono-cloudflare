import { createCookie } from "@remix-run/cloudflare";

// 管理画面認証用トークン
export const adminToken = createCookie("admin-token", {
  httpOnly: true,
  path: "/admin",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
});
