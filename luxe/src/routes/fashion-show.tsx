import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { cn } from "@/lib/utils";
import heroImg from "@/assets/lookbook-hero.webp";

export const Route = createFileRoute("/fashion-show")({
  head: () => ({
    meta: [
      { title: "Fashion Show — MVST" },
      {
        name: "description",
        content:
          "Fashion Show MVST — записи показов, кадры с подиума, закулисье и журналы коллекций.",
      },
      { property: "og:title", content: "Fashion Show — MVST" },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: FashionShowPage,
});

// Видео — с CDN ЦУМа: разные исходники для desktop и mobile.
const VIDEO_DESKTOP =
  "https://st-cdn.tsum.com/static/upload/mvst_desktop_04_26.mov?u=1776854797";
const VIDEO_MOBILE =
  "https://st-cdn.tsum.com/static/upload/mvst_mobile_04_26.mov?u=1776854797";

// Forbes — editorial-серия с показа. Делим на «подиум кадр за кадром» (8)
// и «ещё кадры» (9). Двух Forbes не хватает на 9 — добавляем 2 детали из clothing.
const podiumPhotos = [
  "/fashion-show/forbes/0001.jpg",
  "/fashion-show/forbes/0007.jpg",
  "/fashion-show/forbes/0021.jpg",
  "/fashion-show/forbes/0027.jpg",
  "/fashion-show/forbes/0028.jpg",
  "/fashion-show/forbes/0045.jpg",
  "/fashion-show/forbes/0026.jpg",
  "/fashion-show/forbes/0822.jpg",
];

// 50 образов, равномерно разбросаны по всему показу (351 кадр).
const fullLooks = [
  "0274", "0279", "0286", "0311", "0317", "0319", "0328", "0330", "0341", "0344",
  "0354", "0358", "0362", "0369", "0371", "0383", "0393", "0398", "0403", "0405",
  "0416", "0418", "0420", "0423", "0444", "0451", "0452", "0457", "0476", "0482",
  "0486", "0492", "0510", "0514", "0515", "0517", "0519", "0525", "0526", "0537",
  "0539", "0550", "0553", "0557", "0575", "0582", "0589", "0593", "0597", "0612",
].map((n) => `/fashion-show/looks/${n}.jpg`);

const magazines: ReadonlyArray<{ title: string; subtitle: string; file: string }> = [
  {
    title: "FASHION SHOW ВЕСНА-ЛЕТО 2026",
    subtitle: "Журнал показа",
    file: "/fashion-show/fashion-show-mvst.pdf",
  },
  {
    title: "FW 25–26",
    subtitle: "Осень-зима 2025–2026",
    file: "/fashion-show/fashion-show-mvst-4.pdf",
  },
];

function FashionShowPage() {
  return (
    <SiteLayout transparentHeader>
      {/* HERO */}
      <section
        data-hero
        className="relative h-[78vh] min-h-[560px] md:h-[90vh] md:min-h-[680px] overflow-hidden bg-foreground"
      >
        {/* Десктоп- и мобильная версии — два отдельных видео,
            переключаются классом без JS, autoplay-muted-loop у обоих. */}
        <video
          src={VIDEO_DESKTOP}
          poster={heroImg}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="hidden md:block absolute inset-0 size-full object-cover opacity-90"
        />
        <video
          src={VIDEO_MOBILE}
          poster={heroImg}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="md:hidden absolute inset-0 size-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/55" />
        <div className="relative z-10 h-full flex flex-col items-center justify-end pb-20 px-6 text-center text-cream">
          <div className="eyebrow-lg mb-6 opacity-90">Fashion Show</div>
          <h1 className="font-serif text-5xl md:text-7xl font-light leading-[1.05]">
            Подиум MVST
          </h1>
          <p className="mt-8 max-w-xl text-base md:text-lg leading-relaxed opacity-90">
            Хроника показов новых коллекций — видео с подиума, кадры
            из закулисья и журналы, которые мы выпускаем к каждому сезону.
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
          Показ — это собственная драматургия коллекции. Свет, музыка
          и движение модели превращают тихий люкс в подиумный жест.
          Здесь — видео, лучшие кадры и журналы прошедших показов MVST.
        </p>
      </section>

      {/* VIDEO MAIN */}
      <section className="bg-foreground/[0.04] py-10 md:py-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="eyebrow text-foreground/60 mb-4 md:mb-6 text-center">
            Запись показа
          </div>
          <div className="relative aspect-video bg-foreground/10 overflow-hidden">
            {/* Используем desktop-видео и на мобиле — у нас тут горизонтальный кадр,
                мобильный вертикальный исходник в этом блоке смотрится плохо. */}
            <video
              poster={heroImg}
              autoPlay
              muted
              loop
              controls
              playsInline
              preload="metadata"
              className="absolute inset-0 size-full object-cover"
              src={VIDEO_DESKTOP}
            />
          </div>
        </div>
      </section>

      {/* FULL LOOKS — интерактивная галерея */}
      <section className="py-20 md:py-28">
        <div className="px-6 md:px-12 max-w-7xl mx-auto text-center mb-12 md:mb-16">
          <h3 className="font-serif text-3xl md:text-5xl leading-tight">Образы</h3>
        </div>

        {/* На мобиле — без боковых отступов, кадр на всю ширину.
            На десктопе — в общий контейнер. */}
        <div className="md:px-12 md:max-w-7xl md:mx-auto">
          <LooksGallery images={fullLooks} />
        </div>
      </section>

      {/* PULL QUOTE */}
      <section className="bg-foreground/[0.04]">
        <div className="px-6 py-24 md:py-32 max-w-3xl mx-auto text-center">
          <p className="font-serif text-3xl md:text-4xl leading-[1.3] text-foreground/85">
            «Подиум — это коллекция, услышанная вслух».
          </p>
        </div>
      </section>

      {/* PODIUM — main editorial grid */}
      <section className="px-6 md:px-12 py-20 md:py-28 max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <div className="eyebrow text-foreground/60 mb-3">Editorial</div>
          <h3 className="font-serif text-3xl md:text-5xl leading-tight">
            Подиум, кадр за кадром
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {podiumPhotos.map((src, i) => (
            <PhotoTile key={src} src={src} alt={`Подиум — кадр ${i + 1}`} />
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
              К каждому показу MVST выпускает журнал с лукбуком, интервью
              и кадрами с подиума.
            </p>
          </div>

          <ul className="grid gap-3 md:gap-4 md:grid-cols-2 max-w-3xl mx-auto">
            {magazines.map((m) => (
              <li key={m.file}>
                <a
                  href={m.file}
                  download
                  className="group block h-full p-7 md:p-8 border border-background/20 hover:border-background/60 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-serif text-2xl mb-2 leading-tight">
                        {m.title}
                      </div>
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

// Интерактивная галерея: одна большая фотография, превью-полоса,
// стрелки и навигация клавишами. Свайп на мобильном — без библиотек.
function LooksGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const total = images.length;
  const stripRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (i: number) => setActive(((i % total) + total) % total),
    [total],
  );

  // Клавиатура
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(active - 1);
      else if (e.key === "ArrowRight") goTo(active + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goTo]);

  // Центрируем активный thumb
  useEffect(() => {
    const el = thumbRefs.current[active];
    const strip = stripRef.current;
    if (!el || !strip) return;
    const target = el.offsetLeft - strip.clientWidth / 2 + el.clientWidth / 2;
    strip.scrollTo({ left: target, behavior: "smooth" });
  }, [active]);

  // Прелоад соседей
  useEffect(() => {
    [active - 1, active + 1].forEach((i) => {
      const src = images[((i % total) + total) % total];
      if (!src) return;
      const im = new Image();
      im.src = src;
    });
  }, [active, images, total]);

  return (
    <div>
      {/* Сцена */}
      <div
        className="relative bg-cream overflow-hidden aspect-[2/3] md:aspect-[16/10] md:max-h-[78vh]"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 40) goTo(active + (dx < 0 ? 1 : -1));
          touchStartX.current = null;
        }}
      >
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`Образ ${i + 1}`}
            loading={i === 0 ? "eager" : "lazy"}
            className={cn(
              "absolute inset-0 size-full object-contain transition-opacity duration-500 ease-out",
              i === active ? "opacity-100" : "opacity-0",
            )}
          />
        ))}

        <button
          type="button"
          onClick={() => goTo(active - 1)}
          aria-label="Предыдущий образ"
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 size-11 md:size-12 flex items-center justify-center rounded-full bg-background/85 backdrop-blur hairline border text-foreground/80 hover:bg-background hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-5 md:size-6" strokeWidth={1.25} />
        </button>
        <button
          type="button"
          onClick={() => goTo(active + 1)}
          aria-label="Следующий образ"
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 size-11 md:size-12 flex items-center justify-center rounded-full bg-background/85 backdrop-blur hairline border text-foreground/80 hover:bg-background hover:text-foreground transition-colors"
        >
          <ChevronRight className="size-5 md:size-6" strokeWidth={1.25} />
        </button>

        <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-10 eyebrow text-foreground/70 bg-background/80 backdrop-blur px-3 py-1 rounded-full tabular-nums">
          {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
      </div>

      {/* Превью-полоса */}
      <div
        ref={stripRef}
        className="mt-3 md:mt-4 flex gap-2 md:gap-2.5 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, i) => (
          <button
            key={src}
            ref={(el) => {
              thumbRefs.current[i] = el;
            }}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Образ ${i + 1}`}
            className={cn(
              "shrink-0 relative w-16 h-24 md:w-20 md:h-28 overflow-hidden bg-sand transition-opacity",
              i === active ? "opacity-100" : "opacity-55 hover:opacity-100",
            )}
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover"
            />
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-0 border-2 transition-colors",
                i === active ? "border-accent" : "border-transparent",
              )}
            />
          </button>
        ))}
      </div>
    </div>
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
      />
    </div>
  );
}
