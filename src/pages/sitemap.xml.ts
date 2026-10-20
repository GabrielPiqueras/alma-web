import type { APIRoute } from "astro";
import { subjects } from "../data/subjects";
import { teachers } from "../data/teachers";
import { seoSettings, canonicalPageUrl, pageIsIndexable, escapeXml } from "../data/seo";

const staticPages = [
  "",
  "escuela",
  "formacion",
  "equipo",
  "agencia",
  "proyecto",
  "contacto",
  "portfolio",
  "preguntas-frecuentes",
  "aviso-legal",
  "privacidad"
];

export const GET: APIRoute = () => {
  const paths = [
    ...staticPages.map(page => `/${page}`),
    ...subjects.map(subject => `/formacion/${subject.slug}`),
    ...teachers.map(teacher => `/equipo/${teacher.slug}`)
  ];
  const urls = paths
    .filter(path => pageIsIndexable(seoSettings, path))
    .map(path => canonicalPageUrl(seoSettings.siteUrl, path));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};
