export const tryParseJSON = (value: unknown) => {
  try {
    let parsedValue = value;
    if (typeof value === "string") return JSON.parse(value);

    if (typeof parsedValue === "object" && parsedValue !== null) {
      parsedValue = Object.entries(parsedValue).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: tryParseJSON(value),
        }),
        {},
      );
      return parsedValue;
    }

    return parsedValue;
  } catch (e) {
    return value;
  }
};
