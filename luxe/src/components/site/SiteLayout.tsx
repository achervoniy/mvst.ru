import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteLayout({
  children,
  transparentHeader = false,
}: {
  children: ReactNode;
  transparentHeader?: boolean;
}) {
  // Padding strategy:
  // - Solid header: always reserve header height.
  // - Transparent header: on mobile reserve height (header is solid there);
  //   on desktop (md+) the hero sits under the header, no padding needed.
  // We use a CSS class instead of JS-derived state to keep SSR/CSR identical
  // and avoid layout flashes during hydration.
  const mainClass = transparentHeader
    ? "flex-1 pt-[var(--header-h,60px)] md:pt-0"
    : "flex-1 pt-[var(--header-h,88px)]";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header variant={transparentHeader ? "transparent" : "solid"} />
      <main className={mainClass}>{children}</main>
      <Footer />
    </div>
  );
}
