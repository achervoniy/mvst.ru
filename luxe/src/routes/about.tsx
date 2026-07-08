import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { cn } from "@/lib/utils";
import heroImg from "@/assets/lookbook-hero.webp";

// Editorial-фото и фото мастерства — кадры с показа, лежат в luxe/public/
// (gitignored). Нужно положить руками на прод-сервер в ту же структуру.
const editorialImg = "/about/style-editorial.jpg";
const craftImg = "/fashion-show/clothing/0023_3.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "О бренде — MVST" },
      {
        name: "description",
        content:
          "MVST — итальянский современный бренд сегмента luxury, основанный в 2023 году. Философия сдержанной роскоши, приглашённые дизайнеры мирового уровня и материалы ведущих итальянских мануфактур.",
      },
      { property: "og:title", content: "О бренде — MVST" },
      {
        property: "og:description",
        content:
          "Итальянский люкс-бренд MVST: приглашённые дизайнеры Алессандро Дель Аква и Патрик Хельманн, ткани Loro Piana, Colombo, Zegna, Piacenza и других мировых мануфактур.",
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
      "Одно из самых редких и ценных природных волокон — непревзойдённая мягкость, тепло и лёгкость. MVST использует различные виды кашемировых тканей и трикотажа ведущих итальянских мануфактур.",
    mills: [
      { name: "Loro Piana", note: "Baby Cashmere®, The Gift of Kings®" },
      { name: "Colombo", note: "кашемир, викунья, редкие волокна" },
      { name: "Piacenza 1733", note: "техника начёса с репейником" },
    ],
  },
  {
    name: "Шерсть",
    description:
      "Тончайшие шерстяные волокна — за мягкость, лёгкость и способность держать комфортный микроклимат. Меринос superfine, альпака, викунья.",
    mills: [
      { name: "Zegna", note: "меринос, кашемир, викунья, мохер" },
      { name: "Loro Piana", note: "шерсть с шёлком" },
    ],
  },
  {
    name: "Шёлк",
    description:
      "Шелка, жаккарды и декоративные ткани с благородным блеском, глубиной цвета и выразительной фактурой — от исторических текстильных домов Италии.",
    mills: [
      { name: "Gentili Mosconi", note: "fil coupé, вышивки, регион Комо" },
      { name: "Serica 1870", note: "поставщик тканей для Ватикана" },
      { name: "Centro Seta", note: "смесовые шелка, регион Комо" },
    ],
  },
  {
    name: "Кожа",
    description:
      "Ключевой материал бренда. Редкие экзотические кожи и лучшие образцы традиционного кожевенного мастерства — Porosus, кожа питона, оленья кожа, Nappa, Plongé, Baby Calf, замша и перфорированная замша.",
    mills: [
      { name: "Porosus" },
      { name: "Baby Calf" },
      { name: "Nappa · Plongé" },
    ],
  },
  {
    name: "Мех",
    description:
      "Тщательно отобранные виды меха. Особое место занимает соболь — MVST закупает шкурки на аукционах «Союзпушнины», крупнейшего мирового аукционного дома промыслового соболя.",
    mills: [
      { name: "Соболь" },
      { name: "Норка · Свакара · Шиншилла" },
      { name: "Рысь · Монгольская овчина" },
    ],
  },
  {
    name: "Технические ткани",
    description:
      "Для верхней одежды — высокотехнологичные ткани: водонепроницаемые, непродуваемые, ламинированные, эластичные. Лидерство в разработке начиная с 1950-х.",
    mills: [{ name: "Olmetex", note: "семейная мануфактура, регион Комо" }],
  },
  {
    name: "Трикотаж",
    description:
      "Джерси, интерлоки, жаккарды и сложные конструкции — мягкость, комфорт и безупречная посадка. Итальянская мануфактура в составе Ermenegildo Zegna.",
    mills: [{ name: "Gruppo Dondi (Dondi Jersey)" }],
  },
];

