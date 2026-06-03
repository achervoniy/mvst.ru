import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import heroImg from "@/assets/lookbook-hero.webp";

export const Route = createFileRoute("/fashion-show")({
  head: () => ({
    meta: [
      { title: "Fashion Show — MVST" },
      {
        name: "description",
        content:
          "Fashion Show MVST — записи показов новых коллекций, журналы, кадры и видео с подиума.",
      },
      { property: "og:title", content: "Fashion Show — MVST" },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: FashionShowPage,
});

// Медиа лежат в public/fashion-show/ — каталог нужно создать руками и
// положить туда исходные .mov / .mp4 / .jpg / .pdf файлы.
const VIDEO_HERO = "/fashion-show/show-hero.mp4"; // основная заставка показа
const VIDEO_HIGHLIGHTS = "/fashion-show/show-highlights.mp4"; // ролик с показа

// Фото с показа. Имена-плейсхолдеры — замени файлы один к одному.
const photosWomen = [
  "/fashion-show/photo-women-01.jpg",
  "/fashion-show/photo-women-02.jpg",
  "/fashion-show/photo-women-03.jpg",
  "/fashion-show/photo-women-04.jpg",
];
const photosMen = [
  "/fashion-show/photo-men-01.jpg",
  "/fashion-show/photo-men-02.jpg",
  "/fashion-show/photo-men-03.jpg",
  "/fashion-show/photo-men-04.jpg",
];
const photosBackstage = [
  "/fashion-show/photo-backstage-01.jpg",
  "/fashion-show/photo-backstage-02.jpg",
  "/fashion-show/photo-backstage-03.jpg",
];

const magazines: ReadonlyArray<{ title: string; subtitle: string; file: string }> = [
  {
    title: "MVST FW 25–26",
    subtitle: "Журнал коллекции «Осень-зима 2025–2026»",
    file: "/fashion-show/mvst-fw-25-26.pdf",
  },
  {
    title: "Fashion Show MVST",
    subtitle: "Каталог-журнал показа",
    file: "/fashion-show/fashion-show-mvst.pdf",
  },
  {
    title: "Fashion Show MVST · 4",
    subtitle: "Архив показов — выпуск 4",
    file: "/fashion-show/fashion-show-mvst-4.pdf",
  },
];

function FashionShowPage() {
  return (
    <SiteLayout transparentHeader>
      {/* HERO с видео-плейсхолдером и фолбэком на постер */}
      <section
        data-hero
        className="relative h-[78vh] min-h-[560px] md:h-[90vh] md:min-h-[680px] overflow-hidden bg-foreground"
      >
        <video
          src={VIDEO_HERO}
          poster={heroImg}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 size-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/55" />
        <div className="relative z-10 h-full flex flex-col items-center justify-end pb-20 px-6 text-center text-cream">
          <div className="eyebrow-lg mb-6 opacity-90">Fashion Show</div>
          <h1 className="font-serif text-5xl md:text-7xl font-light leading-[1.05]">
            Подиум MVST
          </h1>
          <p className="mt-8 max-w-xl text-base md:text-lg leading-relaxed opacity-90">
            Хроника показов новых коллекций — видео с подиума, кадры из закулисья
            и журналы, которые мы выпускаем к каждому сезону.
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="px-6 py-20 md:py-28 max-w-3xl mx-auto text-center">
        <div className="eyebrow text-foreground/60 mb-6">О показе</div>
        <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-8">
          Сезон в одном вечере
        </h2>
        <p className="text-foreground/75 leading-relaxed text-lg">
          Показ — это собственная драматургия коллекции. Свет, музыка и движение
          модели превращают тихий люкс в подиумный жест. Здесь собраны видео,
          лучшие кадры и журналы прошедших показов MVST.
        </p>
      </section>

      {/* VIDEO MAIN */}
      <section className="bg-foreground/[0.04] py-10 md:py-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="eyebrow text-foreground/60 mb-4 md:mb-6 text-center">Запись показа</div>
          <div className="relative aspect-video bg-foreground/10 overflow-hidden">
            <video
              src={VIDEO_HIGHLIGHTS}
              poster={heroImg}
              controls
              playsInline
              preload="metadata"
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* WOMEN */}
      <section className="px-6 md:px-12 py-20 md:py-28 max-w-7xl mx-auto">
        <div className="flex items-baseline justify-between mb-10 md:mb-14">
          <div>
            <div className="eyebrow text-foreground/60 mb-3">Образы для нее</div>
            <h3 className="font-serif text-3xl md:text-4xl">Подиум, женская линия</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {photosWomen.map((src, i) => (
            <PhotoTile key={src} src={src} alt={`Образ ${i + 1}`} />
          ))}
        </div>
      </section>

      {/* MEN */}
      <section className="bg-foreground/[0.04]">
        <div className="px-6 md:px-12 py-20 md:py-28 max-w-7xl mx-auto">
          <div className="flex items-baseline justify-between mb-10 md:mb-14">
            <div>
              <div className="eyebrow text-foreground/60 mb-3">Образы для него</div>
              <h3 className="font-serif text-3xl md:text-4xl">Подиум, мужская линия</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {photosMen.map((src, i) => (
              <PhotoTile key={src} src={src} alt={`Образ ${i + 1}`} />
            ))}
          </div>
        </div>
      </section>

      {/* PULL QUOTE */}
      <section className="px-6 py-24 md:py-32 max-w-3xl mx-auto text-center">
        <p className="font-serif text-3xl md:text-4xl leading-[1.3] text-foreground/85">
          «Подиум — это коллекция, услышанная вслух».
        </p>
      </section>

      {/* BACKSTAGE */}
      <section className="px-6 md:px-12 pb-20 md:pb-28 max-w-7xl mx-auto">
        <div className="flex items-baseline justify-between mb-10 md:mb-14">
          <div>
            <div className="eyebrow text-foreground/60 mb-3">Закулисье</div>
            <h3 className="font-serif text-3xl md:text-4xl">До выхода на подиум</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {photosBackstage.map((src, i) => (
            <PhotoTile key={src} src={src} alt={`Кадр закулисья ${i + 1}`} ratio="aspect-[4/5]" />
          ))}
        </div>
      </section>

      {/* MAGAZINES */}
      <section className="bg-foreground text-background px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="eyebrow text-background/55 mb-4">Журналы</div>
            <h3 className="font-serif text-4xl md:text-5xl leading-tight">
              Скачать выпуски
            </h3>
            <p className="mt-6 text-background/70 max-w-xl mx-auto leading-relaxed">
              К каждому показу MVST выпускает журнал с лукбуком, интервью и
              кадрами с подиума.
            </p>
          </div>
          <ul className="grid gap-3 md:gap-4 md:grid-cols-3">
            {magazines.map((m) => (
              <li key={m.file}>
                <a
                  href={m.file}
                  download
                  className="group block h-full p-7 md:p-8 border border-background/20 hover:border-background/60 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-serif text-2xl mb-2 leading-tight">{m.title}</div>
                      <div className="eyebrow text-background/55">{m.subtitle}</div>
                    </div>
                    <Download
                      className="size-5 shrink-0 text-background/55 group-hover:text-background transition-colors"
                      strokeWidth={1.25}
                    />
                  </div>
                  <div className="mt-8 text-xs uppercase tracking-[0.18em] text-background/55 group-hover:text-background transition-colors">
                    PDF · скачать
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}

function PhotoTile({
  src,
  alt,
  ratio = "aspect-[3/4]",
}: {
  src: string;
  alt: string;
  ratio?: string;
}) {
  return (
    <div className={`relative ${ratio} overflow-hidden bg-sand`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 size-full object-cover"
        onError={(e) => {
          // Если файл-плейсхолдер ещё не подложен — показываем мягкий
          // песочный фон вместо «битой картинки».
          (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
        }}
      />
    </div>
  );
}
