export const numberOrStringToJpy = ({
  amount,
  symbol = "円",
  symbolPosition = "suffix",
}: {
  amount?: number | string;
  symbol?: "円" | "¥" | null;
  symbolPosition?: "prefix" | "suffix";
}) => {
  if (amount === undefined || amount === null) return "0";

  const price = Number.parseInt(`${amount}`)
    .toLocaleString("ja-JP", {
      style: "currency",
      currency: "JPY",
    })
    .replace("￥", "");

  if (symbol === null) return price;

  if (symbolPosition === "prefix") {
    return `${symbol}${price}`;
  }

  return `${price}${symbol}`;
};
