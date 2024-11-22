export type ServerMetaType = {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_description?: string;
  og_title?: string;
  og_type?: string;
  og_image?: string;
  og_image_alt?: string;
  og_image_secure_url?: string;
  twitter_card?: string;
  twitter_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  og_availability?: string;
  element_image_title?: string;
  element_image_alt?: string;
  seo_text?: string;
  seo_text_more?: string;
  seo_title?: string;
  title?: string;
  canonical_url?: string;
};

export function mapServerMetaToClient(meta: ServerMetaType): BaseMetaType {
  return {
    title: meta.meta_title,
    description: meta.meta_description,
    keywords: meta.meta_keywords,
    ogDescription: meta.og_description,
    ogTitle: meta.og_title,
    ogType: meta.og_type,
    ogImage: meta.og_image,
    ogImageAlt: meta.og_image_alt,
    ogUrl: meta.meta_title,
    ogImageSecureUrl: meta.og_image_secure_url,
    twitterCard: meta.twitter_card,
    twitterImage: meta.twitter_image,
    twitterTitle: meta.twitter_title,
    twitterDescription: meta.twitter_description,
    ogAvailability: meta.og_availability,
    seoText: meta.seo_text,
    seoTextMore: meta.seo_text_more,
    seoTitle: meta.seo_title,
    canonicalUrl: meta.canonical_url,
    elementImageTitle: meta?.element_image_title,
    elementImageAlt: meta?.element_image_alt,
  };
}
