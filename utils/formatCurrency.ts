export const formatCurrency = (amount: unknown): string => {
  if (amount === null || amount === undefined) return "0.00";

  // Accept numeric strings (optionally containing commas), and numbers.
  const numAmount =
    typeof amount === "string"
      ? parseFloat(amount.replace(/,/g, "").trim())
      : typeof amount === "number"
      ? amount
      : NaN;

  if (!Number.isFinite(numAmount)) return "0.00";

  return numAmount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
