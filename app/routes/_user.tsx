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
    <div className="p-5">
      <h1>ユーザーページ</h1>
      <main className="mt-5">
        <Outlet />
      </main>
    </div>
  );
}
