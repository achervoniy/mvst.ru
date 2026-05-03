import wCoat from "@/assets/p-w-coat.webp";
import wDress from "@/assets/p-w-dress.webp";
import wJacket from "@/assets/p-w-jacket.jpg";
import wLoafers from "@/assets/p-w-loafers.webp";
import wBoots from "@/assets/p-w-boots.webp";
import wShawl from "@/assets/p-w-shawl.webp";
import wBag from "@/assets/p-w-bag.webp";
import mSuit from "@/assets/p-m-suit.webp";
import mSweater from "@/assets/p-m-sweater.webp";
import mShirt from "@/assets/p-m-shirt.webp";
import mOxfords from "@/assets/p-m-oxfords.webp";
import mLoafers from "@/assets/p-m-loafers.webp";
import mBelt from "@/assets/p-m-belt.webp";
import mScarf from "@/assets/p-m-scarf.webp";
import womenHero from "@/assets/women-hero.webp";
import menHero from "@/assets/men-hero.webp";
import campaign from "@/assets/campaign.webp";
import fabrics from "@/assets/fabrics.webp";

export type Gender = "women" | "men";
export type Category = "clothing" | "shoes" | "accessories";

export interface Product {
  id: string;
  slug: string;
  gender: Gender;
  category: Category;
  subcategory: string;
  name: string;
  price: number; // RUB
  materials: string;
  sizes: string[];
  description: string;
  images: string[]; // first = primary, second = hover
}

