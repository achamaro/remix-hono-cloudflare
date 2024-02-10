import type { MetaFunction } from "@remix-run/cloudflare";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "ユーザーページ" },
    {
      name: "description",
      content: "ユーザーページです。",
    },
  ];
};

export default function UserRoot() {
  return (
    <div>
      <h1>User Root</h1>
      <Outlet />
    </div>
  );
}
