export function formatCurrency(amount?: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount ?? 0);
}

export function parseCurrency(amount?: string) {
  return Number((amount ?? "0").replace(/\$\s?|(,*)/g, ""));
}
