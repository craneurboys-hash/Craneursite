import { CartPage } from "@/components/cart-page";
import { merchProducts } from "@/data/merch";

type PanierPageProps = {
  searchParams?: Promise<{
    product?: string;
    size?: string;
    success?: string;
    canceled?: string;
  }>;
};

export default async function PanierPage({ searchParams }: PanierPageProps) {
  const params = await searchParams;

  return (
    <CartPage
      products={merchProducts}
      initialProductId={params?.product}
      initialSize={params?.size}
      success={params?.success === "1"}
      canceled={params?.canceled === "1"}
    />
  );
}