export const products: Product[] = [
  // WOMEN — clothing
  {
    id: "w-cl-1",
    slug: "kashemirovoe-palto-pesok",
    gender: "women",
    category: "clothing",
    subcategory: "Пальто",
    name: "Пальто из чистого кашемира",
    price: 489000,
    materials: "100% кашемир",
    sizes: ["XS", "S", "M", "L"],
    description:
      "Удлинённое пальто прямого силуэта из тонкого итальянского кашемира. Внутренний пояс, потайная застёжка, ручная отделка лацканов.",
    images: [wCoat, womenHero],
  },
  {
    id: "w-cl-2",
    slug: "lnyanoe-plate-ivory",
    gender: "women",
    category: "clothing",
    subcategory: "Платья",
    name: "Льняное платье миди",
    price: 198000,
    materials: "100% итальянский лён",
    sizes: ["XS", "S", "M", "L"],
    description:
      "Платье свободного кроя из плотного льняного полотна. Драпировка по линии плеча, скрытая застёжка на пуговицы.",
    images: [wDress, campaign],
  },
  {
    id: "w-cl-3",
    slug: "trikotazhnyi-zhaket",
    gender: "women",
    category: "clothing",
    subcategory: "Жакеты",
    name: "Трикотажный жакет с поясом",
    price: 264000,
    materials: "Кашемир / шёлк",
    sizes: ["XS", "S", "M", "L"],
    description:
      "Мягкий жакет из смеси кашемира и шёлка. Съёмный пояс, плечи без подкладки, лаконичные накладные карманы.",
    images: [wJacket, fabrics],
  },
  // WOMEN — shoes
  {
    id: "w-sh-1",
    slug: "kozhanye-loafery-cream",
    gender: "women",
    category: "shoes",
    subcategory: "Лоферы",
    name: "Кожаные лоферы",
    price: 142000,
    materials: "Телячья кожа",
    sizes: ["36", "37", "38", "39", "40"],
    description:
      "Классические лоферы из мягкой телячьей кожи кремового оттенка. Кожаная стелька, прошивка вручную.",
    images: [wLoafers, wBoots],
  },
  {
    id: "w-sh-2",
    slug: "zamshevye-botinki",
    gender: "women",
    category: "shoes",
    subcategory: "Ботинки",
    name: "Замшевые ботинки",
    price: 178000,
    materials: "Итальянская замша",
    sizes: ["36", "37", "38", "39", "40"],
    description:
      "Ботинки из плотной замши с эластичными вставками. Удобная колодка, кожаная подошва.",
    images: [wBoots, wLoafers],
  },
  // WOMEN — accessories
  {
    id: "w-ac-1",
    slug: "kashemirovyi-shal",
    gender: "women",
    category: "accessories",
    subcategory: "Шали",
    name: "Кашемировая шаль",
    price: 96000,
    materials: "100% кашемир",
    sizes: ["UNI"],
    description:
      "Тонкая шаль из мягкого кашемира с ручной кистью. Тёплый песочный оттенок.",
    images: [wShawl, fabrics],
  },
  {
    id: "w-ac-2",
    slug: "kozhanaya-sumka-tote",
    gender: "women",
    category: "accessories",
    subcategory: "Сумки",
    name: "Кожаная сумка-тоут",
    price: 312000,
    materials: "Телячья кожа",
    sizes: ["UNI"],
    description:
      "Просторная сумка из натуральной телячьей кожи с мягкими ручками. Внутреннее отделение на молнии.",
    images: [wBag, wLoafers],
  },

  // MEN — clothing
  {
    id: "m-cl-1",
    slug: "shesterstyanoi-kostyum",
    gender: "men",
    category: "clothing",
    subcategory: "Костюмы",
    name: "Костюм из шерсти Super 150's",
    price: 612000,
    materials: "100% шерсть Super 150's",
    sizes: ["46", "48", "50", "52", "54"],
    description:
      "Двубортный костюм с лацканами в стиле peak. Полностью на ручной сборке, шёлковая подкладка.",
    images: [mSuit, menHero],
  },
  {
    id: "m-cl-2",
    slug: "kashemirovyi-sviter",
    gender: "men",
    category: "clothing",
    subcategory: "Трикотаж",
    name: "Свитер из чистого кашемира",
    price: 184000,
    materials: "100% кашемир",
    sizes: ["S", "M", "L", "XL"],
    description:
      "Тонкий свитер с круглым вырезом из мягкого кашемира. Английская резинка по краям.",
    images: [mSweater, fabrics],
  },
  {
    id: "m-cl-3",
    slug: "lnyanaya-rubashka",
    gender: "men",
    category: "clothing",
    subcategory: "Рубашки",
    name: "Льняная рубашка",
    price: 86000,
    materials: "100% итальянский лён",
    sizes: ["S", "M", "L", "XL"],
    description:
      "Свободная рубашка из лёгкого льна. Воротник button-down, перламутровые пуговицы.",
    images: [mShirt, mSweater],
  },
  // MEN — shoes
  {
    id: "m-sh-1",
    slug: "oksfordy-iz-kozhi",
    gender: "men",
    category: "shoes",
    subcategory: "Туфли",
    name: "Оксфорды из телячьей кожи",
    price: 198000,
    materials: "Телячья кожа",
    sizes: ["40", "41", "42", "43", "44", "45"],
    description:
      "Классические оксфорды с прошивкой Goodyear. Кожаная подошва, набойка из натурального каучука.",
    images: [mOxfords, mLoafers],
  },
  {
    id: "m-sh-2",
    slug: "zamshevye-loafery-mens",
    gender: "men",
    category: "shoes",
    subcategory: "Лоферы",
    name: "Замшевые лоферы",
    price: 156000,
    materials: "Итальянская замша",
    sizes: ["40", "41", "42", "43", "44"],
    description:
      "Мягкие лоферы из плотной замши песочного оттенка. Кожаная подкладка, гибкая подошва.",
    images: [mLoafers, mOxfords],
  },
  // MEN — accessories
  {
    id: "m-ac-1",
    slug: "kozhanyi-remen",
    gender: "men",
    category: "accessories",
    subcategory: "Ремни",
    name: "Кожаный ремень с латунной пряжкой",
    price: 54000,
    materials: "Телячья кожа",
    sizes: ["85", "90", "95", "100", "105"],
    description: "Ремень из плотной телячьей кожи с матовой латунной пряжкой ручной отделки.",
    images: [mBelt, mOxfords],
  },
  {
    id: "m-ac-2",
    slug: "kashemirovyi-sharf",
    gender: "men",
    category: "accessories",
    subcategory: "Шарфы",
    name: "Кашемировый шарф",
    price: 78000,
    materials: "100% кашемир",
    sizes: ["UNI"],
    description: "Тонкий шарф из мягкого кашемира песочно-серого оттенка с лёгкой бахромой.",
    images: [mScarf, fabrics],
  },
];

export const formatPrice = (rub: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(rub);

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getByGender = (g: Gender) => products.filter((p) => p.gender === g);
export const getRelated = (p: Product, n = 4) =>
  products.filter((x) => x.gender === p.gender && x.id !== p.id).slice(0, n);

export const categoryLabel: Record<Category, string> = {
  clothing: "Одежда",
  shoes: "Обувь",
  accessories: "Аксессуары",
};
