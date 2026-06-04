import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import logoFull from "@/assets/icons/LogoFull.svg";
import navIcon from "@/assets/icons/NavIcon.svg";
import closeIcon from "@/assets/icons/CloseIcon.svg";
import { HeaderCartButton } from "@/components/site/HeaderCartButton";
import { useLang, useDict } from "@/lib/i18n";

type NavItem =
  | { kind: "link"; to: string; label: string }
  | { kind: "catalog"; gender: "women" | "men"; label: string };

function buildNav(lang: "ru" | "en", d: ReturnType<typeof useDict>): ReadonlyArray<NavItem> {
  if (lang === "en") {
    // EN: Fashion Show + Boutiques + About
    return [
      { kind: "link", to: "/en/fashion-show", label: d.nav.fashionShow },
      { kind: "link", to: "/en/boutiques", label: d.nav.boutiques },
      { kind: "link", to: "/en/about", label: d.nav.about },
    ];
  }
  return [
    { kind: "link", to: "/collection-ss26", label: d.nav.collection },
    { kind: "catalog", gender: "women", label: d.nav.forHer },
    { kind: "catalog", gender: "men", label: d.nav.forHim },
    { kind: "link", to: "/fashion-show", label: d.nav.fashionShow },
    { kind: "link", to: "/boutiques", label: d.nav.boutiques },
    { kind: "link", to: "/about", label: d.nav.about },
  ];
}

