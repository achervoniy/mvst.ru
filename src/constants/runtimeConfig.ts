export const runtimeConfig = {
  API_DOMAIN: process.env.API_DOMAIN,
  SSR_API_DOMAIN: process.env.SSR_API_DOMAIN,
};

export const HOME_PAGE_VIDEO_URL = 'https://cdn1.tsum.com/video/mvst-landing-video/low_size_MUST_1920x1080.mp4';
export const HOME_PAGE_VIDEO_URL_MOBILE =
  'https://cdn1.tsum.com/video/mvst-landing-video/low_size_MUST_1080x1920_IG.mp4';

export const LOOK_SLUGS = {
  men: 'must-web-men',
  women: 'must-web-women',
};

export const HOME_PAGE_SELECTIONS = {
  men: 'must-m',
  female: 'must-w',
  // Для теста на стейбле
  // men: 'soft-tailoring-men',
  // women: 'sangallo-for-summer-women',
};

export const DOWNLOAD_APP_LINK =
  'https://tsum.onelink.me/oBxT?pid=mvst_ru&c=cn.mvst_lp&af_channel=referral&deep_link_value=https%3A%2F%2Fwww.tsum.ru%2Fbrand%2Fmust-774534.html';

export const TSUM_SITE_LINK =
  'https://www.tsum.ru/brand/must-774534.html/?utm_campaign=cn.mvst_lp&utm_medium=referral&utm_source=mvst.ru';

export const buildProductLink = (slug: string) => {
  return `https://www.tsum.ru/product/${slug}/?utm_campaign=cn.mvst_lp&utm_medium=referral&utm_source=mvst.ru`;
};