const facts: ReadonlyArray<{ label: string; value: string }> = [
  { label: "Основание бренда", value: "2023" },
  { label: "Страна производства", value: "Италия" },
  { label: "Мануфактур-партнёров", value: "10+" },
  { label: "Стандарт исполнения", value: "Тихая роскошь" },
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
          <div className="eyebrow-lg mb-6 opacity-90">О бренде · с 2023</div>
          <h1 className="font-serif text-6xl md:text-8xl font-light leading-[1.05]">MVST</h1>
          <p className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed opacity-90">
            Итальянский современный бренд сегмента luxury. Философия
            уверенного, сдержанного и интеллектуального подхода к роскоши.
          </p>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="px-6 py-14 md:py-32 max-w-3xl mx-auto text-center">
        <div className="eyebrow text-foreground/60 mb-6">Философия</div>
        <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-10">
          Роскошь как ощущение
        </h2>
        <p className="text-foreground/75 leading-relaxed text-lg">
          Для MVST роскошь — это не демонстративность, а безупречное качество,
          которое ощущается в деталях: в мягкости кашемира, точности силуэта,
          глубине оттенков и естественной элегантности материалов.
        </p>
        <p className="mt-6 text-foreground/70 leading-relaxed">
          Бренд создаёт одежду для клиента, который ценит безупречное качество,
          тактильные ощущения и вещи, остающиеся актуальными вне времени.
        </p>
      </section>

      {/* DNA — 3 колонки */}
      <section className="bg-foreground/[0.04]">
        <div className="px-6 md:px-12 py-20 md:py-28 max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="eyebrow text-foreground/60 mb-4">ДНК бренда</div>
            <h3 className="font-serif text-4xl md:text-5xl leading-tight">
              Эстетика тихой уверенности
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-10 md:gap-14">
            <DnaCard
              title="Материал и посадка"
              text="Главную роль играют качество волокна, безупречная посадка и выразительный силуэт. Ценность раскрывается через ощущения — мягкость кашемира, глубину оттенков, чистоту линий."
            />
            <DnaCard
              title="Изделия вне времени"
              text="MVST строит коллекции вокруг натуральных материалов, благородных фактур и интеллектуального дизайна — современный люкс-гардероб, где нет места случайным трендам."
            />
            <DnaCard
              title="Естественная элегантность"
              text="Спокойная уверенность и интеллектуальная элегантность без демонстративности. Одежда для клиента, который ценит качество, комфорт и сдержанную утончённость."
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
            Стиль начинается с материала.
          </p>
        </div>
      </section>

      {/* DESIGNERS */}
      <section className="px-6 md:px-12 py-20 md:py-28 max-w-5xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <div className="eyebrow text-foreground/60 mb-4">Дизайнеры</div>
          <h3 className="font-serif text-4xl md:text-5xl leading-tight">
            Приглашённые авторы
          </h3>
          <p className="mt-6 text-foreground/70 leading-relaxed max-w-2xl mx-auto">
            Для разработки коллекций MVST сотрудничает с международными
            дизайнерами и креативными командами, обладающими многолетним
            опытом работы с ведущими мировыми luxury-брендами.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 border-t hairline pt-12 md:pt-16">
          <div>
            <div className="eyebrow text-foreground/55 mb-3">Женская линия</div>
            <h4 className="font-serif text-3xl md:text-4xl leading-tight mb-6">
              Алессандро Дель Аква
            </h4>
            <p className="text-foreground/75 leading-relaxed">
              Дизайнер с международной репутацией. В портфолио — работа с
              Giorgio Armani и Dolce&nbsp;&&nbsp;Gabbana, а также собственный
              бренд N°21, признанный на мировой модной сцене. Формирует женское
              направление MVST.
            </p>
          </div>
          <div>
            <div className="eyebrow text-foreground/55 mb-3">У истоков</div>
            <h4 className="font-serif text-3xl md:text-4xl leading-tight mb-6">
              Патрик Хельманн
            </h4>
            <p className="text-foreground/75 leading-relaxed">
              Внёс существенный вклад в становление и развитие бренда,
              принимал участие в создании первых коллекций MVST.
            </p>
          </div>
        </div>
      </section>

      {/* LINES — М/Ж */}
      <section className="bg-foreground/[0.04]">
        <div className="px-6 md:px-12 py-20 md:py-28 max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="eyebrow text-foreground/60 mb-4">Линии</div>
            <h3 className="font-serif text-4xl md:text-5xl leading-tight">
              Женская и мужская эстетика
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <LineBlock
              title="Женская линия"
              intro="Мягкая элегантность, свободный силуэт и благородная простота — спокойная уверенность и ощущение естественной роскоши."
              points={[
                "Пастельная и природная палитра",
                "Флюидные ткани",
                "Расслабленные силуэты",
                "Минимализм без холодности",
              ]}
            />
            <LineBlock
              title="Мужская линия"
              intro="Современная классика, комфорт и архитектурная точность силуэта — люкс-гардероб для клиента, который ценит сдержанную утончённость."
              points={[
                "Современная мягкая классика",
                "Благородные фактуры",
                "Многослойность",
                "Функциональная элегантность",
              ]}
            />
          </div>
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
      </section>

      {/* CRAFT — Сделано в Италии */}
      <section id="craft" className="scroll-mt-24 grid md:grid-cols-2 gap-px bg-foreground/10">
        <div className="p-10 md:p-16 flex flex-col justify-center bg-background order-2 md:order-1">
          <div className="eyebrow text-foreground/60 mb-4">Мастерство</div>
          <h3 className="font-serif text-3xl md:text-4xl mb-6">Сделано в Италии</h3>
          <p className="text-foreground/75 leading-relaxed">
            Коллекции бренда производятся на итальянских фабриках с
            использованием тканей и материалов ведущих текстильных домов —
            Loro&nbsp;Piana, Colombo, Zegna, Piacenza, Gentili&nbsp;Mosconi
            и других. Каждое изделие создаётся с вниманием к качеству
            волокна, пластике ткани и комфорту в носке.
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
        <div className="eyebrow text-foreground/60 mb-6">Резюме</div>
        <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-8">
          Роскошь в современной интерпретации
        </h2>
        <p className="text-foreground/75 leading-relaxed text-lg">
          MVST создаёт одежду для клиента, который ценит качество, комфорт
          и интеллектуальную элегантность вне времени. Тихая роскошь,
          натуральные материалы, изделия, которые остаются актуальными
          сезон за сезоном.
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

            {/* Мобильный текст-описание — всегда видим под заголовком */}
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
