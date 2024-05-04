import crypto from "crypto";
import type {
  ConvertQueryParamsSchemaKeyType,
  ConvertQueryParamsSchemaType,
} from "~/domain";

/**
 * この関数は、有効な Shopify アプリケーション プロキシ リクエストで true を返します。
 * @param parsedQueryString 完全なクエリ文字列を含むオブジェクト。
 * @param shopifySecret アプリの Shopify シークレット。
 * @param nonShopifyQueryParamKeys 署名の作成に使用しないキーの配列。これは、shopify の作成後に追加のパラメーターがある場合に役立ちます。
 * @returns boolean
 */
export const verifyAppProxyHmac = <T extends ConvertQueryParamsSchemaType>(
  param?: T,
  shopifySecret?: string,
  nonShopifyQueryParamKeys: string[] = ["signature"]
): boolean => {
  console.log("verifyAppProxyHmac");

  if (!param || !shopifySecret) {
    return false;
  }

  const input = Object.keys(param)
    .filter(
      (key) =>
        !nonShopifyQueryParamKeys || !nonShopifyQueryParamKeys.includes(key)
    )
    .sort()
    .map((key) => {
      const value = param[key as ConvertQueryParamsSchemaKeyType] as string;
      return `${key}=${value}`;
    })
    .join("");

  const hash = crypto
    .createHmac("sha256", shopifySecret)
    .update(input)
    .digest("hex");

  console.log("input", input);
  console.log("hash", hash);
  console.log("queryParams.signature", param.signature);

  return param.signature === hash;
};
