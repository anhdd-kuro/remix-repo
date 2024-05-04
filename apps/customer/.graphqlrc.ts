import { ApiType, pluckConfig } from "@shopify/api-codegen-preset";
import fs from "fs";
import type { IGraphQLConfig } from "graphql-config";

function getConfig() {
  const config: IGraphQLConfig = {
    // For type extraction
    schema: "https://shopify.dev/admin-graphql-direct-proxy/2024-01",
    documents: ["./app/**/*.{ts,tsx,gql,graphql}"],
    extensions: {
      codegen: {
        // Enables support for `#graphql` tags, as well as `/* GraphQL */`
        pluckConfig,
        generates: {
          "./app/global/graphql/__generated__/admin.schema.json": {
            plugins: ["introspection"],
            config: { minify: true },
          },
          "./app/global/graphql/__generated__/admin.types.d.ts": {
            plugins: ["typescript"],
          },
          "./app/global/graphql/__generated__/admin.generated.d.ts": {
            presetConfig: {
              apiType: ApiType.Admin,
            },
            plugins: [
              {
                "typescript-operations": {
                  operationResultSuffix: "Type",
                  omitOperationSuffix: false,
                },
              },
            ],
            config: {
              enumsAsTypes: true,
              preResolveTypes: true,
              skipTypename: true,
            },
          },
        },
      },
    },
  };

  let extensions: string[] = [];
  try {
    extensions = fs.readdirSync("./extensions");
  } catch {
    // ignore if no extensions
  }

  for (const entry of extensions) {
    const extensionPath = `./extensions/${entry}`;
    const schema = `${extensionPath}/schema.graphql`;
    if (!fs.existsSync(schema)) {
      continue;
    }
    config[entry] = {
      schema,
      documents: [`${extensionPath}/**/*.graphql`],
    };
  }

  return config;
}

module.exports = getConfig();
