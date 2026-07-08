import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { LookbookStage } from "@/components/site/LookbookStage";
import looksData from "@/data/looks.json";
import type { Collection } from "@/types/looks";
import heroSs26 from "@/assets/hero-ss26.webp";

const collection = looksData as unknown as Collection;

export const Route = createFileRoute("/collection-ss26")({
  head: () => ({
    meta: [
      { title: "Коллекция Весна-Лето 2026 — MVST" },
      {
        name: "description",
        content:
          "Лукбук коллекции MVST Весна-Лето 2026. 158 образов: кожа, шелк, лен и японский деним. Архитектурные силуэты и природная палитра.",
      },
      { property: "og:title", content: "Коллекция Весна-Лето 2026 — MVST" },
      {
        property: "og:description",
        content: "Editorial-лукбук MVST Весна-Лето 2026 — 158 образов сезона.",
      },
      { property: "og:image", content: heroSs26 },
      { property: "twitter:image", content: heroSs26 },
    ],
  }),
  component: CollectionSS26,
});

function CollectionSS26() {
  const looks = collection.looks;
  const looksRef = useRef<HTMLElement>(null);

  const scrollToLooks = () => {
    looksRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const description = useMemo(
    () => collection.description.split(/\n\n+/).filter(Boolean),
    [],
  );

  return (
    <SiteLayout transparentHeader>
      {/* Cover */}
      <section
        data-hero
        className="relative h-[72vh] min-h-[520px] md:h-[88vh] md:min-h-[640px] overflow-hidden"
      >
        <img
          src={heroSs26}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 size-full object-cover object-[50%_16%] md:object-[50%_12%] xl:object-[50%_8%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/35" />
        <div className="relative z-10 h-full flex flex-col items-center justify-end pb-20 px-6 text-center text-cream">
          <h1 className="font-serif text-5xl md:text-7xl font-light leading-[1.05]">
            Коллекция Весна-Лето 2026
          </h1>
          <button
            type="button"
            onClick={scrollToLooks}
            className="mt-8 md:mt-10 inline-flex items-center justify-center rounded-full bg-cream text-foreground px-7 py-3 eyebrow hover:bg-white transition-colors"
          >
            Смотреть образы
          </button>
        </div>
      </section>

      {/* Intro paragraph */}
      <section className="py-20 md:py-24 px-6 max-w-2xl mx-auto text-center">
        <div className="eyebrow text-foreground/60 mb-6">О коллекции</div>
        <p className="font-serif text-2xl md:text-[28px] leading-[1.4] text-foreground">
          {description[0]}
        </p>
      </section>

      {/* Lookbook stage — общий с /fashion-show */}
      <section
        ref={looksRef}
        id="looks"
        style={{ scrollMarginTop: "var(--header-h, 96px)" }}
        className="bg-cream/60 border-y hairline"
      >
        <LookbookStage looks={looks} />
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 px-6 text-center">
        <div className="eyebrow text-foreground/60 mb-6">Каталог</div>
        <h2 className="font-serif text-4xl md:text-5xl mb-10">Перейти к покупкам</h2>
        <div className="flex justify-center gap-10">
          <Link
            to="/catalog/$gender"
            params={{ gender: "women" }}
            preload="intent"
            className="eyebrow-lg leading-none border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            Для нее
          </Link>
          <Link
            to="/catalog/$gender"
            params={{ gender: "men" }}
            preload="intent"
            className="eyebrow-lg leading-none border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            Для него
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
