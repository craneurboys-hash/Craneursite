import { ArtistsSection } from "@/components/artists-section";
import { EventsSection } from "@/components/events-section";
import { Footer } from "@/components/footer";
import { GallerySection } from "@/components/gallery-section";
import { Header } from "@/components/header";
import { LandingNews } from "@/components/landing-news";
import { MerchSection } from "@/components/merch-section";
import { artists } from "@/data/artists";
import { events } from "@/data/events";
import { galleryAlbumUrl, galleryImages } from "@/data/gallery";
import { merchProducts } from "@/data/merch";

export default function Home() {
  return (
    <main>
      <Header />
      <LandingNews />
      <EventsSection events={events} />
      <MerchSection products={merchProducts} />
      <GallerySection images={galleryImages} albumUrl={galleryAlbumUrl} />
      <ArtistsSection artists={artists} />
      <Footer />
    </main>
  );
}
