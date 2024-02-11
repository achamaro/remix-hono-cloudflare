import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { useFetcher, useLoaderData } from "@remix-run/react";

export async function action({ context }: ActionFunctionArgs) {
  const to = {
    email: context.env.MAIL_TO,
  };
  const from = {
    email: context.env.MAIL_FROM,
  };
  const personalization = {
    to: [to],
    from,
    dkim_domain: context.env.MAIL_FROM.split("@")[1],
    dkim_selector: "mailchannels",
    dkim_private_key: context.env.DKIM_KEY,
  };
  const payload = {
    personalizations: [personalization],
    from,
    subject: "テストメール",
    content: [
      {
        type: "text/plain",
        value: "テストメールです",
      },
    ],
  };
  console.log(payload);
  const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await response.text();
  console.log("Done", response.status, result);

  return new Response(result, {
    status: 200,
    headers: {
      "content-type": "text/html",
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
