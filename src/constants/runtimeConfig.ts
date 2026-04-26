export const runtimeConfig = {
  API_DOMAIN: process.env.API_DOMAIN,
  SSR_API_DOMAIN: process.env.SSR_API_DOMAIN,
};

export const HOME_PAGE_VIDEO_URL = 'https://st-cdn.tsum.com/static/upload/mvst_desktop_26.mov?u=1762764722';
export const HOME_PAGE_VIDEO_URL_MOBILE = 'https://st-cdn.tsum.com/static/upload/mvst_mobile_26.mov?u=1762764695';

export const LOOK_SLUGS = {
  men: 'must-web-men',
  women: 'must-web-women',
  all: 'must-web',
};

export const MVST_BRAND_TITLE = 'MVST';

export const HOME_PAGE_FILTERS = {
  men: {
    category: 18327,
    brand: 13037770,
  },
  female: {
    category: 18368,
    brand: 13037770,
  },
};

export const DOWNLOAD_APP_LINK =
  'https://tsum.onelink.me/oBxT?pid=mvst_ru&c=cn.mvst_lp&af_channel=referral&deep_link_value=https%3A%2F%2Fwww.tsum.ru%2Fbrand%2Fmust-774534.html';

export const TSUM_SITE_LINK =
  'https://www.tsum.ru/brand/must-774534.html?utm_campaign=cn.mvst_lp&utm_medium=referral&utm_source=mvst.ru';

export const buildProductLink = (slug: string) => {
  return `https://www.tsum.ru/product/${slug}/?utm_campaign=cn.mvst_lp&utm_medium=referral&utm_source=mvst.ru`;
};

export const TSUM_SITE_LINK_BY_GENDER = {
  women:
    'https://www.tsum.ru/brand/zhenskoe-18368/must-774534.html?utm_campaign=cn.mvst_lp&utm_medium=referral&utm_source=mvst.ru',
  men: 'https://www.tsum.ru/brand/muzhskoe-2408/must-774534.html?utm_campaign=cn.mvst_lp&utm_medium=referral&utm_source=mvst.ru',
};

export const TG_LINK = 'https://t.me/mvst_fashion';
export const INSTAGRAM_LINK = 'https://www.instagram.com/mvst_fashion/';
export const WHATSAPP_LINK = 'https://wa.me/74951234567';

export const BOUTIQUE_INFO = {
  title: 'Бутик MVST',
  address: 'Москва, Рублёво-Успенское шоссе, д. 114с7',
  hours: 'Ежедневно с 11:00 до 22:00',
  phone: '+7 (495) 933-79-00',
};

// Ручной список бестселлеров — slug'и товаров, которые показываются
// в блоке «Бестселлеры» на главной. Сохраняется порядок.
export const HOME_PAGE_BESTSELLERS_SLUGS: string[] = [];

// Кураторские подборки — плитки-ссылки в блоке «Особые подборки».
// Каждая плитка ведёт на /collection/* или /catalog/*.
export const HOME_PAGE_SELECTIONS: Array<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href: string;
  tone?: 'dark' | 'cream' | 'ochre';
}> = [
  {
    eyebrow: 'весна-лето 26',
    title: 'новая коллекция',
    subtitle: 'Первая поставка SS26 уже в&nbsp;бутиках и&nbsp;онлайн',
    href: `/collection/${LOOK_SLUGS.all}`,
    tone: 'dark',
  },
  {
    eyebrow: 'тренд сезона',
    title: 'лён и хлопок',
    subtitle: 'Лёгкие природные ткани с&nbsp;характером',
    href: `/catalog/women`,
    tone: 'cream',
  },
  {
    eyebrow: 'классика',
    title: 'вязаный трикотаж',
    subtitle: 'Тонкая шерсть, кашемир, мерино',
    href: `/catalog/men`,
    tone: 'ochre',
  },
];
