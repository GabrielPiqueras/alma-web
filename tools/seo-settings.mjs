import { readFile, writeFile, readdir, mkdir, rename, stat } from "node:fs/promises";
import { join, relative, dirname } from "node:path";
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { normalizeSiteUrl, normalizePagePath } from "../src/data/seo-utils.mjs";

function object(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} no tiene un formato válido.`);
  return value;
}
function field(value, label, max, required = false) {
  if (typeof value !== "string") throw new Error(`${label} debe ser un texto.`);
  const result = value.trim();
  if ((required && !result) || result.length > max || /[\u0000-\u001f\u007f]/.test(result)) throw new Error(`Revisa ${label}: ${required ? "es obligatorio y " : ""}admite hasta ${max} caracteres en una línea.`);
  return result;
}

export function validateSeoSettings(input) {
  object(input, "La configuración");
  const siteUrl = normalizeSiteUrl(input.siteUrl);
  if (typeof input.indexingEnabled !== "boolean") throw new Error("Elige si permites la indexación.");
  if (input.indexingEnabled && !siteUrl) throw new Error("Configura el dominio real antes de activar la indexación.");
  const rawContact = object(input.contact, "Los datos de contacto");
  const contact = Object.fromEntries(["email", "phone", "city", "streetAddress", "postalCode", "region", "country", "instagram"].map(key => [key, field(rawContact[key], key, 200)]));
  if (contact.email && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(contact.email)) throw new Error("El correo electrónico no es válido.");
  if (contact.phone && !/^\+?[\d\s().-]{5,40}$/.test(contact.phone)) throw new Error("El teléfono no es válido.");
  contact.country = contact.country.toUpperCase();
  if (contact.country && !/^[A-Z]{2}$/.test(contact.country)) throw new Error("El país debe ser un código de dos letras, por ejemplo ES.");
  if (contact.instagram) {
    let username = contact.instagram;
    if (username.startsWith("https://")) {
      const url = new URL(username);
      if (!["instagram.com", "www.instagram.com"].includes(url.hostname) || url.search || url.hash || url.username || url.password) throw new Error("Usa tu usuario o una dirección de Instagram válida.");
      username = url.pathname.replace(/^\/|\/$/g, "");
    }
    username = username.replace(/^@/, "");
    if (!/^[a-zA-Z0-9._]{1,30}$/.test(username)) throw new Error("El usuario de Instagram no es válido.");
    contact.instagram = `@${username}`;
  }
  let verification = field(input.googleSiteVerification, "El código de Search Console", 500);
  if (verification.startsWith("<meta")) verification = verification.match(/\bcontent\s*=\s*["']([^"']+)["']/i)?.[1] ?? verification;
  if (verification && !/^[a-zA-Z0-9_-]{1,256}$/.test(verification)) throw new Error("Introduce el código de verificación HTML de Google (el valor de content).");
  const rawPages = object(input.pages, "Las páginas");
  if (Object.keys(rawPages).length > 500) throw new Error("Hay demasiados ajustes de páginas.");
  const pages = {};
  const seen = new Set();
  for (const [path, value] of Object.entries(rawPages)) {
    if (!/^\/(?:[a-z0-9-]+\/)*[a-z0-9-]*$/.test(path)) throw new Error(`Ruta de página no válida: ${path}`);
    const normalized = normalizePagePath(path);
    if (seen.has(normalized)) throw new Error(`La página ${normalized} está repetida.`);
    seen.add(normalized);
    object(value, `La página ${normalized}`);
    if (typeof value.indexable !== "boolean" && value.indexable !== undefined) throw new Error("La indexación de cada página debe estar activada o desactivada.");
    const title = field(value.title ?? "", `El título de ${normalized}`, 150);
    const description = field(value.description ?? "", `La descripción de ${normalized}`, 500);
    if (title || description || value.indexable === false) pages[normalized] = { ...(title ? { title } : {}), ...(description ? { description } : {}), ...(value.indexable === false ? { indexable: false } : {}) };
  }
  return {
    siteUrl,
    siteName: field(input.siteName, "El nombre de la web", 80, true),
    defaultTitle: field(input.defaultTitle, "El título de Inicio", 150, true),
    defaultDescription: field(input.defaultDescription, "La descripción general", 500, true),
    indexingEnabled: input.indexingEnabled,
    googleSiteVerification: verification,
    contact,
    pages
  };
}

const revisionOf = text => createHash("sha256").update(text).digest("hex");
const decodeHtml = value => value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|#39);/gi, (_, entity) => {
  if (entity[0] === "#") return String.fromCodePoint(parseInt(entity.slice(entity[1]?.toLowerCase() === "x" ? 2 : 1), entity[1]?.toLowerCase() === "x" ? 16 : 10));
  return { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" }[entity.toLowerCase()];
});
async function listFiles(root) {
  let entries;
  try { entries = await readdir(root, { withFileTypes: true }); }
  catch (error) { if (error.code === "ENOENT") return []; throw error; }
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory() && entry.name !== "assets" && entry.name !== "_astro") files.push(...await listFiles(join(root, entry.name)));
    else if (entry.isFile()) files.push(join(root, entry.name));
  }
  return files;
}
export async function readPageCatalog(root) {
  const dist = join(root, "dist");
  const files = (await listFiles(dist)).filter(path => path.endsWith(".html"));
  if (files.length) {
    const pages = await Promise.all(files.map(async path => {
      const html = await readFile(path, "utf8");
      const route = "/" + relative(dist, path).replaceAll("\\", "/").replace(/(?:^|\/)index\.html$/, "");
      const title = decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? route);
      const description = decodeHtml(html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] ?? "");
      return { path: normalizePagePath(route), title, description };
    }));
    return pages.sort((a, b) => a.path.localeCompare(b.path, "es"));
  }
  const src = join(root, "src", "pages");
  return (await listFiles(src)).filter(path => path.endsWith(".astro") && !path.includes("[")).map(path => {
    const route = normalizePagePath("/" + relative(src, path).replaceAll("\\", "/").replace(/(?:^|\/)index\.astro$/, "").replace(/\.astro$/, ""));
    return { path: route, title: route, description: "" };
  }).sort((a, b) => a.path.localeCompare(b.path, "es"));
}

export async function buildSite(root) {
  for (const script of ["tools/sync-assets.mjs", "node_modules/astro/astro.js"]) {
    await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [join(root, script), ...(script.includes("astro.js") ? ["build"] : [])], { cwd: root, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
      let log = "";
      const collect = data => { log = (log + data.toString()).slice(-20000); };
      child.stdout.on("data", collect);
      child.stderr.on("data", collect);
      child.once("error", reject);
      child.once("close", code => code === 0 ? resolve() : reject(new Error(log.replace(/\x1b\[[0-9;]*m/g, "").trim() || `La generación terminó con código ${code}.`)));
    });
  }
}

export function createSeoStore(root, build = buildSite) {
  const settingsPath = join(root, "src", "data", "seo.json");
  const backupPath = join(root, ".alma-editor", "seo-previous.json");
  let busy = false;
  async function read() {
    const source = await readFile(settingsPath, "utf8");
    return { settings: validateSeoSettings(JSON.parse(source)), revision: revisionOf(source) };
  }
  async function state() {
    const current = await read();
    const pages = await readPageCatalog(root);
    const warnings = [];
    if (!current.settings.siteUrl) warnings.push("Falta el dominio público. Las páginas se generan con noindex y el sitemap queda vacío.");
    else if (!current.settings.indexingEnabled) warnings.push("La indexación está desactivada para toda la web.");
    if (!current.settings.contact.city) warnings.push("Añade la ciudad real para completar la información de ALMA.");
    if (!current.settings.contact.email && !current.settings.contact.phone) warnings.push("Faltan el correo y el teléfono de contacto.");
    if (pages.some(page => /\bdemo\b/i.test(page.title + " " + page.description))) warnings.push("Algunas páginas conservan títulos o descripciones de demostración. Puedes personalizarlos en Páginas.");
    let hasBackup = false;
    try { hasBackup = (await stat(backupPath)).isFile(); } catch (error) { if (error.code !== "ENOENT") throw error; }
    return { ...current, pages, warnings, hasBackup, busy };
  }
  async function writeAtomic(path, source) {
    await mkdir(dirname(path), { recursive: true });
    const temp = `${path}.tmp`;
    await writeFile(temp, source, "utf8");
    await rename(temp, path);
  }
  async function apply(input, expectedRevision, restore = false) {
    if (busy) throw Object.assign(new Error("Ya se está generando la web. Espera a que termine."), { statusCode: 409 });
    busy = true;
    let saved = false;
    try {
      const current = await read();
      if (expectedRevision !== current.revision) throw Object.assign(new Error("Los ajustes han cambiado desde que abriste el editor. Recarga los datos antes de guardar."), { statusCode: 409 });
      const settings = validateSeoSettings(restore ? JSON.parse(await readFile(backupPath, "utf8")) : input);
      if (JSON.stringify(settings) !== JSON.stringify(current.settings)) {
        await writeAtomic(backupPath, JSON.stringify(current.settings, null, 2) + "\n");
      }
      await writeAtomic(settingsPath, JSON.stringify(settings, null, 2) + "\n");
      saved = true;
      await build(root);
      return { saved: true, applied: true, ...await state(), busy: false };
    } catch (error) {
      error.statusCode ??= saved ? 422 : 400;
      error.saved = saved;
      if (saved) error.message = `Los ajustes se han guardado, pero la web no se ha podido generar. Corrige el error y vuelve a aplicar, o restaura la configuración anterior.\n${error.message}`;
      throw error;
    } finally { busy = false; }
  }
  return { state, apply, get busy() { return busy; } };
}
