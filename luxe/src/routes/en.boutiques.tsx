import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { boutiques } from "./boutiques";
import { translateBoutiqueName, translateAddress } from "./en.index";

export const Route = createFileRoute("/en/boutiques")({
  head: () => ({
    meta: [
      { title: "Boutiques — MVST" },
      { name: "description", content: "MVST boutiques in Moscow and Saint Petersburg." },
      { property: "og:title", content: "Boutiques — MVST" },
    ],
  }),
  component: EnBoutiquesPage,
});

function translateHours(h: string): string {
  return h
    .replace(/Ежедневно с/g, "Daily")
    .replace(/Пн–Чт с/g, "Mon–Thu")
    .replace(/Пт–Сб с/g, "Fri–Sat")
    .replace(/Пт–Вс с/g, "Fri–Sun")
    .replace(/ до /g, " – ");
}

function EnBoutiquesPage() {
  return (
    <SiteLayout>
      <section className="px-6 md:px-12 py-20 text-center">
        <h1 className="font-serif text-3xl md:text-4xl max-w-3xl mx-auto leading-tight font-light">
          The new MVST collection is available in our Moscow and Saint Petersburg
          boutiques.
        </h1>
      </section>

      <div className="space-y-px bg-foreground/10">
        {boutiques.map((b, i) => (
          <article
            key={b.name}
            id={b.slug}
            style={{ scrollMarginTop: "var(--header-h, 96px)" }}
            className={`grid md:grid-cols-2 bg-background ${
              i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
            }`}
          >
            <div className="aspect-[4/3] bg-sand overflow-hidden">
              <img
                src={b.img}
                alt={`MVST boutique — ${translateBoutiqueName(b.name)}`}
                loading="lazy"
                className="size-full object-cover"
              />
            </div>
            <div className="p-8 md:p-16 flex flex-col justify-center">
              <div className="eyebrow text-foreground/60 mb-3">Boutique</div>
              <h2 className="font-serif text-4xl md:text-5xl mb-6">
                {translateBoutiqueName(b.name)}
              </h2>
              <div className="space-y-3 text-foreground/80 mb-8">
                <div>{translateAddress(b.addr)}</div>
                <div>{translateHours(b.hours)}</div>
              </div>
              <a
                href={b.map}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start eyebrow leading-none border-b border-foreground pb-1 hover:text-accent hover:border-accent"
              >
                Get directions
              </a>
            </div>
          </article>
        ))}
      </div>
    </SiteLayout>
  );
}
