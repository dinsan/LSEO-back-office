const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" });
export const formatPrice = (n: number) => money.format(n);

export const formatDate = (iso: string) =>
  new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
