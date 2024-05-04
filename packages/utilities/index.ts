export * from "./cache";
export * from "./currency";
export * from "./date";
export * from "./parser";
export * from "./shopify";

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
