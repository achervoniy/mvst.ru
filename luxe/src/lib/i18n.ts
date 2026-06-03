import { useRouterState } from "@tanstack/react-router";

export type Lang = "ru" | "en";

export function useLang(): Lang {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return pathname.startsWith("/en") ? "en" : "ru";
}

// Получить URL «той же страницы» на другом языке. Используется для тоггла в подвале.
export function toggleLangHref(currentPath: string): string {
  if (currentPath.startsWith("/en")) {
    const rest = currentPath.slice(3); // убираем "/en"
    if (rest === "" || rest === "/") return "/";
    // RU-эквиваленты есть только для "/", "/about", "/boutiques".
    // Для остальных вернёмся на главную.
    const allowed = ["/about", "/boutiques"];
    return allowed.some((p) => rest === p || rest.startsWith(p + "/")) ? rest : "/";
  }
  // RU → EN. EN-версии существуют только для "/", "/about", "/boutiques".
  const allowedRuToEn = ["/about", "/boutiques"];
  if (currentPath === "/") return "/en";
  const match = allowedRuToEn.find((p) => currentPath === p || currentPath.startsWith(p + "/"));
  return match ? `/en${match}` : "/en";
}

type Dict = {
  nav: {
    collection: string;
    forHer: string;
    forHim: string;
    boutiques: string;
    about: string;
    fashionShow: string;
    home: string;
  };
  footer: {
    shopping: string;
    service: string;
    brand: string;
    contacts: string;
    delivery: string;
    craft: string;
    sustainability: string;
    rights: string;
    cities: string;
  };
  common: {
    openCatalog: string;
    allBoutiques: string;
    buildRoute: string;
    boutique: string;
  };
};

export const dict: Record<Lang, Dict> = {
  ru: {
    nav: {
      collection: "Коллекция весна-лето 2026",
      forHer: "Для нее",
      forHim: "Для него",
      boutiques: "Бутики",
      about: "О бренде",
      fashionShow: "Fashion Show",
      home: "Главная",
    },
    footer: {
      shopping: "Покупки",
      service: "Сервис",
      brand: "Бренд",
      contacts: "Контакты",
      delivery: "Доставка и возврат",
      craft: "Мастерство",
      sustainability: "Устойчивое развитие",
      rights: "Все права защищены.",
      cities: "Москва · Санкт-Петербург",
    },
    common: {
      openCatalog: "Открыть каталог",
      allBoutiques: "Все бутики",
      buildRoute: "Построить маршрут",
      boutique: "Бутик",
    },
  },
  en: {
    nav: {
      collection: "Collection",
      forHer: "Women",
      forHim: "Men",
      boutiques: "Boutiques",
      about: "About",
      fashionShow: "Fashion Show",
      home: "Home",
    },
    footer: {
      shopping: "Shopping",
      service: "Service",
      brand: "Brand",
      contacts: "Contacts",
      delivery: "Shipping & returns",
      craft: "Craft",
      sustainability: "Sustainability",
      rights: "All rights reserved.",
      cities: "Moscow · Saint Petersburg",
    },
    common: {
      openCatalog: "Discover",
      allBoutiques: "All boutiques",
      buildRoute: "Get directions",
      boutique: "Boutique",
    },
  },
};

export function useDict() {
  return dict[useLang()];
}
