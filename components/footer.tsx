export function Footer() {
  return (
    <footer className="border-t border-ink/15 px-4 py-8 text-ink md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center">
        <p className="font-display text-3xl uppercase leading-none">
          CRANEURBOYS
        </p>
        <div className="flex items-center justify-center gap-3">
          <a
            aria-label="Envoyer un mail"
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded text-ink/72 transition hover:bg-ink hover:text-paper"
            href="mailto:craneurboys@gmail.com"
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <rect height="16" rx="2" width="20" x="2" y="4" />
              <path d="m22 7-10 7L2 7" />
            </svg>
          </a>
          <a
            aria-label="Instagram"
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded text-ink/72 transition hover:bg-ink hover:text-paper"
            href="https://www.instagram.com/craneurboys/"
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <rect height="20" rx="5" width="20" x="2" y="2" />
              <circle cx="12" cy="12" r="4" />
              <path d="M17.5 6.5h.01" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
