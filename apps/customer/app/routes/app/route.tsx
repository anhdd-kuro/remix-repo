import type { HeadersArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { toast } from "react-toastify";
import { authenticate } from "~/shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <ui-nav-menu>
        <Link to="/app" rel="home">
          Home
        </Link>
      </ui-nav-menu>
      <Outlet />
    </AppProvider>
  );
}
// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  const error = useRouteError();
  console.log(error, "/app error boundary");

  if (toast.isActive("APP_ROUTE_TOAST_ID")) {
    toast.update("APP_ROUTE_TOAST_ID", {
      render: "システムエラーが発生しました !",
      type: "error",
      autoClose: 3000,
    });
  } else
    toast.error("システムエラーが発生しました !", {
      toastId: "APP_ROUTE_TOAST_ID",
    });

  return (
    <p className="text-center text-lg">
      システムエラーが発生しました。もう一度お試しください。
    </p>
  );

  // return boundary.error(useRouteError())
}

export const headers = (headersArgs: HeadersArgs) => {
  return boundary.headers(headersArgs);
};
