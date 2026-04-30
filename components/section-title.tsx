type SectionTitleProps = {
  kicker: string;
  title: string;
  note?: string;
};

export function SectionTitle({ kicker, title, note }: SectionTitleProps) {
  return (
    <div className="mb-7 flex flex-col gap-3 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div>
        {kicker ? (
          <p className="mb-2 text-xs uppercase tracking-normal text-acid">
            {kicker}
          </p>
        ) : null}
        <h2 className="break-words font-display text-4xl uppercase leading-none tracking-normal min-[390px]:text-5xl md:text-7xl">
          {title}
        </h2>
      </div>
      {note ? (
        <p className="max-w-sm text-sm leading-relaxed text-ink/68 md:text-right">
          {note}
        </p>
      ) : null}
    </div>
  );
}
