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
          "MVST — a contemporary Italian luxury house founded in 2023. Quiet luxury, invited designers of world renown and the finest Italian mills.",
      },
      { property: "og:title", content: "About — MVST" },
      {
        property: "og:description",
        content:
          "MVST Italian luxury house — designers Alessandro Dell’Acqua and Patrick Hellmann, fabrics by Loro Piana, Colombo, Zegna, Piacenza and other world-leading mills.",
      },
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
      "One of the rarest and most precious natural fibres — softness, warmth and lightness. MVST uses cashmere fabrics and knitwear from the leading Italian mills.",
    mills: [
      { name: "Loro Piana", note: "Baby Cashmere®, The Gift of Kings®" },
      { name: "Colombo", note: "cashmere, vicuña, rare fibres" },
      { name: "Piacenza 1733", note: "burdock napping technique" },
    ],
  },
  {
    name: "Wool",
    description:
      "The finest wool fibres — for softness, lightness and the ability to hold a comfortable microclimate. Superfine merino, alpaca, vicuña.",
    mills: [
      { name: "Zegna", note: "merino, cashmere, vicuña, mohair" },
      { name: "Loro Piana", note: "wool with silk" },
    ],
  },
  {
    name: "Silk",
    description:
      "Silks, jacquards and decorative fabrics with noble lustre, depth of colour and expressive texture — from Italy’s historic textile houses.",
    mills: [
      { name: "Gentili Mosconi", note: "fil coupé, embroidery, Como region" },
      { name: "Serica 1870", note: "supplier to the Vatican" },
      { name: "Centro Seta", note: "blended silks, Como region" },
    ],
  },
  {
    name: "Leather",
    description:
      "A key material of the house. Rare exotic hides and the finest examples of traditional tannery craft — Porosus, python, deerskin, Nappa, Plongé, Baby Calf, suede and perforated suede.",
    mills: [
      { name: "Porosus" },
      { name: "Baby Calf" },
      { name: "Nappa · Plongé" },
    ],
  },
  {
    name: "Fur",
    description:
      "Carefully selected furs. Sable holds a special place — MVST sources pelts at the auctions of Soyuzpushnina, the world’s largest auction house for wild sable.",
    mills: [
      { name: "Sable" },
      { name: "Mink · Swakara · Chinchilla" },
      { name: "Lynx · Mongolian shearling" },
    ],
  },
  {
    name: "Technical fabrics",
    description:
      "For outerwear — high-tech fabrics: waterproof, windproof, laminated, elastic. Leadership in the field since the 1950s.",
    mills: [{ name: "Olmetex", note: "family mill, Como region" }],
  },
  {
    name: "Jersey & knits",
    description:
      "Jersey, interlock, jacquard and complex constructions — softness, comfort and a flawless drape. Italian mill within the Ermenegildo Zegna group.",
    mills: [{ name: "Gruppo Dondi (Dondi Jersey)" }],
  },
];

