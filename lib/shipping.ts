export type ShippingAddress = {
  email: string;
  fullName: string;
  line1: string;
  line2?: string;
  postalCode: string;
  city: string;
  country: string;
};

export type ShippingQuote = {
  zone: "paris" | "france";
  label: string;
  amountCents: number;
};

function getShippingAmount(name: string) {
  const value = Number.parseInt(process.env[name] || "0", 10);

  return Number.isFinite(value) ? value : 0;
}

export function normalizeCountry(country: string) {
  const normalized = country.trim().toUpperCase();

  if (["FR", "FRA", "FRANCE"].includes(normalized)) {
    return "FR";
  }

  return normalized;
}

export function getShippingQuote(address: ShippingAddress): ShippingQuote {
  if (normalizeCountry(address.country) !== "FR") {
    throw new Error(
      "Livraison disponible uniquement en France. Pour une expedition hors France, contactez craneurboys@gmail.com."
    );
  }

  const postalCode = address.postalCode.replace(/\s/g, "");

  if (!/^\d{5}$/.test(postalCode)) {
    throw new Error("Code postal invalide.");
  }

  if (postalCode.startsWith("75")) {
    return {
      zone: "paris",
      label: "Livraison Paris",
      amountCents: getShippingAmount("SHIPPING_PARIS_CENTS")
    };
  }

  return {
    zone: "france",
    label: "Livraison France",
    amountCents: getShippingAmount("SHIPPING_FRANCE_CENTS")
  };
}
