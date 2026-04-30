import type { Artist } from "@/data/artists";
import { SectionTitle } from "./section-title";

type ArtistsSectionProps = {
  artists: Artist[];
};

export function ArtistsSection({ artists }: ArtistsSectionProps) {
  return (
    <section id="artistes" className="section-pad border-t border-ink/15 text-ink">
      <div className="mx-auto max-w-7xl">
        <SectionTitle kicker="Artists" title="Crew" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {artists.map((artist) => (
            <article
              key={artist.id}
              className="rounded border border-ink/18 bg-paper p-4 text-center"
            >
              <img
                src={artist.portrait}
                alt={artist.name}
                className="mx-auto mb-4 aspect-square w-32 rounded-full object-cover"
              />
              <h3 className="text-xl uppercase">{artist.name}</h3>
              <p className="mb-4 text-sm text-ink/62">{artist.role}</p>
              {artist.soundcloudUrl ? (
                <a
                  href={artist.soundcloudUrl}
                  className="focus-ring inline-flex rounded border border-acid px-4 py-2 text-xs uppercase text-acid transition hover:bg-acid hover:text-paper"
                >
                  SoundCloud
                </a>
              ) : (
                <span className="inline-flex rounded border border-ink/20 px-4 py-2 text-xs uppercase text-ink/42">
                  SoundCloud bientot
                </span>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
