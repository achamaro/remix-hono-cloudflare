import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { ChangeEvent, useState } from "react";

import { readCsv } from "~/lib/read-csv";

export async function loader({ context }: ActionFunctionArgs) {
  const dataExists = Boolean((await context.env.BUCKET.get("data.csv"))?.size);
  return {
    dataExists,
  };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const data = await request.json();
  await context.env.BUCKET.put("data.csv", JSON.stringify(data));
  return {};
}

export default function Route() {
  const { dataExists } = useLoaderData<typeof loader>();
  const [csv, setCsv] = useState<Record<string, string>[] | null>(null);

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.currentTarget.files === null) {
      e.currentTarget.value = "";
      return;
    }

    const csv = await readCsv(e.currentTarget.files[0]);
    setCsv(csv);
  }

  const fetcher = useFetcher();
  async function submit() {
    fetcher.submit(csv, { method: "post", encType: "application/json" });
  }

  async function remove() {
    await fetcher.submit(null, { method: "post", action: "/admin/csv/remove" });
  }

  return (
    <div>
      <h1>CSVアップロード</h1>
      <div className="flex items-center mt-3 gap-4">
        <input type="file" accept="text/csv" onChange={handleChange} />
        <button
          className="rounded px-2 py-1 bg-sky-600 text-white disabled:brightness-75"
          onClick={submit}
          disabled={!csv?.length}
        >
          Upload
        </button>

        <button
          className="rounded px-2 py-1 bg-sky-600 text-white disabled:brightness-75"
          onClick={remove}
          disabled={!dataExists}
        >
          Remove
        </button>
      </div>

      {csv?.length ? (
        <table>
          <thead>
            <tr>
              {Object.keys(csv[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csv.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((value, j) => (
                  <td key={j}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}
