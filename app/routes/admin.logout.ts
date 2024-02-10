import { redirect } from "@remix-run/react";

import { adminToken } from "~/cookie.server";

export async function action() {
  return redirect("/admin/login", {
    headers: {
      "Set-Cookie": await adminToken.serialize(null, {
        maxAge: 1,
      }),
    },
  });
}
