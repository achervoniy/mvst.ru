import { Link, useRouterState } from "@tanstack/react-router";
import logoFull from "@/assets/icons/LogoFull.svg";
import { useLang, useDict, toggleLangHref } from "@/lib/i18n";

// Простые SVG-флажки в подвале (без сторонних иконпаков).
function FlagRu({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 18 12"
      className={active ? "size-5 opacity-100" : "size-5 opacity-50"}
      aria-hidden
    >
      <rect width="18" height="4" fill="#fff" stroke="currentColor" strokeWidth="0.4" />
      <rect y="4" width="18" height="4" fill="#0039A6" />
      <rect y="8" width="18" height="4" fill="#D52B1E" />
    </svg>
  );
}

function FlagEn({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 18 12"
      className={active ? "size-5 opacity-100" : "size-5 opacity-50"}
      aria-hidden
    >
      <rect width="18" height="12" fill="#012169" />
      <path d="M0 0 L18 12 M18 0 L0 12" stroke="#fff" strokeWidth="1.5" />
      <path d="M0 0 L18 12 M18 0 L0 12" stroke="#C8102E" strokeWidth="0.7" />
      <path d="M9 0 V12 M0 6 H18" stroke="#fff" strokeWidth="2" />
      <path d="M9 0 V12 M0 6 H18" stroke="#C8102E" strokeWidth="1.2" />
    </svg>
  );
}

export function Footer() {
  const lang = useLang();
  const d = useDict();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const otherHref = toggleLangHref(pathname);

  return (
    <footer className="border-t hairline bg-background">
      <div className="px-6 md:px-12 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        {lang === "ru" ? (
          <div>
            <div className="eyebrow text-foreground/60 mb-4">{d.footer.shopping}</div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/catalog/$gender"
                  params={{ gender: "women" }}
                  preload="intent"
                  className="hover:text-accent"
                >
                  {d.nav.forHer}
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog/$gender"
                  params={{ gender: "men" }}
                  preload="intent"
                  className="hover:text-accent"
                >
                  {d.nav.forHim}
                </Link>
              </li>
              <li>
                <Link to="/collection-ss26" preload="intent" className="hover:text-accent">
                  {d.nav.collection}
                </Link>
              </li>
              <li>
                <Link to="/fashion-show" preload="intent" className="hover:text-accent">
                  {d.nav.fashionShow}
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <div>
            <div className="eyebrow text-foreground/60 mb-4">{d.footer.brand}</div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/en/fashion-show" preload="intent" className="hover:text-accent">
                  {d.nav.fashionShow}
                </Link>
              </li>
              <li>
                <Link to="/en/about" preload="intent" className="hover:text-accent">
                  {d.nav.about}
                </Link>
              </li>
              <li>
                <Link to="/en/boutiques" preload="intent" className="hover:text-accent">
                  {d.nav.boutiques}
                </Link>
              </li>
            </ul>
          </div>
        )}

        <div>
          <div className="eyebrow text-foreground/60 mb-4">{d.footer.service}</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to={lang === "en" ? "/en/boutiques" : "/boutiques"}
                preload="intent"
                className="hover:text-accent"
              >
                {d.nav.boutiques}
              </Link>
            </li>
            <li>
              <span className="text-foreground/60">{d.footer.delivery}</span>
            </li>
          </ul>
        </div>

        <div>
          <div className="eyebrow text-foreground/60 mb-4">{d.footer.brand}</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to={lang === "en" ? "/en/about" : "/about"}
                preload="intent"
                className="hover:text-accent"
              >
                {d.nav.about}
              </Link>
            </li>
            {lang === "ru" && (
              <>
                <li>
                  <Link to="/about" hash="craft" preload="intent" className="hover:text-accent">
                    {d.footer.craft}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    hash="sustainability"
                    preload="intent"
                    className="hover:text-accent"
                  >
                    {d.footer.sustainability}
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div>
          <div className="eyebrow text-foreground/60 mb-4">{d.footer.contacts}</div>
          <ul className="space-y-2 text-sm">
            <li>
              <a className="hover:text-accent" href="mailto:client@mvst.ru">
                client@mvst.ru
              </a>
            </li>
          </ul>

          <div className="mt-8">
            <div className="eyebrow text-foreground/60 mb-3">
              {lang === "ru" ? "Язык" : "Language"}
            </div>
            <div className="flex items-center gap-3">
              <Link
                to={lang === "ru" ? pathname : otherHref}
                aria-label="Русский"
                className="flex items-center gap-2 text-xs"
              >
                <FlagRu active={lang === "ru"} />
                <span className={lang === "ru" ? "text-foreground" : "text-foreground/55"}>
                  RU
                </span>
              </Link>
              <span className="text-foreground/30">·</span>
              <Link
                to={lang === "en" ? pathname : otherHref}
                aria-label="English"
                className="flex items-center gap-2 text-xs"
              >
                <FlagEn active={lang === "en"} />
                <span className={lang === "en" ? "text-foreground" : "text-foreground/55"}>
                  EN
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t hairline px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-foreground/60">
        <img src={logoFull} alt="MVST" className="h-5 w-auto" />
        <div>
          © {new Date().getFullYear()} MVST. {d.footer.rights}
        </div>
        <div className="eyebrow">{d.footer.cities}</div>
      </div>
    </footer>
  );
}
