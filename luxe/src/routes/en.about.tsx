import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import heroImg from "@/assets/lookbook-hero.webp";
import materialsImg from "@/assets/lookbook-materials.webp";
import craftImg from "@/assets/lookbook-craft.webp";

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

const materials: ReadonlyArray<{ name: string; description: string; mills: string[] }> = [
  {
    name: "Cashmere",
    description:
      "Mongolian and Italian fibres of exceptional fineness. Light, warm, holding shape for years.",
    mills: ["Loro Piana", "Cariaggi"],
  },
  {
    name: "Wool",
    description:
      "Superfine merino, suiting fabrics with double twist and dense diagonal weave.",
    mills: ["Vitale Barberis Canonico", "Reda 1865", "Loro Piana"],
  },
  {
    name: "Silk",
    description: "Mulberry silk with a deep, restrained lustre.",
    mills: ["Loro Piana"],
  },
  {
    name: "Vicuña & alpaca",
    description: "Rare Andean fibres. Among the softest in the world.",
    mills: ["Colombo"],
  },
  {
    name: "Linen & cotton",
    description: "Long-staple Italian linen and Egyptian Giza cotton.",
    mills: ["Olmetex"],
  },
  {
    name: "Denim",
    description: "Selvedge denim from Italy and Japan. Natural indigo, noble wear.",
    mills: ["Candiani"],
  },
];

function EnAboutPage() {
  return (
    <SiteLayout transparentHeader>
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
          <ul className="border-t hairline">
            {materials.map((m) => (
              <li
                key={m.name}
                className="border-b hairline grid md:grid-cols-[1fr_minmax(260px,1.2fr)_auto] items-baseline gap-4 md:gap-10 py-7 md:py-9"
              >
                <span className="font-serif text-3xl md:text-5xl font-light leading-none">
                  {m.name}
                </span>
                <span className="text-foreground/55 text-sm leading-relaxed max-w-md">
                  {m.description}
                </span>
                <span className="eyebrow text-foreground/45 md:text-right">
                  {m.mills.join(" · ")}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative aspect-[16/8] md:aspect-[16/6] overflow-hidden">
          <img
            src={materialsImg}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />
        </div>
      </section>

      <section className="scroll-mt-24 grid md:grid-cols-2 gap-px bg-foreground/10">
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
        <img
          src={craftImg}
          alt=""
          loading="lazy"
          className="w-full h-full aspect-[4/5] object-cover order-1 md:order-2"
        />
      </section>

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

      <section className="scroll-mt-24 px-6 pt-24 pb-20 md:pt-28 md:pb-28 max-w-3xl mx-auto text-center">
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
