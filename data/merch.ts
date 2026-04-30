export type MerchSize = {
  label: string;
};

export type MerchProduct = {
  id: string;
  name: string;
  price: string;
  status: "Precommande" | "Disponible" | "Bientot";
  description: string;
  details: string[];
  shippingDelay: string;
  image: string;
  sizes: MerchSize[];
};

const defaultSizes: MerchSize[] = [
  { label: "S" },
  { label: "M" },
  { label: "L" },
  { label: "XL" }
];

export const merchProducts: MerchProduct[] = [
  {
    id: "tshirt-01",
    name: "T-shirt 01",
    price: "Prix a definir",
    status: "Precommande",
    description: "Premier drop CRANEURBOYS.",
    details: ["Coupe a definir", "Coloris a definir", "Edition limitee"],
    shippingDelay: "Expedition manuelle apres production.",
    image: "/da/IMG_0624.JPG",
    sizes: defaultSizes
  },
  {
    id: "tshirt-02",
    name: "T-shirt 02",
    price: "Prix a definir",
    status: "Precommande",
    description: "Deuxieme piece du drop.",
    details: ["Coupe a definir", "Coloris a definir", "Edition limitee"],
    shippingDelay: "Expedition manuelle apres production.",
    image: "/da/e3b092f1-tshirt.jpeg",
    sizes: defaultSizes
  },
  {
    id: "tshirt-03",
    name: "T-shirt 03",
    price: "Prix a definir",
    status: "Precommande",
    description: "Piece capsule a verrouiller.",
    details: ["Coupe a definir", "Coloris a definir", "Edition limitee"],
    shippingDelay: "Expedition manuelle apres production.",
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=85",
    sizes: defaultSizes
  }
];
