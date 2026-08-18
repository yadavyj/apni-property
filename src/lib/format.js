export function formatCurrency(value) {
  if (value == null) return "-";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactCurrency(value) {
  if (value == null) return "-";
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} Lakh`;
  return formatCurrency(value);
}

export function formatArea(sqft) {
  if (sqft == null) return "-";
  return `${new Intl.NumberFormat("en-IN").format(sqft)} sqft`;
}

export function formatDistance(km) {
  if (km == null) return "-";
  return `${km} km`;
}

export function formatRate(ratePerSqft) {
  if (ratePerSqft == null) return "-";
  return `${formatCurrency(ratePerSqft)}/sqft`;
}
