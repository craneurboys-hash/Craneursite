"use client";

import { useEffect, useState } from "react";

const newsSlides = [
  {
    id: "event",
    eyebrow: "Futur event",
    title: "R&B",
    image: "/da/r-and-b.jpeg",
    href: "#events"
  },
  {
    id: "collection",
    eyebrow: "Nouvelle collection",
    title: "T-shirts",
    image: "/da/IMG_0624.JPG",
    href: "#merch"
  },
  {
    id: "photos",
    eyebrow: "Galerie",
    title: "Retrouvez vous en photo",
    image: "/da/photo-gallery-cover.jpeg",
    href: "#photos"
  }
];

export function LandingNews() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % newsSlides.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, []);

  const slides = newsSlides.map((slide, index) => (
    <a
      key={slide.id}
      href={slide.href}
      aria-hidden={activeIndex !== index}
      className={`absolute inset-0 transition-opacity duration-500 ${
        activeIndex === index
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <img
        src={slide.image}
        alt={slide.title}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(30,32,64,0.04)_0%,rgba(30,32,64,0.12)_48%,rgba(30,32,64,0.65)_100%)] md:bg-[linear-gradient(180deg,rgba(30,32,64,0)_0%,rgba(30,32,64,0.02)_52%,rgba(30,32,64,0.22)_100%)]" />
      <div className="absolute bottom-0 left-0 right-0 max-w-full p-4 md:p-7">
        <p className="mb-1 text-xs uppercase tracking-normal text-paper/80 md:mb-2">
          {slide.eyebrow}
        </p>
        <h1 className="max-w-full break-words text-5xl font-semibold uppercase leading-[0.92] tracking-normal text-paper min-[390px]:text-6xl md:text-7xl">
          {slide.title}
        </h1>
      </div>
    </a>
  ));

  return (
    <section
      id="home"
      className="relative min-h-[100svh] overflow-hidden bg-paper pt-14 text-paper md:pt-16"
    >
      <div className="absolute inset-x-0 bottom-0 top-14 overflow-hidden md:hidden">
        {slides}
      </div>

      <div className="absolute inset-x-0 bottom-0 top-16 hidden overflow-hidden md:block">
        <div className="landing-mockup-stage landing-mockup-stage-wide">
          <div className="absolute left-[30.5444%] top-[14.9858%] h-[64.2756%] w-[39.8522%] overflow-hidden bg-paper">
            {slides}
          </div>

          <img
            src="/da/vector1-frame-overlay.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-contain"
          />
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-10 flex gap-2 md:bottom-8 md:right-8">
        {newsSlides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Afficher ${slide.title}`}
            className={`focus-ring h-2.5 rounded-full transition-all ${
              activeIndex === index ? "w-8 bg-paper" : "w-2.5 bg-paper/45"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
