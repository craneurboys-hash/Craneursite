"use client";

import { useEffect, useMemo, useState } from "react";
import type { MerchProduct } from "@/data/merch";

type CartLine = {
  productId: string;
  size: string;
  quantity: number;
};

type StockItem = {
  productId: string;
  size: string;
  stock: number;
  price: string;
  stripePriceId: string;
};

type ShippingAddressForm = {
  email: string;
  fullName: string;
  line1: string;
  line2: string;
  postalCode: string;
  city: string;
  country: string;
};

type CartPageProps = {
  products: MerchProduct[];
  initialProductId?: string;
  initialSize?: string;
  success?: boolean;
  canceled?: boolean;
};

const cartStorageKey = "craneurboys-cart";
const defaultShippingAddress: ShippingAddressForm = {
  email: "",
  fullName: "",
  line1: "",
  line2: "",
  postalCode: "",
  city: "",
  country: "FR"
};

function getLineKey(productId: string, size: string) {
  return `${productId}:${size}`;
}

function readCart() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedCart = window.localStorage.getItem(cartStorageKey);
    return savedCart ? (JSON.parse(savedCart) as CartLine[]) : [];
  } catch {
    return [];
  }
}

function writeCart(lines: CartLine[]) {
  window.localStorage.setItem(cartStorageKey, JSON.stringify(lines));
}

function clearCart() {
  window.localStorage.removeItem(cartStorageKey);
}

function getStockKey(productId: string, size: string) {
  return `${productId}:${size.toUpperCase()}`;
}

