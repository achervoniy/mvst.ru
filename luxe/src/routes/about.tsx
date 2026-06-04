import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { cn } from "@/lib/utils";
import heroImg from "@/assets/lookbook-hero.webp";

// Фото блока «Мастерство» — кадр с показа MVST (см. public/fashion-show/clothing/).
const craftImg = "/fashion-show/clothing/0023_3.jpg";

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

// Материалы — первичная сущность. Мануфактуры — вторичная: раскрываются
// по клику и показываются мелким набором подписей под названием материала.
const materials: ReadonlyArray<{
  name: string;
  description: string;
  mills: ReadonlyArray<{ name: string; note?: string }>;
}> = [
  {
    name: "Кашемир",
    description:
      "Тончайшее монгольское и итальянское волокно. Лёгкость, тепло, способность держать форму годами.",
    mills: [
      { name: "Loro Piana", note: "флагман люкс-волокна" },
      { name: "Cariaggi", note: "пряжа высшей крутки" },
    ],
  },
  {
    name: "Шерсть",
    description:
      "Меринос superfine, костюмные ткани с двойным кручением и плотной диагональной структурой.",
    mills: [
      { name: "Vitale Barberis Canonico", note: "меринос" },
      { name: "Reda 1865", note: "костюмные ткани" },
      { name: "Loro Piana", note: "шерсть с шёлком" },
    ],
  },
  {
    name: "Шёлк",
    description:
      "Mulberry-шёлк глубокого блеска. В подкладках и в основных тканях, где важна благородная тяжесть.",
    mills: [{ name: "Loro Piana" }],
  },
  {
    name: "Викунья и альпака",
    description:
      "Раритетные волокна Анд. Самые мягкие из существующих, лимитированный объём в год.",
    mills: [{ name: "Colombo", note: "историческая мануфактура в Боргосезии" }],
  },
  {
    name: "Лён и хлопок",
    description:
      "Итальянский лён длинного волокна и египетский хлопок Giza. Для летних коллекций и сорочек.",
    mills: [{ name: "Olmetex" }],
  },
  {
    name: "Деним",
    description:
      "Сэлвидж-деним из Италии и Японии. Плотная саржа, природная индиго-окраска, благородный износ.",
    mills: [{ name: "Candiani", note: "родина селвиджа в Европе" }],
  },
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

      {/* EDITORIAL STRIP — между философией и материалами */}
      <section className="relative h-[60vh] min-h-[420px] md:h-[78vh] md:min-h-[600px] overflow-hidden">
        <img
          src="/about/style-editorial.jpg"
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover object-[50%_25%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/35" />
        <div className="relative z-10 h-full flex items-end pb-12 md:pb-16 px-6 md:px-12">
          <p className="font-serif text-xl md:text-2xl text-cream/95 max-w-md leading-snug">
            Стиль начинается с материала.
          </p>
        </div>
      </section>

      {/* MATERIALS */}
      <section className="bg-background">
        <div className="px-6 md:px-12 pt-20 md:pt-28 pb-6 max-w-6xl mx-auto text-center">
          <div className="eyebrow text-foreground/60 mb-4">Материалы</div>
          <h3 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
            Всё начинается с волокна
          </h3>
          <p className="text-foreground/70 leading-relaxed max-w-2xl mx-auto">
            Каждая ткань MVST выбрана за свой характер. Мануфактуры, с которыми
            мы работаем, — следствие этого выбора, а не его причина.
          </p>
        </div>

        <div className="px-6 md:px-12 pb-20 md:pb-28 max-w-6xl mx-auto">
          <MaterialsList />
        </div>

        <div className="border-t hairline px-6 md:px-12 py-14 md:py-16 max-w-3xl mx-auto text-foreground/70 leading-relaxed text-center">
          В верхней одежде — драгоценный мех, испанская овчина, технологичные
          нейлон и утеплитель Thermore. Игру контрастов создают сочетания
          гладкой кожи с фактурной замшей и каракульчой.
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
        {/* Фото с показа — 2:3, чтобы не обрезались голова и стопы.
            object-contain + sand-фон лучше, чем cover-кроп. */}
        <div className="relative aspect-[3/4] md:aspect-[4/5] bg-sand overflow-hidden order-1 md:order-2">
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

            {/* Мобильный текст-описание — всегда видим под заголовком,
                чтобы не прятать суть за раскрытием. */}
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
                <div className="eyebrow text-foreground/45 mb-4">Мануфактуры</div>
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
