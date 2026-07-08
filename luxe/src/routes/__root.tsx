import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      // Сайт пока закрыт от индексации — продакшен-релиз ещё не объявлен.
      { name: "robots", content: "noindex, nofollow, noarchive" },
      { name: "googlebot", content: "noindex, nofollow" },
      { name: "yandex", content: "noindex, nofollow" },
      { title: "MVST — итальянское мастерство" },
      {
        name: "description",
        content:
          "MVST — российский люкс-бренд: верхняя одежда, костюмы, кашемир и аксессуары ручной работы. Коллекция Весна–Лето 26.",
      },
      { name: "author", content: "MVST" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "MVST" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "MVST — итальянское мастерство" },
      { name: "twitter:title", content: "MVST — итальянское мастерство" },
      { name: "description", content: "MVST Luxury Atelier is an e-commerce website for a high-end fashion brand." },
      { property: "og:description", content: "MVST Luxury Atelier is an e-commerce website for a high-end fashion brand." },
      { name: "twitter:description", content: "MVST Luxury Atelier is an e-commerce website for a high-end fashion brand." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6bb15364-b112-4cba-8590-ee503a595eda/id-preview-3933bbea--e943f3b8-7ae0-46e2-adb6-43f69b9afd8d.lovable.app-1776724775048.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6bb15364-b112-4cba-8590-ee503a595eda/id-preview-3933bbea--e943f3b8-7ae0-46e2-adb6-43f69b9afd8d.lovable.app-1776724775048.png" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon/favicon-96x96.png" },
      { rel: "shortcut icon", href: "/favicon/favicon.ico" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}
