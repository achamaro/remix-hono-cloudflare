import { ActionFunctionArgs, json, redirect } from "@remix-run/cloudflare";
import { Form, useActionData } from "@remix-run/react";
import { sign } from "hono/jwt";

import { adminToken } from "~/cookie.server";

export async function action({ request, context }: ActionFunctionArgs) {
  const [id, password] = context.env.ADMIN_CREDENTIALS.split("=");
  const body = await request.formData();
  if (body.get("id") === id && body.get("password") === password) {
    const token = await sign(
      { exp: Math.round(Date.now() / 1000 + 60 * 60), data: { id } },
      context.env.ADMIN_JWT_SECRET,
      "HS256"
    );
    return redirect("/admin", {
      headers: {
        "Set-Cookie": await adminToken.serialize(token, {
          // 1h
          maxAge: 60 * 60,
        }),
      },
    });
  }

  return json(
    { errors: {} },
    {
      status: 422,
    }
  );
}

export default function GuestRoot() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="p-5">
      <h1 className="mb-5">Login</h1>
      {actionData?.errors && <p>Invalid ID or password</p>}
      <Form method="post">
        <div className="grid w-fit grid-cols-[auto,auto] items-center gap-5">
          <label htmlFor="id">ID</label>
          <input id="id" type="text" name="id" className="border p-1 rounded" />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className="border p-1 rounded"
          />
        </div>
        <div className="mt-5">
          <button className="px-2 py-1 rounded bg-sky-600 text-white">
            Submit
          </button>
        </div>
      </Form>
    </div>
  );
}
