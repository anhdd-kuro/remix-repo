import "@shopify/shopify-app-remix/adapters/vercel";
import {
  ApiVersion,
  AppDistribution,
  DeliveryMethod,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-01";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";
import {
  CreateCustomerMetafieldDefinitionMutations,
  CustomerMetafieldDefinitionsInputs,
} from "./global/domain/customer";

// console.log(process.env.SHOPIFY_APP_URL, "process.env.SHOPIFY_APP_URL")
// console.log(process.env, "process.env")

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.January24,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma, {
    tableName: "CustomerAppSession",
  }),
  distribution: AppDistribution.SingleMerchant,
  isEmbeddedApp: true,
  useOnlineTokens: false,
  restResources,
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks",
    },
    // ? For more information https://shopify.dev/docs/api/admin-graphql/2024-01/enums/WebhookSubscriptionTopic
    // ! Hookが呼ばれない場合は 一度 Databaseから Tokenを削除して再度認証を行う
    ORDERS_FULFILLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks/orders-fulfilled",
      metafieldNamespaces: ["custom", "$app"],
    },
  },
  hooks: {
    // ! Hookが呼ばれない場合は 一度 Databaseから Tokenを削除して再度認証を行う
    afterAuth: async ({ session, admin }) => {
      try {
        console.log("afterAuth");
        console.log("CreateMetafieldDefinitionMutations");

        const result = await admin.graphql(
          CreateCustomerMetafieldDefinitionMutations,
          {
            variables: CustomerMetafieldDefinitionsInputs,
          }
        );

        const resultJson = await result.json();
        console.log("resultJson", JSON.stringify(resultJson, null, 2));
      } catch (error) {
        console.error("CreateMetafieldDefinitionMutations error", error);
      }

      console.log("Register webhooks");
      console.log(session, "session");
      shopify.registerWebhooks({ session });
    },
  },
  future: {
    v3_webhookAdminContext: true,
    v3_authenticatePublic: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.January24;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
