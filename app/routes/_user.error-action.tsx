import { useFetcher } from "@remix-run/react";

export function action() {
  error();
}

function error() {
  JSON.parse(undefined);
}

export function ErrorAction() {
  const { Form } = useFetcher<typeof action>();
  return (
    <Form action="/error-action" method="post" className="inline-block">
      <button className="border rounded px-2 py-1">Error Action</button>
    </Form>
  );
}

export function ErrorLocal() {
  return (
    <button className="border rounded px-2 py-1" onClick={() => error()}>
      Error Local
    </button>
  );
}
