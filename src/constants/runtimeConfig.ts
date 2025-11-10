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
