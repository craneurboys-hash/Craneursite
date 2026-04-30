const navItems = [
  { label: "Events", href: "#events" },
  { label: "Merch", href: "#merch" },
  { label: "Photos", href: "#photos" },
  { label: "Artistes", href: "#artistes" }
];

export function Header() {
  return (
    <header className="fixed left-0 top-0 z-40 h-14 w-full border-b border-ink/15 bg-paper text-ink md:h-16">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-2 px-3 md:gap-4 md:px-8">
        <a
          href="#home"
          className="focus-ring flex h-full min-w-0 items-center py-1"
          aria-label="CRANEURBOYS"
        >
          <img
            src="/da/logo-craneurboys-new-cropped.png"
            alt="CRANEURBOYS"
            className="header-logo h-auto max-h-9 w-auto max-w-[40vw] object-contain md:max-h-full md:max-w-none"
          />
        </a>
        <nav className="flex max-w-[58vw] gap-1 overflow-x-auto text-[10px] uppercase tracking-normal text-logo-blue md:max-w-none md:gap-5 md:text-xs">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="focus-ring shrink-0 rounded px-1.5 py-2 transition hover:bg-logo-blue hover:text-paper md:px-2"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
