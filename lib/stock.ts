import crypto from "node:crypto";

import type { ShippingAddress, ShippingQuote } from "./shipping";

export type StockItem = {
  productId: string;
  name: string;
  size: string;
  stock: number;
  price: string;
  stripePriceId: string;
  rowNumber: number;
};

export type CheckoutItem = {
  productId: string;
  size: string;
  quantity: number;
};

type GoogleTokenResponse = {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
  error?: string;
  error_description?: string;
};

const googleTokenUrl = "https://oauth2.googleapis.com/token";
const googleScope = "https://www.googleapis.com/auth/spreadsheets";

function getEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function base64Url(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function getPrivateKey() {
  return getEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY").replace(/\\n/g, "\n");
}

async function getGoogleAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(
    JSON.stringify({
      iss: getEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
      scope: googleScope,
      aud: googleTokenUrl,
      exp: now + 3600,
      iat: now
    })
  );
  const unsignedToken = `${header}.${payload}`;
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(unsignedToken)
    .sign(getPrivateKey());
  const assertion = `${unsignedToken}.${base64Url(signature)}`;
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion
  });

  const response = await fetch(googleTokenUrl, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body
  });
  const data = (await response.json()) as GoogleTokenResponse;

  if (!response.ok || !data.access_token) {
    throw new Error(
      data.error_description || data.error || "Unable to get Google access token"
    );
  }

  return data.access_token;
}

function getSheetName() {
  return process.env.GOOGLE_SHEET_NAME || "Stock";
}

function getStockRange() {
  return `${getSheetName()}!A2:F`;
}

function getStockCell(rowNumber: number) {
  return `${getSheetName()}!D${rowNumber}`;
}

function getOrdersSheetName() {
  return process.env.GOOGLE_ORDERS_SHEET_NAME || "Orders";
}

function getOrdersRange() {
  return `${getOrdersSheetName()}!A2:L`;
}

async function sheetsRequest(path: string, init?: RequestInit) {
  const token = await getGoogleAccessToken();
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${getEnv(
      "GOOGLE_SHEET_ID"
    )}${path}`,
    {
      ...init,
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        ...init?.headers
      }
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google Sheets request failed: ${text}`);
  }

  return response;
}

export async function getStockItems() {
  const range = encodeURIComponent(getStockRange());
  const response = await sheetsRequest(`/values/${range}`);
  const data = (await response.json()) as { values?: string[][] };

  return (data.values || [])
    .map((row, index): StockItem | null => {
      const [productId, name, size, stockValue] = row;
      const hasPriceColumn = row.length >= 6;
      const price = hasPriceColumn
        ? row[4] || ""
        : row[4]?.startsWith("price_")
          ? ""
          : row[4] || "";
      const stripePriceId = hasPriceColumn
        ? row[5] || ""
        : row[4]?.startsWith("price_")
          ? row[4]
          : "";
      const stock = Number.parseInt(stockValue || "0", 10);

      if (!productId || !size) {
        return null;
      }

      return {
        productId,
        name: name || productId,
        size: size.toUpperCase(),
        stock: Number.isFinite(stock) ? stock : 0,
        price,
        stripePriceId,
        rowNumber: index + 2
      };
    })
    .filter((item): item is StockItem => Boolean(item));
}

export function getStockKey(productId: string, size: string) {
  return `${productId}:${size.toUpperCase()}`;
}

export async function validateCheckoutItems(items: CheckoutItem[]) {
  const stockItems = await getStockItems();
  const stockByKey = new Map(
    stockItems.map((item) => [getStockKey(item.productId, item.size), item])
  );

  return items.map((item) => {
    const stockItem = stockByKey.get(getStockKey(item.productId, item.size));
    const quantity = Math.max(1, Math.floor(item.quantity || 1));

    return {
      ...item,
      quantity,
      stockItem,
      available: Boolean(stockItem && stockItem.stock >= quantity)
    };
  });
}

export async function decrementStock(items: CheckoutItem[]) {
  const validatedItems = await validateCheckoutItems(items);
  const unavailableItem = validatedItems.find((item) => !item.available);

  if (unavailableItem) {
    throw new Error(
      `Stock unavailable for ${unavailableItem.productId} ${unavailableItem.size}`
    );
  }

  await Promise.all(
    validatedItems.map((item) =>
      sheetsRequest(
        `/values/${encodeURIComponent(
          getStockCell(item.stockItem!.rowNumber)
        )}?valueInputOption=USER_ENTERED`,
        {
          method: "PUT",
          body: JSON.stringify({
            range: getStockCell(item.stockItem!.rowNumber),
            majorDimension: "ROWS",
            values: [[item.stockItem!.stock - item.quantity]]
          })
        }
      )
    )
  );
}

export async function hasProcessedOrder(orderId: string) {
  const response = await sheetsRequest(`/values/${encodeURIComponent(getOrdersRange())}`);
  const data = (await response.json()) as { values?: string[][] };

  return (data.values || []).some((row) => row[0] === orderId);
}

export async function recordProcessedOrder({
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
  await sheetsRequest(
    `/values/${encodeURIComponent(
      getOrdersRange()
    )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      body: JSON.stringify({
        values: [
          [
            orderId,
            new Date().toISOString(),
            customerEmail || "",
            JSON.stringify(items),
            "paid",
            shippingAddress?.fullName || "",
            shippingAddress?.line1 || "",
            shippingAddress?.line2 || "",
            shippingAddress?.postalCode || "",
            shippingAddress?.city || "",
            shippingAddress?.country || "",
            shippingQuote
              ? `${shippingQuote.label} ${shippingQuote.amountCents / 100} EUR`
              : ""
          ]
        ]
      })
    }
  );
}
