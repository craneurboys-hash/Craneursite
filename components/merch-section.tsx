"use client";

import { useEffect, useMemo, useState } from "react";
import type { MerchProduct } from "@/data/merch";
import { SectionTitle } from "./section-title";

type MerchSectionProps = {
  products: MerchProduct[];
};

type StockItem = {
  productId: string;
  size: string;
  stock: number;
  price: string;
  stripePriceId: string;
};

function getStockKey(productId: string, size: string) {
  return `${productId}:${size.toUpperCase()}`;
}

export function MerchSection({ products }: MerchSectionProps) {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [stockStatus, setStockStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const stockByKey = useMemo(
    () =>
      new Map(
        stockItems.map((item) => [getStockKey(item.productId, item.size), item])
      ),
    [stockItems]
  );

  useEffect(() => {
    function loadStock() {
      fetch("/api/stock", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load stock");
        }

        return response.json() as Promise<{ stock: StockItem[] }>;
      })
      .then((data) => {
        setStockItems(data.stock);
        setStockStatus("ready");
      })
      .catch(() => setStockStatus("error"));
    }

    loadStock();
    window.addEventListener("pageshow", loadStock);
    window.addEventListener("focus", loadStock);

    return () => {
      window.removeEventListener("pageshow", loadStock);
      window.removeEventListener("focus", loadStock);
    };
  }, []);

  return (
    <section
      id="merch"
      className="border-t border-ink/15 px-4 py-16 text-ink md:min-h-screen md:px-8 md:py-20 lg:py-16"
    >
      <div className="mx-auto max-w-7xl">
        <SectionTitle kicker="" title="Drop t-shirts" />

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product) => {
            const productStock = product.sizes.map((size) =>
              stockByKey.get(getStockKey(product.id, size.label))
            );
            const isAvailable = productStock.some((item) => item && item.stock > 0);
            const displayPrice = productStock.find((item) => item?.price)?.price;

            return (
              <article
                key={product.id}
                className="group rounded border border-ink/18 bg-paper p-2"
              >
                <div className="relative overflow-hidden rounded bg-chrome">
                  <div className="aspect-[4/5] overflow-hidden md:h-[42vh] md:max-h-[430px] md:min-h-[300px] md:aspect-auto lg:h-[46vh]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="merch-size-panel absolute inset-x-2 bottom-2 rounded bg-paper p-2 opacity-0 shadow-sm transition duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                    <div className="flex gap-2">
                      {product.sizes.map((size) => {
                        const inputId = `${product.id}-${size.label}`;
                        const sizeClass = `merch-size-${size.label.toLowerCase()}`;
                        const sizeStock = stockByKey.get(
                          getStockKey(product.id, size.label)
                        );
                        const isSizeAvailable =
                          stockStatus === "ready" &&
                          Number(sizeStock?.stock || 0) > 0;

                        return isSizeAvailable ? (
                          <div key={size.label} className="flex-1">
                            <input
                              id={inputId}
                              type="radio"
                              name={`selected-size-${product.id}`}
                              className={`peer sr-only merch-size-input ${sizeClass}`}
                            />
                            <label
                              htmlFor={inputId}
                              className="focus-ring flex h-10 cursor-pointer items-center justify-center rounded border border-ink/20 bg-paper text-xs uppercase text-ink transition hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper"
                            >
                              {size.label}
                            </label>
                          </div>
                        ) : (
                          <button
                            key={size.label}
                            type="button"
                            disabled
                            className="h-10 flex-1 cursor-not-allowed rounded border border-ink/20 bg-paper text-xs uppercase text-ink/45"
                          >
                            {size.label}
                          </button>
                        );
                      })}
                    </div>

                    {isAvailable
                      ? product.sizes.map((size) => {
                          const sizeStock = stockByKey.get(
                            getStockKey(product.id, size.label)
                          );

                          return sizeStock && sizeStock.stock > 0 ? (
                            <a
                              key={size.label}
                              href={`/panier?product=${product.id}&size=${size.label}`}
                              className={`merch-size-cta merch-size-cta-${size.label.toLowerCase()} focus-ring mt-2 h-10 items-center justify-center rounded bg-ink px-4 text-xs uppercase text-paper transition hover:bg-ink/85 active:bg-ink/75`}
                            >
                              Passer au panier
                            </a>
                          ) : null;
                        })
                      : null}
                  </div>
                </div>

                <p className="mt-2 text-xs uppercase text-ink/62">
                  {stockStatus === "loading"
                    ? "Stock en cours"
                    : isAvailable
                      ? "Disponible"
                      : "Out of stock"}
                </p>
                {displayPrice ? (
                  <p className="mt-1 text-sm uppercase text-ink">{displayPrice}</p>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