export function Header({ variant = "solid" }: { variant?: "transparent" | "solid" }) {
  const transparentVariant = variant === "transparent";
  const lang = useLang();
  const d = useDict();
  const nav = buildNav(lang, d);
  const homeTo = lang === "en" ? "/en" : "/";
  const [open, setOpen] = useState(false);
  // Scrolled past hero — only relevant for transparent variant. Starts false on
  // both server and client to avoid hydration mismatch / first-paint flash.
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!transparentVariant) return;
    const compute = () => setScrolled(window.scrollY > 4);
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [transparentVariant]);

  // Sync header's real height to a CSS var so main can pad exactly that much
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const apply = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--header-h", `${Math.round(h)}px`);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    window.addEventListener("resize", apply);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);

  // For solid variant: always solid background, dark text.
  // For transparent variant: mobile is solid (hero is below header), desktop
  // is transparent at top, becomes solid after scroll or when mobile menu open.
  // We express mobile-vs-desktop difference via Tailwind responsive classes so
  // the initial server HTML and first client render are identical.
  const desktopSolid = !transparentVariant || scrolled || open;
  const headerBg = transparentVariant
    ? cn(
        // mobile always solid with hairline divider
        "bg-background border-b hairline",
        // desktop: solid only when scrolled or menu open; otherwise fully transparent (no border)
        desktopSolid
          ? "md:bg-background md:border-b md:hairline"
          : "md:bg-transparent md:border-b-0 md:[border-bottom-color:transparent]",
      )
    : "bg-background border-b hairline";

  // Light-on-dark only on desktop while transparent (i.e. over hero).
  const showGradient = transparentVariant && !desktopSolid;

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed top-0 inset-x-0 z-50",
          "transition-[background-color,border-color] duration-[280ms] ease-out",
          headerBg,
        )}
      >
        {/* Gradient overlay only over hero, only on desktop. Hidden on mobile via responsive class. */}
        {showGradient && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[140%] bg-gradient-to-b from-black/45 via-black/15 to-transparent hidden lg:block"
          />
        )}

        <div className="relative">
          {/* Mobile: logo row with menu button */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 lg:hidden">
            <button
              className="-ml-2 p-2 text-foreground transition-colors duration-[280ms] ease-out"
              aria-label="Меню"
              onClick={() => setOpen((v) => !v)}
            >
              <img src={open ? closeIcon : navIcon} alt="" className="size-6" />
            </button>

            <Link to={homeTo} aria-label="MVST" className="block">
              <img src={logoFull} alt="MVST" className="h-[25px] w-auto" />
            </Link>

            {lang === "en" ? <span className="size-10" aria-hidden /> : <HeaderCartButton />}
          </div>

          {/* Desktop: 3-col grid so logo + nav share one vertical center */}
          <div className="hidden lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-10 lg:px-10 lg:py-7">
            <Link to={homeTo} aria-label="MVST" className="block shrink-0 justify-self-start">
              <img
                src={logoFull}
                alt="MVST"
                className={cn(
                  "h-[25px] w-auto transition-[filter] duration-[280ms] ease-out",
                  showGradient && "brightness-0 invert",
                )}
              />
            </Link>
            <nav className="flex items-center justify-center gap-7">
              {nav.map((n) => {
                const className = cn(
                  "eyebrow whitespace-nowrap relative transition-colors duration-[280ms] ease-out",
                  "after:absolute after:left-0 after:right-0 after:-bottom-1.5 after:h-px after:bg-current",
                  "after:origin-left after:scale-x-0 after:transition-transform after:duration-[280ms] after:ease-out",
                  "hover:after:scale-x-100",
                  showGradient
                    ? "text-cream/85 hover:text-cream"
                    : "text-foreground/75 hover:text-accent",
                );
                const activeProps = {
                  className: cn(
                    "eyebrow whitespace-nowrap relative",
                    "after:absolute after:left-0 after:right-0 after:-bottom-1.5 after:h-px after:bg-current after:scale-x-100",
                    showGradient ? "text-cream" : "text-accent",
                  ),
                };

                if (n.kind === "catalog") {
                  return (
                    <Link
                      key={`catalog-${n.gender}`}
                      to="/catalog/$gender"
                      params={{ gender: n.gender }}
                      preload="intent"
                      className={className}
                      activeProps={activeProps}
                    >
                      {n.label}
                    </Link>
                  );
                }

                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    preload="intent"
                    className={className}
                    activeProps={activeProps}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>
            <div className="justify-self-end w-[85px] flex justify-end">
              {lang !== "en" && <HeaderCartButton dark={showGradient} />}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav — full-height drawer ниже шапки. Меню сверху, цитата
          прибита к низу видимого вьюпорта, без скролла. */}
      <div
        className={cn(
          "lg:hidden fixed inset-x-0 bottom-0 z-50 bg-background overflow-hidden",
          "transition-[transform,visibility] duration-300 ease-out",
          open ? "visible translate-y-0" : "invisible -translate-y-2",
        )}
        style={{ top: "var(--header-h, 60px)" }}
      >
        <div
          className={cn(
            "h-full flex flex-col px-6 pt-2 pb-[max(1.25rem,env(safe-area-inset-bottom))]",
            "transition-opacity duration-200",
            open ? "opacity-100" : "opacity-0",
          )}
        >
          <nav className="flex flex-col">
            <Link
              to={homeTo}
              onClick={() => setOpen(false)}
              className="font-serif text-xl py-3 border-b hairline text-foreground"
            >
              {d.nav.home}
            </Link>
            {nav.map((n) =>
              n.kind === "catalog" ? (
                <Link
                  key={`catalog-${n.gender}`}
                  to="/catalog/$gender"
                  params={{ gender: n.gender }}
                  preload="intent"
                  onClick={() => setOpen(false)}
                  className="font-serif text-xl py-3 border-b hairline text-foreground"
                >
                  {n.label}
                </Link>
              ) : (
                <Link
                  key={n.to}
                  to={n.to}
                  preload="intent"
                  onClick={() => setOpen(false)}
                  className="font-serif text-xl py-3 border-b hairline text-foreground"
                >
                  {n.label}
                </Link>
              ),
            )}
          </nav>

          <p className="mt-auto pt-8 font-serif text-base leading-snug text-foreground/65 text-center">
            {d.navQuote}
          </p>
        </div>
      </div>
    </>
  );
}
