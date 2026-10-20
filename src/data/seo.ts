import settings from "./seo.json";
export { normalizePagePath, canonicalPageUrl, pageIsIndexable, escapeXml, serializeJsonLd } from "./seo-utils.mjs";

type PageSettings = { title?: string; description?: string; indexable?: boolean };
export const seoSettings = {
  ...settings,
  pages: settings.pages as Record<string, PageSettings>
};
