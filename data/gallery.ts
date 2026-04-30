export type GalleryImage = {
  id: string;
  event: string;
  date: string;
  src: string;
  alt: string;
};

export const galleryAlbumUrl =
  "https://drive.google.com/drive/folders/1jq-7ojLJkR5T9k_EdhrvTVmVJua3Nie3";

export const galleryImages: GalleryImage[] = [
  {
    id: "photo-01",
    event: "Derniere soiree",
    date: "Paris",
    src: "/da/IMG_2932.JPG",
    alt: "Foule en concert"
  },
  {
    id: "photo-02",
    event: "Derniere soiree",
    date: "Paris",
    src: "/da/IMG_2931.JPG",
    alt: "Scene et lumieres"
  },
  {
    id: "photo-03",
    event: "Club night",
    date: "Paris",
    src: "/da/IMG_2935.JPG",
    alt: "DJ en scene"
  },
  {
    id: "photo-04",
    event: "Club night",
    date: "Paris",
    src: "/da/IMG_0627.JPG",
    alt: "Public sous les lumieres"
  },
  {
    id: "photo-05",
    event: "After",
    date: "Paris",
    src: "/da/IMG_0624.JPG",
    alt: "Concert de nuit"
  },
  {
    id: "photo-06",
    event: "After",
    date: "Paris",
    src: "/da/IMG_0620.JPG",
    alt: "Salle de concert"
  }
];
