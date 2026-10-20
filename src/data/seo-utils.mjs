/** Normalize one public origin, without credentials, paths or query parameters. */
export function normalizeSiteUrl(value) {
  if (typeof value !== "string") throw new Error("El dominio debe ser un texto.");
  const input = value.trim();
  if (!input) return "";
  let url;
  try { url = new URL(input.includes("://") ? input : `https://${input}`); }
  catch { throw new Error("Introduce un dominio válido, por ejemplo https://tu-dominio.es."); }
  if (url.protocol !== "https:" || url.username || url.password || url.port || url.search || url.hash || url.pathname !== "/") {
    throw new Error("Usa el dominio HTTPS, sin rutas, puertos, contraseñas ni parámetros.");
  }
  if (!url.hostname.includes(".") || /(^|\.)(localhost|local|example|invalid|test)$/.test(url.hostname) || /^(example\.(com|net|org)|[\d.]+)$/.test(url.hostname)) {
    throw new Error("Introduce el dominio público real de ALMA, no una dirección local o de ejemplo.");
  }
  return url.origin;
}

export function normalizePagePath(path) {
  return path.replace(/\/+$/, "") || "/";
}

export function canonicalPageUrl(siteUrl, path) {
  if (!siteUrl) return "";
  const normalized = normalizePagePath(path);
  return `${siteUrl}${normalized === "/" ? "/" : normalized + "/"}`;
}

export function pageIsIndexable(settings, path) {
  return Boolean(settings.siteUrl && settings.indexingEnabled && settings.pages[normalizePagePath(path)]?.indexable !== false);
}

export function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]);
}

export function serializeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
