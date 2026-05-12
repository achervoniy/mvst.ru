import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/site/SiteLayout";
import imgTsum from "@/assets/boutiques/tsum.webp";
import imgBarviha from "@/assets/boutiques/barviha.webp";
import imgTretyakovsky from "@/assets/boutiques/tretyakovsky.webp";
import imgRadisson from "@/assets/boutiques/radisson.webp";
import imgKutuzovsky from "@/assets/boutiques/kutuzovsky.webp";
import imgDlt from "@/assets/boutiques/dlt.webp";

// Резервные данные — используются, если CRM недоступен.
const fallbackBoutiques: BoutiqueView[] = [
  {
    slug: "tsum",
    name: "ЦУМ",
    addr: "Москва, ул. Петровка, д. 2",
    hours: "Ежедневно с 10:00 до 22:00",
    img: imgTsum,
    map: "https://yandex.ru/maps/?text=ЦУМ+Петровка+2+Москва",
  },
  {
    slug: "barviha",
    name: "Барвиха Luxury Village",
    addr: "Москва, Рублёво-Успенское шоссе, д. 114с7",
    hours: "Пн–Чт с 11:00 до 22:00 · Пт–Вс с 11:00 до 23:00",
    img: imgBarviha,
    map: "https://yandex.ru/maps/?text=Барвиха+Luxury+Village",
  },
  {
    slug: "tret",
    name: "Третьяковский проезд",
    addr: "Москва, Третьяковский проезд, д. 1",
    hours: "Пн–Чт с 11:00 до 22:00 · Пт–Сб с 11:00 до 23:00",
    img: imgTretyakovsky,
    map: "https://yandex.ru/maps/?text=Третьяковский+проезд+1+Москва",
  },
  {
    slug: "raddison",
    name: "Radisson Slavyanskaya",
    addr: "Москва, площадь Европы, 2",
    hours: "Ежедневно с 11:00 до 22:00",
    img: imgRadisson,
    map: "https://yandex.ru/maps/?text=площадь+Европы+2+Москва",
  },
  {
    slug: "kutuzovsky",
    name: "Кутузовский, 31",
    addr: "Москва, Кутузовский проспект, д. 31",
    hours: "Ежедневно с 11:00 до 22:00",
    img: imgKutuzovsky,
    map: "https://yandex.ru/maps/?text=Кутузовский+проспект+31+Москва",
  },
  {
    slug: "dlt",
    name: "ДЛТ",
    addr: "Санкт-Петербург, Большая Конюшенная ул., д. 21–23",
    hours: "Ежедневно с 11:00 до 22:00",
    img: imgDlt,
    map: "https://yandex.ru/maps/?text=ДЛТ+Большая+Конюшенная+21+Санкт-Петербург",
  },
];

interface BoutiqueView {
  slug: string;
  name: string;
  addr: string;
  hours: string;
  img: string;
  map: string;
}

interface CrmBoutique {
  id: string;
  slug: string;
  title: string;
  city: string;
  address: string;
  phone: string | null;
  schedule: string | null;
  routeUrl: string | null;
  photoUrl: string | null;
  priority: number;
}

const FALLBACK_IMG_BY_SLUG: Record<string, string> = {
  tsum: imgTsum,
  barviha: imgBarviha,
  tret: imgTretyakovsky,
  raddison: imgRadisson,
  kutuzovsky: imgKutuzovsky,
  dlt: imgDlt,
};

const getBoutiques = createServerFn({ method: "GET" }).handler(async (): Promise<BoutiqueView[]> => {
  const CRM_URL = process.env.CRM_URL ?? "http://localhost:3001";
  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 5_000);
    const res = await fetch(`${CRM_URL}/api/public/boutiques`, {
      signal: ctrl.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`crm ${res.status}`);
    const data = (await res.json()) as { boutiques: CrmBoutique[] };
    if (!Array.isArray(data?.boutiques) || data.boutiques.length === 0) return fallbackBoutiques;
    return data.boutiques.map((b) => ({
      slug: b.slug,
      name: b.title,
      addr: [b.city, b.address].filter(Boolean).join(", "),
      hours: b.schedule ?? "",
      img: b.photoUrl ?? FALLBACK_IMG_BY_SLUG[b.slug] ?? imgTsum,
      map:
        b.routeUrl ??
        `https://yandex.ru/maps/?text=${encodeURIComponent(`${b.title} ${b.city} ${b.address}`)}`,
    }));
  } catch (err) {
    console.error(
      JSON.stringify({
        level: "warn",
        source: "boutiques",
        operation: "getBoutiques",
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return fallbackBoutiques;
  }
});

export const Route = createFileRoute("/boutiques")({
  head: () => ({
    meta: [
      { title: "Бутики MVST" },
      { name: "description", content: "Адреса бутиков MVST в Москве и Санкт-Петербурге." },
      { property: "og:title", content: "Бутики MVST" },
      { property: "og:description", content: "Адреса и часы работы бутиков MVST." },
    ],
  }),
  loader: async () => ({ boutiques: await getBoutiques() }),
  staleTime: 30 * 1000,
  component: BoutiquesPage,
});

export const boutiques = fallbackBoutiques;

function BoutiquesPage() {
  const { boutiques } = Route.useLoaderData();
  return (
    <SiteLayout>
      <section className="px-6 md:px-12 py-20 text-center">
        <div className="eyebrow text-foreground/60 mb-4">Бутики</div>
        <h1 className="font-serif text-5xl md:text-6xl">Найти MVST</h1>
        <p className="mt-6 max-w-xl mx-auto text-foreground/75">
          Бутики MVST в Москве и Санкт-Петербурге — пространства, в которых можно увидеть и примерить коллекции.
        </p>
      </section>

      <div className="space-y-px bg-foreground/10">
        {boutiques.map((b, i) => (
          <article
            key={b.name}
            className={`grid md:grid-cols-2 bg-background ${
              i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
            }`}
          >
            <div className="aspect-[4/3] bg-sand overflow-hidden">
              <img
                src={b.img}
                alt={`Бутик MVST — ${b.name}`}
                loading="lazy"
                className="size-full object-cover"
              />
            </div>
            <div className="p-8 md:p-16 flex flex-col justify-center">
              <div className="eyebrow text-foreground/60 mb-3">Бутик</div>
              <h2 className="font-serif text-4xl md:text-5xl mb-6">{b.name}</h2>
              <div className="space-y-3 text-foreground/80 mb-8">
                <div>{b.addr}</div>
                <div>{b.hours}</div>
              </div>
              <a
                href={b.map}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start eyebrow border-b border-foreground pb-1 hover:text-accent hover:border-accent"
              >
                Построить маршрут
              </a>
            </div>
          </article>
        ))}
      </div>
    </SiteLayout>
  );
}
