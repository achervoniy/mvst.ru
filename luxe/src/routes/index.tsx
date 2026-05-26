import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCarousel } from "@/components/site/ProductCarousel";
import { searchProducts } from "@/lib/tsum/catalog.functions";
import homeHero from "@/assets/home-hero.webp";
import campaign from "@/assets/ss26-campaign.webp";
import homeWomen from "@/assets/home-women.webp";
import homeMen from "@/assets/home-men.webp";
import wCoat from "@/assets/p-w-coat.webp";
import wBelt from "@/assets/p-w-belt.webp";
import wLoafers from "@/assets/p-w-loafers-new.webp";
import mSuit from "@/assets/p-m-clothing-new.webp";
import mLoafers from "@/assets/p-m-shoes-new.webp";
import mBelt from "@/assets/p-m-belt-new.webp";
import { boutiques } from "./boutiques";

type WardrobeItem = {
  label: string;
  img: string;
  gender: "women" | "men";
  section: string;
};

const wardrobeTabs: ReadonlyArray<{
  key: "women" | "men";
  label: string;
  items: ReadonlyArray<WardrobeItem>;
}> = [
  {
    key: "women",
    label: "Для нее",
    items: [
      { label: "Одежда", img: wCoat, gender: "women", section: "odezhda-18413" },
      { label: "Обувь", img: wLoafers, gender: "women", section: "obuv-18405" },
      { label: "Аксессуары", img: wBelt, gender: "women", section: "aksessuary-2404" },
    ],
  },
  {
    key: "men",
    label: "Для него",
    items: [
      { label: "Одежда", img: mSuit, gender: "men", section: "odezhda-2409" },
      { label: "Обувь", img: mLoafers, gender: "men", section: "obuv-18440" },
      { label: "Аксессуары", img: mBelt, gender: "men", section: "aksessuary-4031" },
    ],
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MVST — Весна-лето 2026" },
      {
        name: "description",
        content:
          "Кашемир, шерсть, лен и кожа высочайшего качества. Откройте новую коллекцию MVST Весна-лето 2026.",
      },
      { property: "og:title", content: "MVST — Весна-лето 2026" },
      {
        property: "og:description",
        content: "Новая коллекция MVST. Тихий люкс ручной работы.",
      },
      { property: "og:image", content: homeHero },
    ],
  }),
  loader: async () => {
    const [women, men] = await Promise.all([
      searchProducts({ data: { gender: "women" } }),
      searchProducts({ data: { gender: "men" } }),
    ]);
    return {
      showcase: {
        women: women.items.slice(0, 10),
        men: men.items.slice(0, 10),
      },
    };
  },
  staleTime: 5 * 60 * 1000,
  component: HomePage,
});

