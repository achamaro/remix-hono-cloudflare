import { Link, MetaFunction, Outlet, useFetcher } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "管理者ページ" },
    {
      name: "description",
      content: "管理者ページです。",
    },
  ];
};

export default function AdminRoot() {
  const fetcher = useFetcher();

  function logout() {
    fetcher.submit(null, { action: "/admin/logout", method: "POST" });
  }

  return (
    <div className="p-5">
      <header className="font-bold italic">管理者ページ</header>
      <section className="flex gap-5 mt-5">
        <nav className="p-3 border rounded shrink-0 self-start">
          <ul>
            <li>
              <Link className="underline" to="/admin">
                トップ
              </Link>
            </li>
            <li>
              <button type="button" onClick={logout} className="underline">
                ログアウト
              </button>
            </li>
          </ul>
        </nav>
        <main>
          <Outlet />
        </main>
      </section>
    </div>
  );
}