const facts: ReadonlyArray<{ label: string; value: string }> = [
  { label: "Founded", value: "2023" },
  { label: "Country of production", value: "Italy" },
  { label: "Mill partners", value: "10+" },
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
          <div className="eyebrow-lg mb-6 opacity-90">About the house · Est. 2023</div>
          <h1 className="font-serif text-6xl md:text-8xl font-light leading-[1.05]">MVST</h1>
          <p className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed opacity-90">
            A contemporary Italian luxury house. A philosophy of confident,
            restrained and intelligent approach to luxury.
          </p>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="px-6 py-14 md:py-32 max-w-3xl mx-auto text-center">
        <div className="eyebrow text-foreground/60 mb-6">Philosophy</div>
        <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-10">
          Luxury as sensation
        </h2>
        <p className="text-foreground/75 leading-relaxed text-lg">
          For MVST, luxury is not display but flawless quality felt in the
          details — the softness of cashmere, the precision of the silhouette,
          the depth of colour and the natural elegance of the materials.
        </p>
        <p className="mt-6 text-foreground/70 leading-relaxed">
          MVST creates clothing for the client who values impeccable quality,
          tactile pleasure and pieces that remain relevant beyond time.
        </p>
      </section>

      {/* DNA */}
      <section className="bg-foreground/[0.04]">
        <div className="px-6 md:px-12 py-20 md:py-28 max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="eyebrow text-foreground/60 mb-4">Brand DNA</div>
            <h3 className="font-serif text-4xl md:text-5xl leading-tight">
              The aesthetic of quiet confidence
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-10 md:gap-14">
            <DnaCard
              title="Material and fit"
              text="The leading roles belong to fibre quality, an impeccable fit and an expressive silhouette. Value reveals itself through sensation — softness of cashmere, depth of colour, purity of line."
            />
            <DnaCard
              title="Pieces beyond time"
              text="MVST builds collections around natural materials, noble textures and intelligent design — a modern luxury wardrobe with no room for passing trends."
            />
            <DnaCard
              title="Natural elegance"
              text="Quiet confidence and intelligent elegance without display. Clothing for the client who values quality, comfort and restrained refinement."
            />
          </div>
        </div>
      </section>

      {/* EDITORIAL STRIP */}
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

      {/* DESIGNERS */}
      <section className="px-6 md:px-12 py-20 md:py-28 max-w-5xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <div className="eyebrow text-foreground/60 mb-4">Designers</div>
          <h3 className="font-serif text-4xl md:text-5xl leading-tight">
            Invited authors
          </h3>
          <p className="mt-6 text-foreground/70 leading-relaxed max-w-2xl mx-auto">
            MVST develops its collections with invited international designers
            and creative teams whose careers were shaped alongside the
            leading luxury houses of the world.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 border-t hairline pt-12 md:pt-16">
          <div>
            <div className="eyebrow text-foreground/55 mb-3">Women’s line</div>
            <h4 className="font-serif text-3xl md:text-4xl leading-tight mb-6">
              Alessandro Dell’Acqua
            </h4>
            <p className="text-foreground/75 leading-relaxed">
              A designer of international reputation. His portfolio includes
              work with Giorgio Armani and Dolce&nbsp;&&nbsp;Gabbana, and his
              own brand N°21, recognised on the world stage. He shapes the
              women’s direction of MVST.
            </p>
          </div>
          <div>
            <div className="eyebrow text-foreground/55 mb-3">At the origins</div>
            <h4 className="font-serif text-3xl md:text-4xl leading-tight mb-6">
              Patrick Hellmann
            </h4>
            <p className="text-foreground/75 leading-relaxed">
              A significant contribution to the founding and development of the
              house — Patrick Hellmann took part in creating the first MVST
              collections.
            </p>
          </div>
        </div>
      </section>

      {/* LINES */}
      <section className="bg-foreground/[0.04]">
        <div className="px-6 md:px-12 py-20 md:py-28 max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="eyebrow text-foreground/60 mb-4">Lines</div>
            <h3 className="font-serif text-4xl md:text-5xl leading-tight">
              Women’s and men’s aesthetics
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <LineBlock
              title="Women"
              intro="Soft elegance, a fluid silhouette and noble simplicity — quiet confidence and the feeling of natural luxury."
              points={[
                "Pastel and natural palette",
                "Fluid fabrics",
                "Relaxed silhouettes",
                "Minimalism without coldness",
              ]}
            />
            <LineBlock
              title="Men"
              intro="Modern classics, comfort and architectural precision of silhouette — a luxury wardrobe for those who value restrained refinement."
              points={[
                "Modern soft tailoring",
                "Noble textures",
                "Layering",
                "Functional elegance",
              ]}
            />
          </div>
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
            Every MVST fabric is chosen for its character. The mills we work
            with are a consequence of that choice — not its cause.
          </p>
        </div>

        <div className="px-6 md:px-12 pb-20 md:pb-28 max-w-6xl mx-auto">
          <MaterialsList />
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
            Collections are produced in Italian ateliers using fabrics and
            materials from the world’s leading textile houses —
            Loro&nbsp;Piana, Colombo, Zegna, Piacenza, Gentili&nbsp;Mosconi and
            others. Each piece is made with attention to fibre quality, drape
            and comfort in wear.
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

      {/* CLOSING */}
      <section
        id="sustainability"
        className="scroll-mt-24 px-6 pt-4 pb-20 md:pt-8 md:pb-28 max-w-3xl mx-auto text-center"
      >
        <div className="eyebrow text-foreground/60 mb-6">In a word</div>
        <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-8">
          Luxury in a contemporary key
        </h2>
        <p className="text-foreground/75 leading-relaxed text-lg">
          MVST makes clothing for the client who values quality, comfort and
          intelligent elegance beyond time. Quiet luxury, natural materials,
          pieces that remain relevant season after season.
        </p>
      </section>
    </SiteLayout>
  );
}

function DnaCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-t hairline pt-6">
      <div className="font-serif text-xl md:text-2xl mb-3 leading-tight">{title}</div>
      <p className="text-foreground/70 leading-relaxed text-sm md:text-base">{text}</p>
    </div>
  );
}

function LineBlock({
  title,
  intro,
  points,
}: {
  title: string;
  intro: string;
  points: ReadonlyArray<string>;
}) {
  return (
    <div className="border-t hairline pt-8">
      <div className="eyebrow text-foreground/55 mb-3">{title}</div>
      <p className="font-serif text-2xl md:text-3xl leading-tight mb-6">{intro}</p>
      <ul className="space-y-2 text-foreground/75">
        {points.map((p) => (
          <li key={p} className="flex items-baseline gap-3">
            <span className="text-foreground/40" aria-hidden>
              ·
            </span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
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
