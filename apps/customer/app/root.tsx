import { json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { AppProvider as PolarisAppProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import polarisTranslations from "@shopify/polaris/locales/ja.json";
import { ToastContainer } from "react-toastify";
import type { LoaderFunctionArgs } from "@remix-run/node";
import "react-toastify/dist/ReactToastify.css";
import "~/tailwind.css";

export async function loader({ request }: LoaderFunctionArgs) {
  if (request.url.includes("app"))
    return json({
      authorized: true,
      polarisTranslations,
    });

  return json({
    polarisTranslations,
  });
}

export default function App() {
  const { polarisTranslations } = useLoaderData<typeof loader>();
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="robots" content="noindex, nofollow" />
        <Meta />
        <Links />
      </head>
      <body>
        <PolarisAppProvider i18n={polarisTranslations}>
          <Outlet />
        </PolarisAppProvider>
        <ToastContainer autoClose={2000} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
