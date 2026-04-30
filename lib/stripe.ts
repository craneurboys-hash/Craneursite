import crypto from "node:crypto";

import type { ShippingAddress, ShippingQuote } from "./shipping";
import type { CheckoutItem } from "./stock";

type StripeCheckoutSession = {
  id: string;
  url?: string;
};

type StripeWebhookEvent = {
  id: string;
  type: string;
  data: {
    object: {
      id?: string;
      customer_details?: {
        email?: string;
      };
      metadata?: {
        checkoutItems?: string;
        shippingAddress?: string;
        shippingQuote?: string;
      };
    };
  };
};

function getEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export async function createCheckoutSession({
  items,
  origin,
  shippingAddress,
  shippingQuote
}: {
  items: Array<CheckoutItem & { stripePriceId: string }>;
  origin: string;
  shippingAddress: ShippingAddress;
  shippingQuote: ShippingQuote;
}) {
  const body = new URLSearchParams({
    mode: "payment",
    success_url: `${origin}/panier?success=1`,
    cancel_url: `${origin}/panier?canceled=1`,
    customer_email: shippingAddress.email,
    billing_address_collection: "required",
    "metadata[checkoutItems]": JSON.stringify(
      items.map(({ productId, size, quantity }) => ({ productId, size, quantity }))
    ),
    "metadata[shippingAddress]": JSON.stringify(shippingAddress),
    "metadata[shippingQuote]": JSON.stringify(shippingQuote)
  });

  items.forEach((item, index) => {
    body.append(`line_items[${index}][price]`, item.stripePriceId);
    body.append(`line_items[${index}][quantity]`, String(item.quantity));
  });

  if (shippingQuote.amountCents > 0) {
    body.append(`line_items[${items.length}][price_data][currency]`, "eur");
    body.append(
      `line_items[${items.length}][price_data][product_data][name]`,
      shippingQuote.label
    );
    body.append(
      `line_items[${items.length}][price_data][unit_amount]`,
      String(shippingQuote.amountCents)
    );
    body.append(`line_items[${items.length}][quantity]`, "1");
  }

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${getEnv("STRIPE_SECRET_KEY")}`,
      "content-type": "application/x-www-form-urlencoded"
    },
    body
  });
  const session = (await response.json()) as StripeCheckoutSession & {
    error?: { message?: string };
  };

  if (!response.ok || !session.url) {
    throw new Error(session.error?.message || "Unable to create Stripe session");
  }

  return session;
}

function parseStripeSignature(signatureHeader: string) {
  return signatureHeader.split(",").reduce<Record<string, string[]>>((acc, part) => {
    const [key, value] = part.split("=");

    if (!key || !value) {
      return acc;
    }

    acc[key] = [...(acc[key] || []), value];
    return acc;
  }, {});
}

export function verifyStripeWebhook(payload: string, signatureHeader: string | null) {
  if (!signatureHeader) {
    throw new Error("Missing Stripe signature");
  }

  const parsedSignature = parseStripeSignature(signatureHeader);
  const timestamp = parsedSignature.t?.[0];
  const signatures = parsedSignature.v1 || [];

  if (!timestamp || signatures.length === 0) {
    throw new Error("Invalid Stripe signature");
  }

  const expectedSignature = crypto
    .createHmac("sha256", getEnv("STRIPE_WEBHOOK_SECRET"))
    .update(`${timestamp}.${payload}`)
    .digest("hex");
  const expectedBuffer = Buffer.from(expectedSignature);
  const isValid = signatures.some((signature) => {
    const signatureBuffer = Buffer.from(signature);

    return (
      signatureBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
    );
  });

  if (!isValid) {
    throw new Error("Invalid Stripe webhook signature");
  }

  return JSON.parse(payload) as StripeWebhookEvent;
}

export function parseCheckoutItemsFromEvent(event: StripeWebhookEvent) {
  const rawItems = event.data.object.metadata?.checkoutItems;

  if (!rawItems) {
    return [];
  }

  return JSON.parse(rawItems) as CheckoutItem[];
}

export function parseShippingAddressFromEvent(event: StripeWebhookEvent) {
  const rawAddress = event.data.object.metadata?.shippingAddress;

  if (!rawAddress) {
    return undefined;
  }

  return JSON.parse(rawAddress) as ShippingAddress;
}

export function parseShippingQuoteFromEvent(event: StripeWebhookEvent) {
  const rawQuote = event.data.object.metadata?.shippingQuote;

  if (!rawQuote) {
    return undefined;
  }

  return JSON.parse(rawQuote) as ShippingQuote;
}
