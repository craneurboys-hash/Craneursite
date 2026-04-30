import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRANEURBOYS",
  description: "Collectif electro parisien. Events, merch, photos et artistes."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
