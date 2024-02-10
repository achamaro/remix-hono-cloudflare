import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { Form, Link, useLoaderData } from "@remix-run/react";

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
  const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  console.log("Done", response.status);

  return null;
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
  console.log(data);
  return (
    <div>
      <Link to="/admin">管理者ページ</Link>

      <Form method="post">
        <button>Send</button>
      </Form>

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
