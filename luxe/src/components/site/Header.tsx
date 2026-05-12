import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import logoFull from "@/assets/icons/LogoFull.svg";
import navIcon from "@/assets/icons/NavIcon.svg";
import closeIcon from "@/assets/icons/CloseIcon.svg";
import { HeaderCartButton } from "@/components/site/HeaderCartButton";

const nav = [
  { to: "/collection-ss26", label: "Коллекция весна-лето 2026" },
  { to: "/catalog/$gender", label: "Для нее", params: { gender: "women" as const } },
  { to: "/catalog/$gender", label: "Для него", params: { gender: "men" as const } },
  { to: "/boutiques", label: "Бутики" },
  { to: "/about", label: "О бренде" },
] as const;

export function Header({ variant = "solid" }: { variant?: "transparent" | "solid" }) {
  const transparentVariant = variant === "transparent";
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
            className="pointer-events-none absolute inset-x-0 top-0 h-[140%] bg-gradient-to-b from-black/45 via-black/15 to-transparent hidden md:block"
          />
        )}

        <div className="relative">
          {/* Mobile: logo row with menu button */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 md:hidden">
            <button
              className="-ml-2 p-2 text-foreground transition-colors duration-[280ms] ease-out"
              aria-label="Меню"
              onClick={() => setOpen((v) => !v)}
            >
              <img src={open ? closeIcon : navIcon} alt="" className="size-6" />
            </button>

            <Link to="/" aria-label="MVST" className="block">
              <img src={logoFull} alt="MVST" className="h-5 w-auto" />
            </Link>

            <HeaderCartButton />
          </div>

          {/* Desktop: 3-col grid so logo + nav share one vertical center */}
          <div className="hidden md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10 md:px-10 md:py-7">
            <Link to="/" aria-label="MVST" className="block shrink-0 justify-self-start">
              <img
                src={logoFull}
                alt="MVST"
                className={cn(
                  "h-5 w-auto transition-[filter] duration-[280ms] ease-out",
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

                if (n.to === "/catalog/$gender") {
                  return (
                    <Link
                      key={`${n.to}-${n.params.gender}`}
                      to="/catalog/$gender"
                      params={n.params}
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
              <HeaderCartButton dark={showGradient} />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav — fixed overlay, completely outside header to avoid layout shifts */}
      <div
        className={cn(
          "md:hidden fixed inset-x-0 z-50 overflow-hidden bg-background transition-[max-height,visibility] duration-300",
          open ? "visible max-h-96 border-b hairline" : "invisible max-h-0 border-0",
        )}
        style={{ top: "var(--header-h, 60px)" }}
      >
        <nav className="flex flex-col px-6 py-5">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="font-serif text-xl py-3 border-b hairline text-foreground"
          >
            Главная
          </Link>
          {nav.map((n) =>
            n.to === "/catalog/$gender" ? (
              <Link
                key={`${n.to}-${n.params.gender}`}
                to="/catalog/$gender"
                params={n.params}
                preload="intent"
                onClick={() => setOpen(false)}
                className="font-serif text-xl py-3 border-b hairline last:border-0 text-foreground"
              >
                {n.label}
              </Link>
            ) : (
              <Link
                key={n.to}
                to={n.to}
                preload="intent"
                onClick={() => setOpen(false)}
                className="font-serif text-xl py-3 border-b hairline last:border-0 text-foreground"
              >
                {n.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </>
  );
}
