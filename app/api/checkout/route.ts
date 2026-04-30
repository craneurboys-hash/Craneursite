import { NextResponse } from "next/server";

import { getShippingQuote, type ShippingAddress } from "@/lib/shipping";
import { createCheckoutSession } from "@/lib/stripe";
import { validateCheckoutItems } from "@/lib/stock";

export const runtime = "nodejs";

type CheckoutRequest = {
  items?: Array<{
    productId?: string;
    size?: string;
    quantity?: number;
  }>;
  shippingAddress?: Partial<ShippingAddress>;
};

function getOrigin(request: Request) {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    request.headers.get("origin") ||
    "http://localhost:3000"
  );
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CheckoutRequest;
    const items = (payload.items || [])
      .filter((item) => item.productId && item.size)
      .map((item) => ({
        productId: item.productId!,
        size: item.size!,
        quantity: item.quantity || 1
      }));

    if (items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const shippingAddress = payload.shippingAddress;

    if (
      !shippingAddress?.email ||
      !shippingAddress.fullName ||
      !shippingAddress.line1 ||
      !shippingAddress.postalCode ||
      !shippingAddress.city ||
      !shippingAddress.country
    ) {
      return NextResponse.json(
        { error: "Adresse de livraison incomplete" },
        { status: 400 }
      );
    }

    const normalizedShippingAddress: ShippingAddress = {
      email: shippingAddress.email,
      fullName: shippingAddress.fullName,
      line1: shippingAddress.line1,
      line2: shippingAddress.line2 || "",
      postalCode: shippingAddress.postalCode,
      city: shippingAddress.city,
      country: shippingAddress.country
    };
    const shippingQuote = getShippingQuote(normalizedShippingAddress);

    const validatedItems = await validateCheckoutItems(items);
    const unavailableItem = validatedItems.find((item) => !item.available);

    if (unavailableItem) {
      return NextResponse.json(
        {
          error: `${unavailableItem.productId} ${unavailableItem.size} is out of stock`
        },
        { status: 409 }
      );
    }

    const missingStripePrice = validatedItems.find(
      (item) => !item.stockItem?.stripePriceId.startsWith("price_")
    );

    if (missingStripePrice) {
      return NextResponse.json(
        {
          error: `${missingStripePrice.productId} ${missingStripePrice.size} has no valid Stripe price`
        },
        { status: 400 }
      );
    }

    const session = await createCheckoutSession({
      origin: getOrigin(request),
      shippingAddress: normalizedShippingAddress,
      shippingQuote,
      items: validatedItems.map((item) => ({
        productId: item.productId,
        size: item.size,
        quantity: item.quantity,
        stripePriceId: item.stockItem!.stripePriceId
      }))
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to create checkout"
      },
      { status: 500 }
    );
  }
}
