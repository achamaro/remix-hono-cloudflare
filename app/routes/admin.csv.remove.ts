import { ActionFunctionArgs } from "@remix-run/cloudflare";

export async function action({ context }: ActionFunctionArgs) {
  await context.env.BUCKET.delete("data.csv");
  return null;
}
