import { Form } from "@remix-run/react";

export default function () {
  return (
    <div>
      <Form method="POST">
        <button type="submit">Create Customer Metafield Definition</button>
      </Form>
    </div>
  );
}
