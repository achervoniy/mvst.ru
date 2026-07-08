import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import homeHero from "@/assets/home-hero.webp";
import { boutiques } from "./boutiques";

// На главной EN — используем desktop-исходник и на мобиле: блок горизонтальный
// (aspect-video), вертикальный mobile-кадр в нём смотрелся бы слишком крупно.
const SS26_VIDEO =
  "https://st-cdn.tsum.com/static/upload/mvst_desktop_04_26.mov?u=1776854797";

// Кадры с показа — берём из publicного фешн-шоу.
const SS26_LOOKS = [
  "/fashion-show/looks/0274.jpg",
  "/fashion-show/looks/0405.jpg",
  "/fashion-show/looks/0539.jpg",
];

export const Route = createFileRoute("/en/")({
  head: () => ({
    meta: [
      { title: "MVST — Architecture of personal style" },
      {
        name: "description",
        content:
          "MVST — quiet luxury from Russia. Handcrafted in Italy from the finest cashmere, wool, silk, linen and denim.",
      },
      { property: "og:title", content: "MVST — Architecture of personal style" },
      { property: "og:image", content: homeHero },
    ],
  }),
  component: EnHome,
});

function EnHome() {
  return (
    <SiteLayout transparentHeader>
      {/* HERO */}
      <section
        data-hero
        className="relative h-[72vh] min-h-[520px] md:h-[88vh] md:min-h-[640px] overflow-hidden"
      >
        <img
          src={homeHero}
          alt="MVST"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 size-full object-cover object-[50%_16%] md:object-[50%_12%] xl:object-[50%_8%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/35" />
        <div className="relative z-10 h-full flex flex-col items-center justify-end pb-16 md:pb-20 px-6 text-center text-cream">
          <h1 className="font-serif text-5xl md:text-7xl font-light leading-[1.05]">MVST</h1>
          <p className="mt-5 md:mt-6 max-w-md eyebrow-lg leading-snug opacity-90">
            Architecture of personal style
          </p>
        </div>
      </section>

      {/* FASHION SHOW SS26 */}
      <section className="bg-foreground/[0.04] py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 md:px-12 text-center mb-10 md:mb-14">
          <div className="eyebrow text-foreground/60 mb-4">Fashion Show</div>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
            Spring–Summer 2026
          </h2>
          <p className="max-w-2xl mx-auto text-foreground/75 leading-relaxed">
            The runway film of the new collection — light, linen and sea air.
            Italian craftsmanship of the finest MVST mills, captured in motion.
          </p>
        </div>

        <div className="max-w-6xl mx-auto md:px-12">
          <div className="relative aspect-video bg-foreground/10 overflow-hidden">
            <video
              src={SS26_VIDEO}
              poster={homeHero}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-12 mt-3 md:mt-4 grid grid-cols-3 gap-2 md:gap-3">
          {SS26_LOOKS.map((src, i) => (
            <div key={src} className="relative aspect-[2/3] overflow-hidden bg-sand">
              <img
                src={src}
                alt={`Spring–Summer 2026 — look ${i + 1}`}
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="bg-sand/60 py-24 md:py-32 px-6 md:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="eyebrow text-foreground/60 mb-6">Philosophy</div>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-8">
            The art of restraint
          </h2>
          <p className="text-foreground/75 leading-relaxed mb-10">
            A capsule wardrobe for those who choose the very best. Considered cuts,
            noble materials and impeccable craftsmanship from the finest Italian
            ateliers.
          </p>
          <Link
            to="/en/about"
            preload="intent"
            className="eyebrow leading-none border-b border-foreground pb-1 hover:text-accent hover:border-accent"
          >
            About the house
          </Link>
        </div>
      </section>

      {/* BOUTIQUES */}
      <section className="px-6 md:px-16 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="eyebrow text-foreground/60 mb-3">Boutiques</div>
            <h2 className="font-serif text-3xl md:text-4xl">Visit MVST</h2>
          </div>
          <Link
            to="/en/boutiques"
            preload="intent"
            className="hidden md:inline-block eyebrow leading-none border-b border-foreground pb-1 hover:text-accent hover:border-accent"
          >
            All boutiques
          </Link>
        </div>
        <div className="grid gap-x-6 gap-y-10 md:gap-y-6 grid-cols-2 md:grid-cols-3">
          {boutiques.slice(0, 6).map((b) => (
            <Link
              key={b.name}
              to="/en/boutiques"
              hash={b.slug}
              preload="intent"
              className="group block"
            >
              <div className="aspect-[1005/816] overflow-hidden bg-sand">
                <img
                  src={b.img}
                  alt={b.name}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="pt-5">
                <div className="font-serif text-xl">{translateBoutiqueName(b.name)}</div>
                <div className="text-sm text-foreground/65 mt-1">{translateAddress(b.addr)}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

// Простой ad-hoc перевод названий/адресов бутиков. Если их станет больше —
// вынесем в общий словарь, а не размазывать map'ы по компонентам.
export function translateBoutiqueName(ru: string): string {
  const map: Record<string, string> = {
    "ЦУМ": "TSUM",
    "Барвиха Luxury Village": "Barvikha Luxury Village",
    "Третьяковский проезд": "Tretyakovsky Proezd",
    "Radisson Slavyanskaya": "Radisson Slavyanskaya",
    "Кутузовский, 31": "Kutuzovsky, 31",
    "ДЛТ": "DLT",
  };
  return map[ru] ?? ru;
}

export function translateAddress(addr: string): string {
  return addr
    .replace(/^Москва,/i, "Moscow,")
    .replace(/^Санкт-Петербург,/i, "Saint Petersburg,")
    .replace(/ул\./g, "ul.")
    .replace(/пр-кт|просп\./g, "prospekt")
    .replace(/проспект/g, "prospekt")
    .replace(/Петровка/g, "Petrovka")
    .replace(/Рублёво-Успенское шоссе/g, "Rublevo-Uspenskoe shosse")
    .replace(/Третьяковский проезд/g, "Tretyakovsky Proezd")
    .replace(/площадь Европы/g, "Ploshchad Evropy")
    .replace(/Кутузовский/g, "Kutuzovsky")
    .replace(/Большая Конюшенная/g, "Bolshaya Konyushennaya");
}
