export * from "./cache";
export * from "./currency";
export * from "./shopify";

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
