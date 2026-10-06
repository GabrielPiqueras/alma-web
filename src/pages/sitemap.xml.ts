import type { APIRoute } from "astro";
import { subjects } from "../data/subjects";
import { teachers } from "../data/teachers";

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

export const GET: APIRoute = ({ site }) => {
  const base = site?.toString() ?? "https://alma-demo.example/";
  const urls = [
    ...staticPages.map((page) => new URL(page, base).toString()),
    ...subjects.map((subject) => new URL(`formacion/${subject.slug}`, base).toString()),
    ...teachers.map((teacher) => new URL(`equipo/${teacher.slug}`, base).toString())
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};
