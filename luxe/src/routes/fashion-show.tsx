import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { LookbookStage } from "@/components/site/LookbookStage";
import looksData from "@/data/looks.json";
import type { Collection } from "@/types/looks";
import heroImg from "@/assets/lookbook-hero.webp";

const collection = looksData as unknown as Collection;

export const Route = createFileRoute("/fashion-show")({
  head: () => ({
    meta: [
      { title: "Fashion Show — MVST" },
      {
        name: "description",
        content:
          "Fashion Show MVST — записи показов, кадры с подиума и журналы коллекций.",
      },
      { property: "og:title", content: "Fashion Show — MVST" },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: FashionShowPage,
});

// Hero — CDN ЦУМа, разные источники под desktop/mobile.
const VIDEO_DESKTOP =
  "https://st-cdn.tsum.com/static/upload/mvst_desktop_04_26.mov?u=1776854797";
const VIDEO_MOBILE =
  "https://st-cdn.tsum.com/static/upload/mvst_mobile_04_26.mov?u=1776854797";

// «Запись показа» — rutube-эмбед в адаптивном aspect-video.
const RUTUBE_EMBED =
  "https://rutube.ru/play/embed/32a61d90014469a6115221e6600357f0/";

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

const magazines: ReadonlyArray<{ title: string; subtitle: string; file: string }> = [
  {
    title: "FASHION SHOW ВЕСНА-ЛЕТО 2026",
    subtitle: "Журнал показа",
    file: "/fashion-show/fashion-show-mvst.pdf",
  },
  {
    title: "FASHION SHOW ОСЕНЬ-ЗИМА 2025–2026",
    subtitle: "Журнал показа",
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
        <video
          src={VIDEO_DESKTOP}
          poster={heroImg}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="hidden md:block absolute inset-0 size-full object-cover opacity-90"
        />
        <video
          src={VIDEO_MOBILE}
          poster={heroImg}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="md:hidden absolute inset-0 size-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/55" />
        <div className="relative z-10 h-full flex flex-col items-center justify-end pb-20 px-6 text-center text-cream">
          <div className="eyebrow-lg mb-6 opacity-90">Fashion Show</div>
          <h1 className="font-serif text-5xl md:text-7xl font-light leading-[1.05]">
            Подиум MVST
          </h1>
          <p className="mt-8 max-w-xl text-base md:text-lg leading-relaxed opacity-90">
            Хроника показов новых коллекций — видео с подиума и журналы,
            которые мы выпускаем к каждому сезону.
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

      {/* VIDEO — rutube embed, адаптивный aspect-video */}
      <section className="bg-foreground/[0.04] py-10 md:py-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="eyebrow text-foreground/60 mb-4 md:mb-6 text-center">
            Запись показа
          </div>
          <div className="relative aspect-video bg-foreground/10 overflow-hidden">
            <iframe
              src={RUTUBE_EMBED}
              title="Запись показа MVST"
              className="absolute inset-0 size-full border-0"
              allow="clipboard-write; autoplay"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* LOOKBOOK STAGE — общий с /collection-ss26: фото образа + товары */}
      <section className="bg-cream/60 border-y hairline">
        <LookbookStage looks={collection.looks} />
      </section>

      {/* PULL QUOTE */}
      <section className="bg-foreground/[0.04]">
        <div className="px-6 py-24 md:py-32 max-w-3xl mx-auto text-center">
          <p className="font-serif text-3xl md:text-4xl leading-[1.3] text-foreground/85">
            «Подиум — это коллекция, услышанная вслух».
          </p>
        </div>
      </section>

      {/* PODIUM grid — временно скрыт, вернём позже */}
      {/*
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
      */}

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
