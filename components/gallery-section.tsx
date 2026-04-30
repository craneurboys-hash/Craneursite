import type { GalleryImage } from "@/data/gallery";
import type { CSSProperties } from "react";

type GallerySectionProps = {
  images: GalleryImage[];
  albumUrl: string;
};

const desktopImagePositions: CSSProperties[] = [
  { position: "absolute", left: "-7%", top: "8%", height: 280, width: 230 },
  { position: "absolute", left: "28%", top: 0, height: 210, width: 255 },
  { position: "absolute", right: "25%", top: "6%", height: 270, width: 280 },
  { position: "absolute", right: "-8%", top: 0, height: 240, width: 300 },
  { position: "absolute", left: "15%", top: "50%", height: 280, width: 280 },
  { position: "absolute", right: "9%", top: "47%", height: 280, width: 280 }
];

export function GallerySection({ images, albumUrl }: GallerySectionProps) {
  return (
    <section
      id="photos"
      className="overflow-hidden border-t border-ink/15 bg-paper px-4 py-16 text-ink md:px-8 md:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-3xl text-center md:hidden">
          <p className="mb-8 text-sm uppercase tracking-normal text-ink/58">
            Galerie
          </p>
          <h2 className="mb-8 text-5xl font-semibold uppercase leading-none tracking-normal text-ink">
            Soirees
          </h2>
          <GalleryAlbumButton albumUrl={albumUrl} className="mx-auto" />
        </div>

        <div className="grid grid-cols-3 gap-3 md:hidden">
          {images.slice(0, 6).map((image, index) => (
            <GalleryImageFrame
              key={image.id}
              image={image}
              className="aspect-[4/5] w-full"
            />
          ))}
        </div>

        <div className="relative hidden min-h-[760px] md:block xl:min-h-[840px]">
          <div className="absolute left-1/2 top-[45%] z-10 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="mb-8 text-sm uppercase tracking-normal text-ink/58">
              Galerie
            </p>
            <h2 className="mb-8 text-6xl font-semibold uppercase leading-none tracking-normal text-ink lg:text-7xl">
              Soirees
            </h2>
            <GalleryAlbumButton albumUrl={albumUrl} className="mx-auto" />
          </div>

          {images.slice(0, 6).map((image, index) => (
            <GalleryImageFrame
              key={image.id}
              image={image}
              className="absolute z-0"
              style={desktopImagePositions[index]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type GalleryImageFrameProps = {
  image: GalleryImage;
  className: string;
  style?: CSSProperties;
};

function GalleryImageFrame({
  image,
  className,
  style
}: GalleryImageFrameProps) {
  return (
    <div
      className={`group relative block overflow-hidden bg-paper text-left ${className}`}
      style={style}
    >
      <img
        src={image.src}
        alt={image.alt}
        className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.025]"
      />
    </div>
  );
}

type GalleryAlbumButtonProps = {
  albumUrl: string;
  className?: string;
};

function GalleryAlbumButton({ albumUrl, className = "" }: GalleryAlbumButtonProps) {
  return (
    <a
      href={albumUrl}
      className={`focus-ring inline-flex justify-center rounded border border-ink bg-ink px-5 py-3 text-sm uppercase text-paper transition hover:bg-ink/85 active:bg-ink/75 ${className}`}
    >
      Retrouvez vous en photo
    </a>
  );
}
