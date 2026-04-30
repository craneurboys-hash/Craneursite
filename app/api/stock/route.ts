import { NextResponse } from "next/server";

import { getStockItems } from "@/lib/stock";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stock = await getStockItems();

    return NextResponse.json({ stock });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to load merch stock"
      },
      { status: 500 }
    );
  }
}
