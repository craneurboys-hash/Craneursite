import type { EventItem } from "@/data/events";

type EventsSectionProps = {
  events: EventItem[];
};

export function EventsSection({ events }: EventsSectionProps) {
  const [mainEvent] = events;

  return (
    <section
      id="events"
      className="border-t border-ink/15 px-4 pb-16 pt-16 text-ink md:min-h-screen md:px-8 md:pt-24"
    >
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-[1fr_0.95fr] lg:grid-cols-[1fr_1fr]">
        <div className="relative min-h-[420px] overflow-hidden rounded border border-ink/18 bg-paper text-ink md:min-h-[68vh]">
          <img
            src={mainEvent.image}
            alt={`Affiche ${mainEvent.title}`}
            className="media-blueprint absolute inset-0 h-full w-full object-cover md:object-contain"
          />
        </div>

        <div className="flex flex-col">
          <div className="flex h-full flex-col border border-ink/18 bg-paper p-5 md:min-h-[68vh] md:p-10">
            <div className="grid gap-4 md:gap-7">
              <div>
                <p className="text-xs uppercase text-ink/48">Date</p>
                <p className="break-words text-xl uppercase md:text-3xl">
                  {mainEvent.date}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-ink/48">Lieu</p>
                <p className="break-words text-xl uppercase md:text-3xl">
                  {mainEvent.place} / {mainEvent.city}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-ink/48">Line-up</p>
                <p className="break-words text-base uppercase md:text-2xl">
                  {mainEvent.lineup.join(" - ")}
                </p>
              </div>
            </div>

            <details className="mt-6 border-t border-ink/15 pt-5 md:hidden">
              <summary className="focus-ring cursor-pointer rounded text-sm uppercase text-ink active:text-ink/75">
                En savoir plus sur l'event
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-ink/72">
                {mainEvent.description}
              </p>
            </details>

            <div className="mt-8 hidden border-t border-ink/15 pt-7 md:block">
              <p className="mb-2 text-xs uppercase text-ink/48">Description</p>
              <p className="text-base leading-relaxed text-ink/72 lg:text-lg">
                {mainEvent.description}
              </p>
            </div>

            <a
              href={mainEvent.ticketUrl || "#events"}
              className="focus-ring mt-7 inline-flex w-full justify-center rounded border border-ink bg-ink px-5 py-3 text-sm uppercase text-paper transition hover:bg-ink/85 active:bg-ink/75 md:mt-auto md:w-auto md:self-start"
            >
              {mainEvent.ticketUrl ? "Billetterie" : "Billetterie bientot"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
