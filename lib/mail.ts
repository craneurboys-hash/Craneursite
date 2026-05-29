import type { ShippingAddress, ShippingQuote } from "./shipping";
import type { CheckoutItem } from "./stock";

function getOptionalEnv(name: string) {
  return process.env[name] || "";
}

function formatItems(items: CheckoutItem[]) {
  return items
    .map(
      (item) =>
        `- ${item.productId} / taille ${item.size} / quantite ${item.quantity}`
    )
    .join("\n");
}

function formatAddress(shippingAddress?: ShippingAddress) {
  if (!shippingAddress) {
    return "Adresse non renseignee";
  }

  return [
    shippingAddress.fullName,
    shippingAddress.line1,
    shippingAddress.line2,
    `${shippingAddress.postalCode} ${shippingAddress.city}`,
    shippingAddress.country
  ]
    .filter(Boolean)
    .join("\n");
}

function formatShipping(shippingQuote?: ShippingQuote) {
  if (!shippingQuote) {
    return "Livraison non renseignee";
  }

  return `${shippingQuote.label} - ${(shippingQuote.amountCents / 100).toFixed(
    2
  )} EUR`;
}

async function sendEmail({
  apiKey,
  from,
  to,
  subject,
  text
}: {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  text: string;
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({ from, to, subject, text })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend email failed: ${body}`);
  }
}

async function trySendEmail(params: {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  text: string;
}) {
  try {
    await sendEmail(params);
  } catch (error) {
    console.error(error);
  }
}

export async function sendOrderEmails({
  orderId,
  customerEmail,
  items,
  shippingAddress,
  shippingQuote
}: {
  orderId: string;
  customerEmail?: string;
  items: CheckoutItem[];
  shippingAddress?: ShippingAddress;
  shippingQuote?: ShippingQuote;
}) {
  const apiKey = getOptionalEnv("RESEND_API_KEY");
  const adminEmail =
    getOptionalEnv("ORDER_NOTIFICATION_EMAIL") || "craneurboys@gmail.com";
  const from = getOptionalEnv("ORDER_EMAIL_FROM") || "CRANEURBOYS <orders@resend.dev>";

  if (!apiKey) {
    return;
  }

  const orderLines = formatItems(items);
  const addressLines = formatAddress(shippingAddress);
  const shippingLine = formatShipping(shippingQuote);
  const resolvedCustomerEmail = customerEmail || shippingAddress?.email;

  await trySendEmail({
    apiKey,
    from,
    to: adminEmail,
    subject: "Nouvelle commande CRANEURBOYS",
    text: [
      "Nouvelle commande CRANEURBOYS.",
      "",
      `Commande: ${orderId}`,
      `Client: ${resolvedCustomerEmail || "Non renseigne"}`,
      "",
      "Articles:",
      orderLines,
      "",
      "Livraison:",
      shippingLine,
      "",
      "Adresse:",
      addressLines
    ].join("\n")
  });

}
