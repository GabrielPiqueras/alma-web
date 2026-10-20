import type { APIRoute } from "astro";
import { seoSettings } from "../data/seo";

export const GET: APIRoute = () => {
  // Allow crawling so Google can read noindex when indexing is disabled.
  const sitemap = seoSettings.siteUrl && seoSettings.indexingEnabled
    ? `\nSitemap: ${seoSettings.siteUrl}/sitemap.xml\n`
    : "";
  return new Response(`User-agent: *\nAllow: /\n${sitemap}`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
};
