import { NextResponse } from "next/server";

import { decrementStock, recordProcessedOrder } from "@/lib/stock";

export const runtime = "nodejs";

type SimulateOrderRequest = {
  productId?: string;
  size?: string;
  quantity?: number;
};

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 404 });
  }

  try {
    const payload = (await request.json()) as SimulateOrderRequest;

    if (!payload.productId || !payload.size) {
      return NextResponse.json(
        { error: "productId and size are required" },
        { status: 400 }
      );
    }

    const items = [
      {
        productId: payload.productId,
        size: payload.size,
        quantity: payload.quantity || 1
      }
    ];

    await decrementStock(items);
    await recordProcessedOrder({
      orderId: `dev-${Date.now()}`,
      customerEmail: "test-local@craneurboys.dev",
      items
    });

    return NextResponse.json({ ok: true, items });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to simulate order"
      },
      { status: 400 }
    );
  }
}
