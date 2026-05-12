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
          "Идеальный капсульный гардероб для тех, кто выбирает лучшее. Лаконичный крой, благородные материалы и безупречное исполнение MVST.",
      },
      { property: "og:title", content: "О бренде — MVST" },
      {
        property: "og:description",
        content:
          "Архитектура личного стиля: лучшие мануфактуры мира, ручной труд итальянских фабрик и авторская технология La Nuvola.",
      },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: AboutPage,
});

const mills: ReadonlyArray<{ name: string; note: string }> = [
  { name: "Loro Piana", note: "Кашемир, шерсть, шелк" },
  { name: "Cariaggi", note: "Кашемировая пряжа" },
  { name: "Colombo", note: "Викунья, альпака" },
  { name: "Vitale Barberis Canonico", note: "Шерсть мериноса" },
  { name: "Reda 1865", note: "Костюмные ткани" },
  { name: "Candiani", note: "Деним" },
  { name: "Olmetex", note: "Хлопок и лен" },
];

const facts: ReadonlyArray<{ label: string; value: string }> = [
  { label: "Страна производства", value: "Италия" },
  { label: "Ведущих мануфактур-партнеров", value: "6+" },
  { label: "Авторская технология", value: "La Nuvola" },
  { label: "Исключительное качество", value: "Роскошные материалы" },
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
            Идеальный капсульный гардероб для тех, кто выбирает лучшее.
          </p>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="px-6 py-14 md:py-32 max-w-3xl mx-auto text-center">
        <div className="eyebrow text-foreground/60 mb-6">Философия</div>
        <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-10">
          Архитектура личного стиля
        </h2>
        <p className="text-foreground/75 leading-relaxed text-lg">
          Исключительность в каждой детали. Лаконичный крой, благородные материалы,
          сдержанная палитра и безупречное исполнение для тех, чьи стандарты
          не знают компромиссов.
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
            Все начинается с ткани. MVST сотрудничает с поставщиками, задающими
            стандарты индустрии: от благородных кашемира и шелка Mulberry до
            раритетной шерсти мериноса, викуньи и альпаки.
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
            В верхней одежде — драгоценный мех, испанская овчина, технологичные
            нейлон и утеплитель Thermore. Игру контрастов создают сочетания
            гладкой кожи с фактурной замшей и каракульчой.
          </p>
        </div>
      </section>

      {/* CRAFT */}
      <section id="craft" className="scroll-mt-24 grid md:grid-cols-2 gap-px bg-foreground/10">
        <div className="p-10 md:p-16 flex flex-col justify-center bg-background order-2 md:order-1">
          <div className="eyebrow text-foreground/60 mb-4">Мастерство</div>
          <h3 className="font-serif text-3xl md:text-4xl mb-6">Сделано в Италии</h3>
          <p className="text-foreground/75 leading-relaxed">
            MVST доверяет производство коллекций старейшим итальянским фабрикам.
            Наследие портновского мастерства проявляется в деталях, требующих
            ручного труда: филигранной обработке лацканов, идеальной линии плеча
            и бережной финальной отделке, придающей вещи ее характер.
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
          <div className="eyebrow text-background/55 mb-8">Технологии</div>
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

      {/* FACTS */}
      <section className="px-6 pt-24 md:pt-28 pb-12 md:pb-16 max-w-3xl mx-auto">
        <ul className="divide-y divide-foreground/10 border-y border-foreground/10">
          {facts.map((f) => (
            <li
              key={f.label}
              className="flex items-center justify-between gap-6 py-5 md:py-6"
            >
              <span className="eyebrow text-foreground/55 max-w-[18ch]">{f.label}</span>
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
        <div className="eyebrow text-foreground/60 mb-6">Устойчивое развитие</div>
        <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-8">
          Рациональный гардероб
        </h2>
        <p className="text-foreground/75 leading-relaxed text-lg">
          MVST создает коллекции, которые не конкурируют, а дополняют и продолжают
          друг друга. Безупречная сочетаемость новых моделей с вещами прошлых
          сезонов и качество материалов и исполнения обеспечивают вашему гардеробу
          долголетие, делая моду осознанным выбором.
        </p>
      </section>
    </SiteLayout>
  );
}
