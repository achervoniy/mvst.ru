import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import heroImg from "@/assets/ss26-campaign.webp";
import materialsImg from "@/assets/lookbook-2.webp";
import craftImg from "@/assets/lookbook-1.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "О бренде — MVST" },
      {
        name: "description",
        content:
          "Современный дом одежды с производством в Италии. Безупречный крой, благородные материалы, нейтральная палитра — вещи, которые остаются с вами дольше одного сезона.",
      },
      { property: "og:title", content: "О бренде — MVST" },
      {
        property: "og:description",
        content:
          "Архитектура спокойствия: лучшие мануфактуры мира, ручной труд итальянских фабрик и авторская технология La Nuvola.",
      },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: AboutPage,
});

const mills: ReadonlyArray<{ name: string; note: string }> = [
  { name: "Loro Piana", note: "Кашемир, шерсть, шёлк" },
  { name: "Cariaggi", note: "Кашемировая пряжа" },
  { name: "Colombo", note: "Викунья, альпака" },
  { name: "Vitale Barberis Canonico", note: "Шерсть мериноса" },
  { name: "Reda 1865", note: "Костюмные ткани" },
  { name: "Candiani", note: "Деним" },
  { name: "Olmetex", note: "Хлопок и лён" },
];

const figures: ReadonlyArray<{ n: string; l: string }> = [
  { n: "Italy", l: "Страна производства" },
  { n: "6+", l: "Ведущих мануфактур-партнёров" },
  { n: "La Nuvola", l: "Авторская технология" },
  { n: "Premium", l: "Премиальные материалы" },
];

function AboutPage() {
  return (
    <SiteLayout transparentHeader>
      {/* HERO */}
      <section data-hero className="relative h-[72vh] min-h-[520px] md:h-[88vh] md:min-h-[640px] overflow-hidden">
        <img
          src={heroImg}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 size-full object-cover object-[50%_25%] md:object-[50%_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/45" />
        <div className="relative z-10 h-full flex flex-col items-center justify-end pb-16 md:pb-20 px-6 text-center text-cream">
          <div className="eyebrow-lg mb-6 opacity-90">О бренде</div>
          <h1 className="font-serif text-6xl md:text-8xl font-light leading-[1.05]">MVST</h1>
          <p className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed opacity-90">
            Современный дом одежды с производством в Италии. Безупречный крой,
            благородные материалы, нейтральная палитра — вещи, которые остаются
            с вами дольше одного сезона.
          </p>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="px-6 py-14 md:py-32 max-w-3xl mx-auto text-center">
        <div className="eyebrow text-foreground/60 mb-6">Философия</div>
        <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-10">
          Архитектура спокойствия
        </h2>
        <p className="text-foreground/75 leading-relaxed text-lg">
          Хорошая одежда не требует внимания — она его удерживает. MVST строится
          вокруг чистых линий, продуманных силуэтов и материалов, которые с годами
          становятся только лучше. Универсальная палитра, мягкие силуэты, графичные
          жакеты, пальто со спущенным плечом и классические тренчи — основа,
          на которой собирается весь гардероб.
        </p>
      </section>

      {/* MATERIALS */}
      <section className="grid md:grid-cols-2 gap-px bg-foreground/10">
        <img
          src={materialsImg}
          alt=""
          loading="lazy"
          className="w-full h-full aspect-[4/5] object-cover order-2 md:order-1"
        />
        <div className="p-10 md:p-16 flex flex-col justify-center bg-background order-1 md:order-2">
          <div className="eyebrow text-foreground/60 mb-4">Материалы</div>
          <h3 className="font-serif text-3xl md:text-4xl mb-6">Лучшие мануфактуры мира</h3>
          <p className="text-foreground/75 leading-relaxed mb-8">
            Всё начинается с ткани. MVST работает с поставщиками, которые задают
            стандарт индустрии — от кашемира и шёлка Mulberry до шерсти мериноса,
            викуньи и альпаки.
          </p>

          <ul className="divide-y divide-foreground/10 border-y border-foreground/10 mb-8">
            {mills.map((m) => (
              <li
                key={m.name}
                className="flex items-baseline justify-between gap-6 py-3"
              >
                <span className="font-serif text-lg md:text-xl text-foreground">
                  {m.name}
                </span>
                <span className="eyebrow text-foreground/55 text-right">
                  {m.note}
                </span>
              </li>
            ))}
          </ul>

          <p className="text-foreground/75 leading-relaxed">
            Для верхней одежды — испанская овчина, мех, высокотехнологичный нейлон,
            гусиный пух и утеплитель Thermore. Гладкая кожа сочетается с замшей
            и каракульчой, струящийся атлас — с разными видами трикотажа.
          </p>
        </div>
      </section>

      {/* CRAFT */}
      <section className="grid md:grid-cols-2 gap-px bg-foreground/10">
        <div className="p-10 md:p-16 flex flex-col justify-center bg-background order-2 md:order-1">
          <div className="eyebrow text-foreground/60 mb-4">Мастерство</div>
          <h3 className="font-serif text-3xl md:text-4xl mb-6">Сделано в Италии</h3>
          <p className="text-foreground/75 leading-relaxed">
            Каждая коллекция создаётся на ведущих фабриках Италии. Архитектурный
            крой и высокое портновское искусство — то, ради чего бренд работает
            только с проверенными производствами Северной и Центральной Италии.
            Особое внимание — ручным операциям там, где машина не справляется:
            обработке лацканов, посадке плеча, финальной утюжке.
          </p>
        </div>
        <img
          src={craftImg}
          alt=""
          loading="lazy"
          className="w-full h-full aspect-[4/5] object-cover order-1 md:order-2"
        />
      </section>

      {/* LA NUVOLA */}
      <section className="bg-foreground text-background px-6 py-28 md:py-36">
        <div className="max-w-3xl mx-auto text-center">
          <div className="eyebrow text-background/55 mb-8">Технология</div>
          <h3 className="font-serif text-5xl md:text-7xl leading-[1.05] mb-10">
            La&nbsp;Nuvola
          </h3>
          <p className="text-background/80 leading-relaxed text-lg">
            Помимо классической вязки, MVST использует передовую технологию
            «Облако» — кашемир в этой обработке получается невероятно воздушным
            и почти невесомым.
          </p>
        </div>
      </section>

      {/* FIGURES */}
      <section className="px-6 py-28 md:py-32 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6 text-center">
        {figures.map((s) => (
          <div key={s.l} className="flex flex-col items-center">
            <div className="font-serif text-3xl md:text-5xl text-foreground leading-tight">
              {s.n}
            </div>
            <div className="eyebrow text-foreground/60 mt-4 max-w-[14ch]">
              {s.l}
            </div>
          </div>
        ))}
      </section>
    </SiteLayout>
  );
}