function HomePage() {
  const { showcase } = Route.useLoaderData();
  const [activeWardrobeTab, setActiveWardrobeTab] =
    useState<(typeof wardrobeTabs)[number]["key"]>("women");
  const activeWardrobe =
    wardrobeTabs.find((tab) => tab.key === activeWardrobeTab) ?? wardrobeTabs[0];

  return (
    <SiteLayout transparentHeader>
      {/* HERO */}
      <section
        data-hero
        className="relative h-[72vh] min-h-[520px] md:h-[88vh] md:min-h-[640px] overflow-hidden"
      >
        <img
          src={homeHero}
          alt="MVST Весна-лето 2026"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 size-full object-cover object-[50%_16%] md:object-[50%_12%] xl:object-[50%_8%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/35" />
        <div className="relative z-10 h-full flex flex-col items-center justify-end pb-16 md:pb-20 px-6 text-center text-cream">
          <h1 className="font-serif text-5xl md:text-7xl font-light leading-[1.05]">
            Весна-лето 2026
          </h1>
          <Link
            to="/collection-ss26"
            preload="intent"
            className="mt-5 md:mt-6 inline-block eyebrow-lg leading-none border-b border-cream/70 pb-1 hover:border-cream"
          >
            Перейти к коллекции
          </Link>
        </div>
      </section>

      {/* WOMEN / MEN SPLIT */}
      <section className="grid md:grid-cols-2 gap-px bg-foreground/10">
        {[
          { gender: "women" as const, label: "Для нее", img: homeWomen },
          { gender: "men" as const, label: "Для него", img: homeMen },
        ].map((s) => (
          <Link
            key={s.gender}
            to="/catalog/$gender"
            params={{ gender: s.gender }}
            preload="intent"
            className="group relative block aspect-[5/7] md:aspect-[2/3] overflow-hidden bg-sand"
          >
            <img
              src={s.img}
              alt={s.label}
              loading="lazy"
              className="absolute inset-0 size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:transform-none"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-14 md:justify-center md:pb-0 text-cream">
              <div className="font-serif text-5xl md:text-6xl">{s.label}</div>
              <div className="mt-5 eyebrow leading-none border-b border-cream/70 pb-1">Открыть каталог</div>
            </div>
          </Link>
        ))}
      </section>

      {/* CATEGORIES TRIPTYCH */}
      <section className="px-6 md:px-16 py-24">
        <div className="text-center mb-16">
          <div className="eyebrow text-foreground/60 mb-4">Категории</div>
          <h2 className="font-serif text-4xl md:text-5xl">Гардероб MVST</h2>
          <div className="mt-8 flex items-center justify-center gap-8">
            {wardrobeTabs.map((tab) => {
              const isActive = tab.key === activeWardrobeTab;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveWardrobeTab(tab.key)}
                  className={
                    isActive
                      ? "eyebrow border-b border-foreground pb-2 text-foreground"
                      : "eyebrow border-b border-transparent pb-2 text-foreground/45 transition-colors hover:text-foreground/75"
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
        {/* Mobile: horizontal snap-carousel; Desktop: 3-col grid */}
        <div className="-mx-6 md:mx-0 px-6 md:px-0 flex md:grid md:grid-cols-3 gap-6 md:gap-10 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {activeWardrobe.items.map((c) => (
            <Link
              key={c.label}
              to="/catalog/$gender/$section"
              params={{ gender: c.gender, section: c.section }}
              preload="intent"
              className="group block shrink-0 w-[78%] md:w-auto snap-center"
            >
              <div className="aspect-[3/4] overflow-hidden bg-sand">
                <img
                  src={c.img}
                  alt={c.label}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:transform-none"
                />
              </div>
              <div className="mt-5 text-center font-serif text-2xl">{c.label}</div>
            </Link>
          ))}
        </div>

        {/* Product carousel — first 10 items from active gender's catalog */}
        <div className="mt-16 md:mt-24">
          <ProductCarousel items={showcase[activeWardrobeTab]} viewAllGender={activeWardrobeTab} />
        </div>
      </section>

      {/* PHILOSOPHY STRIP */}
      <section className="bg-sand/60 py-24 md:py-32 px-6 md:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="eyebrow text-foreground/60 mb-6">Философия MVST</div>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-8">
            Архитектура личного стиля
          </h2>
          <p className="text-foreground/75 leading-relaxed mb-10">
            Исключительность в каждой детали. Лаконичный крой, благородные материалы,
            сдержанная палитра и безупречное исполнение для тех, чьи стандарты не знают
            компромиссов.
          </p>
          <Link
            to="/about"
            preload="intent"
            className="eyebrow leading-none border-b border-foreground pb-1 hover:text-accent hover:border-accent"
          >
            О бренде
          </Link>
        </div>
      </section>

      {/* BOUTIQUES */}
      <section className="px-6 md:px-16 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="eyebrow text-foreground/60 mb-3">Бутики</div>
            <h2 className="font-serif text-3xl md:text-4xl">География MVST</h2>
          </div>
          <Link
            to="/boutiques"
            preload="intent"
            className="hidden md:inline-block eyebrow leading-none border-b border-foreground pb-1 hover:text-accent hover:border-accent"
          >
            Все бутики
          </Link>
        </div>
        <div className="grid gap-x-6 gap-y-10 md:gap-y-6 grid-cols-2 md:grid-cols-3">
          {boutiques.slice(0, 6).map((b) => (
            <Link key={b.name} to="/boutiques" hash={b.slug} preload="intent" className="group block">
              <div className="aspect-[1005/816] overflow-hidden bg-sand">
                <img
                  src={b.img}
                  alt={b.name}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:transform-none"
                />
              </div>
              <div className="pt-5">
                <div className="font-serif text-xl">{b.name}</div>
                <div className="text-sm text-foreground/65 mt-1">{b.addr}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
