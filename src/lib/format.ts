const sgd = new Intl.NumberFormat("en-SG", {
  style: "currency",
  currency: "SGD",
  maximumFractionDigits: 0,
});

const num = new Intl.NumberFormat("en-SG", { maximumFractionDigits: 0 });

/** "S$1,234" (Intl gives "$1,234" for en-SG, so the S is added explicitly). */
export function formatSgd(value: number): string {
  return sgd.format(value).replace(/^\$/, "S$");
}

export function formatNumber(value: number, dp = 0): string {
  if (dp === 0) return num.format(value);
  return new Intl.NumberFormat("en-SG", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  }).format(value);
}

export function formatRangeSgd(low: number, high: number): string {
  return `${formatSgd(low)} to ${formatSgd(high)}`;
}
