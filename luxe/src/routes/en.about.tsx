import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { cn } from "@/lib/utils";
import heroImg from "@/assets/lookbook-hero.webp";

const editorialImg = "/about/style-editorial.jpg";
const craftImg = "/fashion-show/clothing/0023_3.jpg";

export const Route = createFileRoute("/en/about")({
  head: () => ({
    meta: [
      { title: "About — MVST" },
      {
        name: "description",
        content:
          "MVST — a capsule wardrobe of quiet luxury. Italian craftsmanship and the finest natural fibres.",
      },
      { property: "og:title", content: "About — MVST" },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: EnAboutPage,
});

const materials: ReadonlyArray<{
  name: string;
  description: string;
  mills: ReadonlyArray<{ name: string; note?: string }>;
}> = [
  {
    name: "Cashmere",
    description:
      "Mongolian and Italian fibres of exceptional fineness. Light, warm, holding shape for years.",
    mills: [
      { name: "Loro Piana", note: "the flagship of luxury fibres" },
      { name: "Cariaggi", note: "high-twist yarn" },
    ],
  },
  {
    name: "Wool",
    description:
      "Superfine merino and suiting fabrics with a dense diagonal weave.",
    mills: [
      { name: "Vitale Barberis Canonico", note: "merino" },
      { name: "Reda 1865", note: "suiting fabrics" },
      { name: "Loro Piana", note: "wool with silk" },
    ],
  },
  {
    name: "Silk",
    description:
      "Mulberry silk with a deep, restrained lustre. In linings and in fabrics where noble weight matters.",
    mills: [{ name: "Loro Piana" }],
  },
  {
    name: "Vicuña & alpaca",
    description: "Rare Andean fibres. Among the softest in existence.",
    mills: [{ name: "Colombo", note: "the historic mill in Borgosesia" }],
  },
  {
    name: "Linen & cotton",
    description: "Long-staple Italian linen and Egyptian Giza cotton.",
    mills: [{ name: "Olmetex" }],
  },
  {
    name: "Denim",
    description:
      "Selvedge denim from Italy and Japan. Tight twill, natural indigo, noble wear.",
    mills: [{ name: "Candiani", note: "the home of European selvedge" }],
  },
];

const facts: ReadonlyArray<{ label: string; value: string }> = [
  { label: "Country of production", value: "Italy" },
  { label: "Leading mill partners", value: "6+" },
  { label: "Proprietary technique", value: "La Nuvola" },
  { label: "Standard of make", value: "Quiet luxury" },
];

function EnAboutPage() {
  return (
    <SiteLayout transparentHeader>
      {/* HERO */}
      <section
        data-hero
        className="relative h-[72vh] min-h-[520px] md:h-[88vh] md:min-h-[640px] overflow-hidden"
      >
        <img
          src={heroImg}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 size-full object-cover object-[50%_25%] md:object-[50%_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/45" />
        <div className="relative z-10 h-full flex flex-col items-center justify-end pb-16 md:pb-20 px-6 text-center text-cream">
          <div className="eyebrow-lg mb-6 opacity-90">About the house</div>
          <h1 className="font-serif text-6xl md:text-8xl font-light leading-[1.05]">MVST</h1>
          <p className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed opacity-90">
            A capsule wardrobe for those who choose the very best.
          </p>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="px-6 py-14 md:py-32 max-w-3xl mx-auto text-center">
        <div className="eyebrow text-foreground/60 mb-6">Philosophy</div>
        <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-10">
          Architecture of personal style
        </h2>
        <p className="text-foreground/75 leading-relaxed text-lg">
          Exceptional in every detail. Considered cuts, noble materials, a restrained
          palette and impeccable execution for those whose standards know no
          compromise.
        </p>
      </section>

      {/* EDITORIAL STRIP — between philosophy and materials */}
      <section className="relative h-[60vh] min-h-[420px] md:h-[78vh] md:min-h-[600px] overflow-hidden">
        <img
          src={editorialImg}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover object-[50%_25%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/35" />
        <div className="relative z-10 h-full flex items-end pb-12 md:pb-16 px-6 md:px-12">
          <p className="font-serif text-xl md:text-2xl text-cream/95 max-w-md leading-snug">
            Style begins with the material.
          </p>
        </div>
      </section>

      {/* MATERIALS */}
      <section className="bg-background">
        <div className="px-6 md:px-12 pt-20 md:pt-28 pb-6 max-w-6xl mx-auto text-center">
          <div className="eyebrow text-foreground/60 mb-4">Materials</div>
          <h3 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
            It all begins with the fibre
          </h3>
          <p className="text-foreground/70 leading-relaxed max-w-2xl mx-auto">
            Every MVST fabric is chosen for its character. The mills we work with are
            a consequence of that choice — not its cause.
          </p>
        </div>

        <div className="px-6 md:px-12 pb-20 md:pb-28 max-w-6xl mx-auto">
          <MaterialsList />
        </div>

        <div className="border-t hairline px-6 md:px-12 py-14 md:py-16 max-w-3xl mx-auto text-foreground/70 leading-relaxed text-center">
          In outerwear — precious fur, Spanish shearling, technical nylon and Thermore
          insulation. Contrast plays out between smooth leather, textured suede and
          karakulcha.
        </div>
      </section>

      {/* CRAFT */}
      <section
        id="craft"
        className="scroll-mt-24 grid md:grid-cols-2 gap-px bg-foreground/10"
      >
        <div className="p-10 md:p-16 flex flex-col justify-center bg-background order-2 md:order-1">
          <div className="eyebrow text-foreground/60 mb-4">Craft</div>
          <h3 className="font-serif text-3xl md:text-4xl mb-6">Made in Italy</h3>
          <p className="text-foreground/75 leading-relaxed">
            MVST collections are entrusted to historic Italian ateliers. The legacy
            of tailoring lives in the details that demand hand work: the filigree of
            lapels, the perfect shoulder, the gentle final finish that gives a
            garment its character.
          </p>
        </div>
        <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-background order-1 md:order-2">
          <img
            src={craftImg}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-contain"
          />
        </div>
      </section>

      {/* LA NUVOLA */}
      <section className="bg-foreground text-background px-6 py-28 md:py-36">
        <div className="max-w-3xl mx-auto text-center">
          <div className="eyebrow text-background/55 mb-8">Technology</div>
          <h3 className="font-serif text-5xl md:text-7xl leading-[1.05] mb-10">
            La&nbsp;Nuvola
          </h3>
          <p className="text-background/80 leading-relaxed text-lg">
            Beyond classic knitting, MVST employs the proprietary “Nuvola” technique
            — cashmere of an almost weightless softness.
          </p>
        </div>
      </section>

      {/* FACTS */}
      <section className="px-6 pt-24 md:pt-28 pb-12 md:pb-16 max-w-3xl mx-auto">
        <ul className="divide-y divide-foreground/10 border-y border-foreground/10">
          {facts.map((f) => (
            <li
              key={f.label}
              className="flex items-center justify-between gap-6 py-5 md:py-6"
            >
              <span className="eyebrow text-foreground/55 max-w-[20ch]">{f.label}</span>
              <span className="font-serif text-2xl md:text-3xl text-foreground text-right">
                {f.value}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* SUSTAINABILITY */}
      <section
        id="sustainability"
        className="scroll-mt-24 px-6 pt-4 pb-20 md:pt-8 md:pb-28 max-w-3xl mx-auto text-center"
      >
        <div className="eyebrow text-foreground/60 mb-6">Sustainability</div>
        <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-8">
          A considered wardrobe
        </h2>
        <p className="text-foreground/75 leading-relaxed text-lg">
          MVST creates collections that do not compete but complement and continue
          one another. The perfect compatibility of new pieces with those of seasons
          past — combined with the quality of materials and execution — gives your
          wardrobe longevity and makes fashion a conscious choice.
        </p>
      </section>
    </SiteLayout>
  );
}

function MaterialsList() {
  const [open, setOpen] = useState<string | null>(materials[0]?.name ?? null);

  return (
    <ul className="border-t hairline">
      {materials.map((m) => {
        const isOpen = open === m.name;
        return (
          <li key={m.name} className="border-b hairline">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : m.name)}
              aria-expanded={isOpen}
              className="w-full grid grid-cols-[1fr_auto] md:grid-cols-[1fr_minmax(260px,1.2fr)_auto] items-baseline gap-4 md:gap-10 text-left py-7 md:py-9 group"
            >
              <span
                className={cn(
                  "font-serif text-3xl md:text-5xl font-light leading-none transition-colors",
                  isOpen ? "text-foreground" : "text-foreground/85 group-hover:text-foreground",
                )}
              >
                {m.name}
              </span>
              <span className="hidden md:block text-foreground/55 text-sm leading-relaxed max-w-md">
                {m.description}
              </span>
              <span
                aria-hidden
                className={cn(
                  "justify-self-end shrink-0 size-9 md:size-10 rounded-full border hairline flex items-center justify-center text-foreground/60 transition-transform duration-300",
                  isOpen && "rotate-45 border-foreground text-foreground",
                )}
              >
                <Plus className="size-4" strokeWidth={1.25} />
              </span>
            </button>

            <div className="md:hidden -mt-2 pb-1 text-foreground/55 text-sm leading-relaxed">
              {m.description}
            </div>

            <div
              className={cn(
                "grid transition-all duration-500 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100 pb-8" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div className="eyebrow text-foreground/45 mb-4">Mills</div>
                <ul className="flex flex-wrap gap-x-8 gap-y-4">
                  {m.mills.map((mill) => (
                    <li key={mill.name} className="flex flex-col">
                      <span className="font-serif text-base md:text-lg text-foreground/80">
                        {mill.name}
                      </span>
                      {mill.note && (
                        <span className="eyebrow text-foreground/45 mt-1">{mill.note}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
