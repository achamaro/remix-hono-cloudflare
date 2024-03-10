import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { useFetcher, useLoaderData } from "@remix-run/react";

import { send } from "~/lib/mail";

import { ErrorAction, ErrorLocal } from "./_user.error-action";

export async function action({ context }: ActionFunctionArgs) {
  const subject = "テストメール";
  const body = "テストメールです";

  const response = await send(subject, body, context.env);

  return new Response(await response.text(), {
    status: 200,
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "text/html",
    },
  });
}

export async function loader({ context }: ActionFunctionArgs) {
  const data = (await (await context.env.BUCKET.get("data.csv"))?.json()) as
    | Record<string, string>[]
    | undefined;
  return {
    data,
  };
}

export default function Index() {
  const { data } = useLoaderData<typeof loader>();

  const fetcher = useFetcher<typeof action>();
  function handleSend() {
    fetcher.submit(null, { method: "post" });
  }

  return (
    <div>
      <button className="border rounded px-2 py-1" onClick={handleSend}>
        Send
      </button>

      <ErrorAction />
      <ErrorLocal />

      {data && (
        <table>
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((value, j) => (
                  <td key={j}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
