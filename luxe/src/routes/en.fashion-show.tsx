import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { LookbookStage } from "@/components/site/LookbookStage";
import looksData from "@/data/looks.json";
import type { Collection } from "@/types/looks";
import heroImg from "@/assets/lookbook-hero.webp";

const collection = looksData as unknown as Collection;

export const Route = createFileRoute("/en/fashion-show")({
  head: () => ({
    meta: [
      { title: "Fashion Show — MVST" },
      {
        name: "description",
        content:
          "MVST Fashion Show — runway films, looks from the season and editorial frames.",
      },
      { property: "og:title", content: "Fashion Show — MVST" },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: EnFashionShowPage,
});

const VIDEO_DESKTOP =
  "https://st-cdn.tsum.com/static/upload/mvst_desktop_04_26.mov?u=1776854797";
const VIDEO_MOBILE =
  "https://st-cdn.tsum.com/static/upload/mvst_mobile_04_26.mov?u=1776854797";

const RUTUBE_EMBED =
  "https://rutube.ru/play/embed/32a61d90014469a6115221e6600357f0/";

const podiumPhotos = [
  "/fashion-show/forbes/0001.jpg",
  "/fashion-show/forbes/0007.jpg",
  "/fashion-show/forbes/0021.jpg",
  "/fashion-show/forbes/0027.jpg",
  "/fashion-show/forbes/0028.jpg",
  "/fashion-show/forbes/0045.jpg",
  "/fashion-show/forbes/0026.jpg",
  "/fashion-show/forbes/0822.jpg",
];

function EnFashionShowPage() {
  return (
    <SiteLayout transparentHeader>
      {/* HERO */}
      <section
        data-hero
        className="relative h-[78vh] min-h-[560px] md:h-[90vh] md:min-h-[680px] overflow-hidden bg-foreground"
      >
        <video
          src={VIDEO_DESKTOP}
          poster={heroImg}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="hidden md:block absolute inset-0 size-full object-cover opacity-90"
        />
        <video
          src={VIDEO_MOBILE}
          poster={heroImg}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="md:hidden absolute inset-0 size-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/55" />
        <div className="relative z-10 h-full flex flex-col items-center justify-end pb-20 px-6 text-center text-cream">
          <div className="eyebrow-lg mb-6 opacity-90">Fashion Show</div>
          <h1 className="font-serif text-5xl md:text-7xl font-light leading-[1.05]">
            The MVST Runway
          </h1>
          <p className="mt-8 max-w-xl text-base md:text-lg leading-relaxed opacity-90">
            A chronicle of MVST shows — runway films and editorial frames
            from each season.
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="px-6 py-20 md:py-28 max-w-3xl mx-auto text-center">
        <div className="eyebrow text-foreground/60 mb-6">About the show</div>
        <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-8">
          A season in one evening
        </h2>
        <p className="text-foreground/75 leading-relaxed text-lg">
          A runway show is a collection’s own dramaturgy. Light, music and
          the model’s movement turn quiet luxury into a gesture. Here are
          the films and the strongest frames of past MVST shows.
        </p>
      </section>

      {/* VIDEO — rutube embed */}
      <section className="bg-foreground/[0.04] py-10 md:py-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="eyebrow text-foreground/60 mb-4 md:mb-6 text-center">
            Runway film
          </div>
          <div className="relative aspect-video bg-foreground/10 overflow-hidden">
            <iframe
              src={RUTUBE_EMBED}
              title="MVST runway film"
              className="absolute inset-0 size-full border-0"
              allow="clipboard-write; autoplay"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* LOOKBOOK STAGE */}
      <section className="bg-cream/60 border-y hairline">
        <LookbookStage looks={collection.looks} labelText="Look" />
      </section>

      {/* PULL QUOTE */}
      <section className="bg-foreground/[0.04]">
        <div className="px-6 py-24 md:py-32 max-w-3xl mx-auto text-center">
          <p className="font-serif text-3xl md:text-4xl leading-[1.3] text-foreground/85">
            “The runway is a collection spoken aloud.”
          </p>
        </div>
      </section>

      {/* PODIUM grid */}
      <section className="px-6 md:px-12 py-20 md:py-28 max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <div className="eyebrow text-foreground/60 mb-3">Editorial</div>
          <h3 className="font-serif text-3xl md:text-5xl leading-tight">
            The runway, frame by frame
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {podiumPhotos.map((src, i) => (
            <PhotoTile key={src} src={src} alt={`Runway frame ${i + 1}`} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

function PhotoTile({
  src,
  alt,
  ratio = "aspect-[3/4]",
}: {
  src: string;
  alt: string;
  ratio?: string;
}) {
  return (
    <div className={`relative ${ratio} overflow-hidden bg-sand`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 size-full object-cover"
      />
    </div>
  );
}