export function CartPage({
  products,
  initialProductId,
  initialSize,
  success,
  canceled
}: CartPageProps) {
  const [cartLines, setCartLines] = useState<CartLine[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [checkoutStatus, setCheckoutStatus] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const [checkoutError, setCheckoutError] = useState("");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddressForm>(
    defaultShippingAddress
  );

  const productById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  );
  const stockByKey = useMemo(
    () =>
      new Map(
        stockItems.map((item) => [getStockKey(item.productId, item.size), item])
      ),
    [stockItems]
  );

  const availableProduct = products[2];

  useEffect(() => {
    if (success) {
      setCartLines([]);
      clearCart();
      return;
    }

    const savedLines = readCart();
    const nextLines =
      initialProductId && initialSize
        ? addLine(savedLines, initialProductId, initialSize)
        : savedLines;

    setCartLines(nextLines);
    writeCart(nextLines);

    if (initialProductId && initialSize) {
      window.history.replaceState(null, "", "/panier");
    }
  }, [initialProductId, initialSize, success]);

  useEffect(() => {
    fetch("/api/stock", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load stock");
        }

        return response.json() as Promise<{ stock: StockItem[] }>;
      })
      .then((data) => setStockItems(data.stock))
      .catch(() => setStockItems([]));
  }, []);

  function updateCart(updater: (lines: CartLine[]) => CartLine[]) {
    setCartLines((currentLines) => {
      const nextLines = updater(currentLines);
      writeCart(nextLines);
      return nextLines;
    });
  }

  function addToCart(productId: string, size: string) {
    updateCart((lines) => addLine(lines, productId, size));
  }

  function setQuantity(productId: string, size: string, quantity: number) {
    const maxStock = stockByKey.get(getStockKey(productId, size))?.stock || 0;
    const nextQuantity = maxStock > 0 ? Math.min(quantity, maxStock) : quantity;

    updateCart((lines) =>
      lines
        .map((line) =>
          line.productId === productId && line.size === size
            ? { ...line, quantity: nextQuantity }
            : line
        )
        .filter((line) => line.quantity > 0)
    );
  }

  function removeLine(productId: string, size: string) {
    updateCart((lines) =>
      lines.filter((line) => line.productId !== productId || line.size !== size)
    );
  }

  async function checkout() {
    setCheckoutStatus("loading");
    setCheckoutError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items: cartLines, shippingAddress })
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        const message =
          data.error === "Missing environment variable: STRIPE_SECRET_KEY"
            ? "Stripe n'est pas encore configure."
            : data.error || "Paiement indisponible";

        throw new Error(message);
      }

      window.location.href = data.url;
    } catch (error) {
      setCheckoutStatus("error");
      setCheckoutError(
        error instanceof Error ? error.message : "Paiement indisponible"
      );
    }
  }

  function updateShippingAddress(field: keyof ShippingAddressForm, value: string) {
    setShippingAddress((currentAddress) => ({
      ...currentAddress,
      [field]: value
    }));
  }

  return (
    <main className="min-h-screen px-4 pb-16 pt-20 text-ink md:px-8 md:pt-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="mb-2 text-xs uppercase text-ink/48">Merch</p>
          <h1 className="font-display text-4xl uppercase leading-none md:text-7xl">
            {success ? "Commande confirmee" : "Panier"}
          </h1>
          <a
            href="/#merch"
            className="focus-ring mt-5 inline-flex rounded border border-ink/20 px-4 py-2 text-xs uppercase text-ink/70 transition hover:border-ink hover:text-ink"
          >
            Retour au merch
          </a>
          {success ? (
            <p className="mt-4 text-sm uppercase text-ink/62">
              Paiement confirme. Merci pour ta commande.
            </p>
          ) : null}
          {canceled ? (
            <p className="mt-4 text-sm uppercase text-ink/62">
              Paiement annule.
            </p>
          ) : null}
        </div>

        {success ? (
          <section className="border border-ink/18 bg-paper p-5 md:p-8">
            <p className="max-w-2xl text-base leading-relaxed text-ink/72">
              Ta commande est bien enregistree. Tu peux revenir au merch ou
              continuer a parcourir le site.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/#merch"
                className="focus-ring inline-flex rounded bg-ink px-5 py-3 text-sm uppercase text-paper transition hover:bg-ink/85 active:bg-ink/75"
              >
                Retour au merch
              </a>
              <a
                href="/"
                className="focus-ring inline-flex rounded border border-ink/20 px-5 py-3 text-sm uppercase text-ink/70 transition hover:border-ink hover:text-ink"
              >
                Accueil
              </a>
            </div>
          </section>
        ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <section className="border border-ink/18 bg-paper">
            {cartLines.length > 0 ? (
              <div className="divide-y divide-ink/12">
                {cartLines.map((line) => {
                  const product = productById.get(line.productId);

                  if (!product) {
                    return null;
                  }
                  const stock = stockByKey.get(
                    getStockKey(line.productId, line.size)
                  );

                  return (
                    <article
                      key={getLineKey(line.productId, line.size)}
                      className="grid gap-4 p-4 min-[520px]:grid-cols-[96px_1fr] md:p-5"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="aspect-[4/5] w-24 rounded object-cover"
                      />

                      <div className="min-w-0">
                        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h2 className="text-lg uppercase">{product.name}</h2>
                          <p className="text-sm uppercase text-ink/62">
                            Taille {line.size}
                          </p>
                          {stock?.price ? (
                            <p className="text-sm uppercase text-ink">
                              {stock.price}
                            </p>
                          ) : null}
                          {typeof stock?.stock === "number" ? (
                            <p className="text-xs uppercase text-ink/45">
                              Stock {stock.stock}
                            </p>
                          ) : null}
                        </div>
                          <button
                            type="button"
                            onClick={() => removeLine(line.productId, line.size)}
                            className="focus-ring rounded border border-ink/20 px-3 py-2 text-xs uppercase text-ink/62 transition hover:border-ink hover:text-ink"
                          >
                            Retirer
                          </button>
                        </div>

                        <div className="flex w-full max-w-44 items-center rounded border border-ink/20">
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity(
                                line.productId,
                                line.size,
                                line.quantity - 1
                              )
                            }
                            className="focus-ring h-10 w-12 text-lg"
                            aria-label={`Reduire la quantite ${product.name} ${line.size}`}
                          >
                            -
                          </button>
                          <p className="flex-1 text-center text-sm uppercase">
                            {line.quantity}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity(
                                line.productId,
                                line.size,
                                line.quantity + 1
                              )
                            }
                            disabled={
                              typeof stock?.stock === "number" &&
                              line.quantity >= stock.stock
                            }
                            className="focus-ring h-10 w-12 text-lg"
                            aria-label={`Augmenter la quantite ${product.name} ${line.size}`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="p-5">
                <p className="text-sm uppercase text-ink/62">
                  Ton panier est vide.
                </p>
              </div>
            )}
          </section>

          <aside className="border border-ink/18 bg-paper p-5">
            <p className="mb-4 text-xs uppercase text-ink/48">
              Ajouter une autre taille
            </p>

            {availableProduct ? (
              <div>
                <p className="mb-3 text-lg uppercase">{availableProduct.name}</p>
                <div className="grid grid-cols-4 gap-2">
                  {availableProduct.sizes.map((size) => {
                    const stock = stockByKey.get(
                      getStockKey(availableProduct.id, size.label)
                    );
                    const isAvailable =
                      Number(stock?.stock || 0) > 0;

                    return (
                      <button
                        key={size.label}
                        type="button"
                        onClick={() => addToCart(availableProduct.id, size.label)}
                        disabled={!isAvailable}
                        className="focus-ring h-10 rounded border border-ink/20 text-sm uppercase transition hover:border-ink active:bg-ink/10 disabled:cursor-not-allowed disabled:text-ink/35"
                      >
                        {size.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="mt-6 border-t border-ink/15 pt-5">
              <p className="mb-4 text-xs uppercase text-ink/48">
                Livraison
              </p>
              <div className="grid gap-3">
                <label className="block">
                  <span className="mb-1 block text-xs uppercase text-ink/48">
                    Email
                  </span>
                  <input
                    type="email"
                    value={shippingAddress.email}
                    onChange={(event) =>
                      updateShippingAddress("email", event.target.value)
                    }
                    className="focus-ring h-11 w-full rounded border border-ink/20 bg-paper px-3 text-sm"
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs uppercase text-ink/48">
                    Nom complet
                  </span>
                  <input
                    type="text"
                    value={shippingAddress.fullName}
                    onChange={(event) =>
                      updateShippingAddress("fullName", event.target.value)
                    }
                    className="focus-ring h-11 w-full rounded border border-ink/20 bg-paper px-3 text-sm"
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs uppercase text-ink/48">
                    Adresse
                  </span>
                  <input
                    type="text"
                    value={shippingAddress.line1}
                    onChange={(event) =>
                      updateShippingAddress("line1", event.target.value)
                    }
                    className="focus-ring h-11 w-full rounded border border-ink/20 bg-paper px-3 text-sm"
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs uppercase text-ink/48">
                    Complement
                  </span>
                  <input
                    type="text"
                    value={shippingAddress.line2}
                    onChange={(event) =>
                      updateShippingAddress("line2", event.target.value)
                    }
                    className="focus-ring h-11 w-full rounded border border-ink/20 bg-paper px-3 text-sm"
                  />
                </label>
                <div className="grid grid-cols-[0.85fr_1.15fr] gap-3">
                  <label className="block">
                    <span className="mb-1 block text-xs uppercase text-ink/48">
                      CP
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={shippingAddress.postalCode}
                      onChange={(event) =>
                        updateShippingAddress("postalCode", event.target.value)
                      }
                      className="focus-ring h-11 w-full rounded border border-ink/20 bg-paper px-3 text-sm"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs uppercase text-ink/48">
                      Ville
                    </span>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(event) =>
                        updateShippingAddress("city", event.target.value)
                      }
                      className="focus-ring h-11 w-full rounded border border-ink/20 bg-paper px-3 text-sm"
                      required
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1 block text-xs uppercase text-ink/48">
                    Pays
                  </span>
                  <input
                    type="text"
                    value={shippingAddress.country}
                    onChange={(event) =>
                      updateShippingAddress("country", event.target.value)
                    }
                    className="focus-ring h-11 w-full rounded border border-ink/20 bg-paper px-3 text-sm uppercase"
                    required
                  />
                </label>
              </div>
            </div>

            <div className="mt-6 border-t border-ink/15 pt-5">
              <p className="text-sm leading-relaxed text-ink/68">
                Livraison en France uniquement. Pour une autre destination,
                contacte craneurboys@gmail.com.
              </p>
            </div>

            <button
              type="button"
              onClick={checkout}
              disabled={cartLines.length === 0 || checkoutStatus === "loading"}
              className="mt-6 w-full rounded bg-ink px-5 py-4 text-sm uppercase text-paper transition hover:bg-ink/85 active:bg-ink/75 disabled:cursor-not-allowed disabled:bg-ink/25 disabled:text-ink/55"
            >
              {checkoutStatus === "loading" ? "Redirection" : "Payer"}
            </button>
            {checkoutStatus === "error" ? (
              <p className="mt-3 text-sm text-ink/62">{checkoutError}</p>
            ) : null}
          </aside>
        </div>
        )}
      </div>
    </main>
  );
}

function addLine(lines: CartLine[], productId: string, size: string) {
  const lineKey = getLineKey(productId, size);
  const existingLine = lines.find(
    (line) => getLineKey(line.productId, line.size) === lineKey
  );

  if (existingLine) {
    return lines.map((line) =>
      getLineKey(line.productId, line.size) === lineKey
        ? { ...line, quantity: line.quantity + 1 }
        : line
    );
  }

  return [...lines, { productId, size, quantity: 1 }];
}
