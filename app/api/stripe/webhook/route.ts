import { NextResponse } from "next/server";

import { sendOrderEmails } from "@/lib/mail";
import {
  parseCheckoutItemsFromEvent,
  parseShippingAddressFromEvent,
  parseShippingQuoteFromEvent,
  verifyStripeWebhook
} from "@/lib/stripe";
import { decrementStock, hasProcessedOrder, recordProcessedOrder } from "@/lib/stock";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.text();

  try {
    const event = verifyStripeWebhook(
      payload,
      request.headers.get("stripe-signature")
    );

    if (event.type === "checkout.session.completed") {
      const items = parseCheckoutItemsFromEvent(event);
      const orderId = event.data.object.id || event.id;

      if (items.length > 0 && !(await hasProcessedOrder(orderId))) {
        const shippingAddress = parseShippingAddressFromEvent(event);
        const shippingQuote = parseShippingQuoteFromEvent(event);

        await decrementStock(items);
        await recordProcessedOrder({
          orderId,
          customerEmail: event.data.object.customer_details?.email,
          items,
          shippingAddress,
          shippingQuote
        });
        await sendOrderEmails({
          orderId,
          customerEmail: event.data.object.customer_details?.email,
          items,
          shippingAddress,
          shippingQuote
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to handle Stripe webhook"
      },
      { status: 400 }
    );
  }
}
