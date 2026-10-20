import { createServer } from "node:http";
import { readFile, writeFile, mkdir, readdir, rename, unlink, copyFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { syncImageVersions } from "./image-versions.mjs";
import { saveLogoBuffer, syncLogoVersion } from "./logo-tools.mjs";
import { createSeoStore } from "./seo-settings.mjs";
import { seoStyles, seoMarkup } from "./seo-editor-ui.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(__dirname);
const seoStore = createSeoStore(projectRoot);
const themePath = join(projectRoot, "src", "styles", "theme.css");
const liveThemePath = join(projectRoot, "public", "theme-live.css");
const distLiveThemePath = join(projectRoot, "dist", "theme-live.css");
const imageAssetsPath = join(projectRoot, "public", "assets", "images", "alma");
const distImageAssetsPath = join(projectRoot, "dist", "assets", "images", "alma");
const imageRouteBase = "/assets/images/alma";
const logoFileName = "logo.png";
const oldImagePrefix = "OLD_";
const allowedImageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"]);

const editableColors = [
  { key: "--alma-primary", label: "Color principal", hint: "Controla el vino/burdeos: brillos, fondos, bordes, inputs y acentos derivados." },
  { key: "--alma-secondary", label: "Color secundario", hint: "Controla el champagne/acento: botones, líneas, foco y detalles editoriales. Puede cambiarse libremente." },
  { key: "--alma-dark", label: "Base oscura", hint: "Color madre de fondos, superficies oscuras y navegación." },
  { key: "--alma-light", label: "Texto claro", hint: "Texto principal sobre fondos oscuros y tono marfil de marca." },
  { key: "--alma-paper", label: "Papel claro", hint: "Reserva clara para secciones o futuras variantes de fondo." },
  { key: "--alma-sand", label: "Arena / soporte", hint: "Color de apoyo para placeholders, fondos de imagen y superficies cálidas." },
  { key: "--alma-muted", label: "Texto apagado", hint: "Color auxiliar para detalles y tonos secundarios." }
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readEditableValues(css) {
  return Object.fromEntries(editableColors.map(({ key }) => {
    const pattern = new RegExp(`^\\s*${escapeRegExp(key)}\\s*:\\s*(#[0-9a-fA-F]{6})\\s*;\\s*$`, "m");
    const match = css.match(pattern);
    return [key, match?.[1]?.toLowerCase() ?? "#000000"];
  }));
}

function normalizeHex(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed.toLowerCase();
  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) return `#${trimmed.toLowerCase()}`;
  return null;
}

async function readTheme() {
  if (!existsSync(themePath)) throw new Error(`No encuentro el archivo de tema: ${themePath}`);
  const css = await readFile(themePath, "utf8");
  return { css, values: readEditableValues(css) };
}

function renderLiveCss(values) {
  const lines = [
    "/*",
    "  ALMA live theme overrides.",
    "  Este archivo lo genera tools/theme-editor.mjs al guardar desde el editor visual.",
    "  No lo edites a mano; cambia src/styles/theme.css o usa Editar colores ALMA.bat.",
    "*/",
    "",
    ":root {"
  ];

  for (const color of editableColors) {
    lines.push(`  ${color.key}: ${values[color.key]};`);
  }

  lines.push("}", "");
  return lines.join("\n");
}

async function writeLiveTheme(values) {
  const css = renderLiveCss(values);
  await mkdir(dirname(liveThemePath), { recursive: true });
  await writeFile(liveThemePath, css, "utf8");

  if (existsSync(join(projectRoot, "dist"))) {
    await writeFile(distLiveThemePath, css, "utf8");
    return [liveThemePath, distLiveThemePath];
  }

  return [liveThemePath];
}

async function saveTheme(nextValues) {
  const { css } = await readTheme();
  let nextCss = css;
  const saved = {};

  for (const color of editableColors) {
    const normalized = normalizeHex(nextValues[color.key]);
    if (!normalized) throw new Error(`Valor no válido para ${color.label}: ${nextValues[color.key]}`);

    const pattern = new RegExp(`^(\\s*${escapeRegExp(color.key)}\\s*:\\s*)#[0-9a-fA-F]{6}(\\s*;)\\s*$`, "m");
    if (!pattern.test(nextCss)) throw new Error(`No encuentro la variable ${color.key} en theme.css`);

    nextCss = nextCss.replace(pattern, `$1${normalized}$2`);
    saved[color.key] = normalized;
  }

  await writeFile(themePath, nextCss, "utf8");
  const liveFiles = await writeLiveTheme(saved);
  return { values: saved, liveFiles };
}

function normalizeImageName(fileName, { allowBackup = false } = {}) {
  if (typeof fileName !== "string" || !fileName.trim()) throw new Error("Imagen no válida.");
  const safeName = basename(fileName.trim());
  if (safeName !== fileName.trim()) throw new Error("Nombre de imagen no válido.");

  const isBackup = safeName.startsWith(oldImagePrefix);
  if (isBackup && !allowBackup) throw new Error("No se puede modificar directamente una copia OLD_.");

  const visibleName = isBackup ? safeName.slice(oldImagePrefix.length) : safeName;
  const extension = extname(visibleName).toLowerCase();
  if (!allowedImageExtensions.has(extension)) throw new Error("Formato de imagen no admitido.");

  return safeName;
}

function getImageBackupName(fileName) {
  return `${oldImagePrefix}${fileName}`;
}

function getImagePublicPath(fileName) {
  return join(imageAssetsPath, fileName);
}

function getImageDistPath(fileName) {
  return join(distImageAssetsPath, fileName);
}

function getImageUrl(fileName, modified) {
  const version = modified ? `?v=${Number(modified).toString(36)}` : "";
  return `${imageRouteBase}/${encodeURIComponent(fileName)}${version}`;
}

async function pathExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function readImageInfo(fileName) {
  const safeName = normalizeImageName(fileName);
  const imagePath = getImagePublicPath(safeName);
  const imageStat = await stat(imagePath);
  const backupName = getImageBackupName(safeName);
  const backupPath = getImagePublicPath(backupName);
  const backupExists = await pathExists(backupPath);
  let backup = null;

  if (backupExists) {
    const backupStat = await stat(backupPath);
    backup = {
      fileName: backupName,
      src: getImageUrl(backupName, backupStat.mtimeMs),
      size: backupStat.size,
      modified: backupStat.mtime.toISOString()
    };
  }

  return {
    fileName: safeName,
    src: getImageUrl(safeName, imageStat.mtimeMs),
    cleanSrc: `${imageRouteBase}/${safeName}`,
    size: imageStat.size,
    modified: imageStat.mtime.toISOString(),
    extension: extname(safeName).toLowerCase(),
    backup
  };
}

async function listImages() {
  await mkdir(imageAssetsPath, { recursive: true });
  await syncImageVersions();
  const entries = await readdir(imageAssetsPath, { withFileTypes: true });
  const imageNames = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith(oldImagePrefix))
    .filter((name) => allowedImageExtensions.has(extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "es"));

  return Promise.all(imageNames.map((name) => readImageInfo(name)));
}

async function syncImageToDist(fileName) {
  if (!existsSync(join(projectRoot, "dist"))) return;
  await mkdir(distImageAssetsPath, { recursive: true });
  const sourcePath = getImagePublicPath(fileName);
  const targetPath = getImageDistPath(fileName);

  if (await pathExists(sourcePath)) {
    await copyFile(sourcePath, targetPath);
  } else if (await pathExists(targetPath)) {
    await unlink(targetPath);
  }
}

async function applyImage(fileName, buffer) {
  const safeName = normalizeImageName(fileName);
  if (!buffer?.length) throw new Error("No se ha recibido ninguna imagen.");

  await mkdir(imageAssetsPath, { recursive: true });
  const imagePath = getImagePublicPath(safeName);
  const backupName = getImageBackupName(safeName);
  const backupPath = getImagePublicPath(backupName);

  if (!(await pathExists(imagePath))) throw new Error(`No existe la imagen ${safeName}.`);

  const hadBackup = await pathExists(backupPath);
  let movedToBackup = false;

  if (!hadBackup) {
    await rename(imagePath, backupPath);
    movedToBackup = true;
  }

  try {
    await writeFile(imagePath, buffer);
  } catch (error) {
    if (movedToBackup && !(await pathExists(imagePath))) await rename(backupPath, imagePath);
    throw error;
  }

  await syncImageToDist(safeName);
  await syncImageToDist(backupName);
  await syncImageVersions();
  return readImageInfo(safeName);
}

async function confirmImage(fileName) {
  const safeName = normalizeImageName(fileName);
  const backupName = getImageBackupName(safeName);
  const backupPath = getImagePublicPath(backupName);

  if (await pathExists(backupPath)) await unlink(backupPath);
  await syncImageToDist(backupName);
  await syncImageVersions();
  return readImageInfo(safeName);
}

async function restoreImage(fileName) {
  const safeName = normalizeImageName(fileName);
  const imagePath = getImagePublicPath(safeName);
  const backupName = getImageBackupName(safeName);
  const backupPath = getImagePublicPath(backupName);

  if (!(await pathExists(backupPath))) throw new Error(`No hay copia OLD_ para ${safeName}.`);
  if (await pathExists(imagePath)) await unlink(imagePath);
  await rename(backupPath, imagePath);

  await syncImageToDist(safeName);
  await syncImageToDist(backupName);
  await syncImageVersions();
  return readImageInfo(safeName);
}

async function readLogoInfo() {
  await mkdir(imageAssetsPath, { recursive: true });
  await syncLogoVersion();
  if (!(await pathExists(getImagePublicPath(logoFileName)))) {
    return { fileName: logoFileName, src: "", cleanSrc: `${imageRouteBase}/${logoFileName}`, backup: null };
  }

  return readImageInfo(logoFileName);
}

async function applyLogo(buffer) {
  if (!buffer?.length) throw new Error("No se ha recibido ningún logo.");

  await mkdir(imageAssetsPath, { recursive: true });
  const logoPath = getImagePublicPath(logoFileName);
  const backupName = getImageBackupName(logoFileName);
  const backupPath = getImagePublicPath(backupName);
  const hadLogo = await pathExists(logoPath);
  const hadBackup = await pathExists(backupPath);

  if (hadLogo && !hadBackup) {
    await copyFile(logoPath, backupPath);
  }

  await saveLogoBuffer(buffer);
  await syncImageToDist(logoFileName);
  await syncImageToDist(backupName);
  await syncImageVersions();
  return readLogoInfo();
}

async function confirmLogo() {
  const backupName = getImageBackupName(logoFileName);
  const backupPath = getImagePublicPath(backupName);

  if (await pathExists(backupPath)) await unlink(backupPath);
  await syncImageToDist(backupName);
  await syncLogoVersion();
  await syncImageVersions();
  return readLogoInfo();
}

async function restoreLogo() {
  const logoPath = getImagePublicPath(logoFileName);
  const backupName = getImageBackupName(logoFileName);
  const backupPath = getImagePublicPath(backupName);

  if (!(await pathExists(backupPath))) throw new Error("No hay copia OLD_ del logo para restaurar.");
  if (await pathExists(logoPath)) await unlink(logoPath);
  await rename(backupPath, logoPath);

  await syncImageToDist(logoFileName);
  await syncImageToDist(backupName);
  await syncLogoVersion();
  await syncImageVersions();
  return readLogoInfo();
}

function getImageContentType(fileName) {
  const extension = extname(fileName).toLowerCase();
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  if (extension === ".avif") return "image/avif";
  if (extension === ".gif") return "image/gif";
  if (extension === ".svg") return "image/svg+xml";
  return "application/octet-stream";
}

async function sendImageAsset(response, fileName) {
  const safeName = normalizeImageName(fileName, { allowBackup: true });
  const imagePath = getImagePublicPath(safeName);
  if (!(await pathExists(imagePath))) return sendJson(response, 404, { error: "Imagen no encontrada." });

  const buffer = await readFile(imagePath);
  response.writeHead(200, {
    "Content-Type": getImageContentType(safeName),
    "Cache-Control": "no-store"
  });
  response.end(buffer);
}

function readRequestBody(request, maxBytes = 1024 * 1024 * 24) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;

    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        request.destroy();
        reject(new Error("La imagen es demasiado grande."));
        return;
      }
      chunks.push(chunk);
    });

    request.on("end", () => resolve(Buffer.concat(chunks)));
    request.on("error", reject);
  });
}

async function readJsonBody(request) {
  const buffer = await readRequestBody(request, 1024 * 64);
  return JSON.parse(buffer.toString("utf8") || "{}");
}

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(body));
}

function sendHtml(response) {
  response.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
  response.end(renderHtml());
}

function renderHtml() {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ALMA · Editor visual</title>
  <style>
    :root {
      --ui-primary: #7d1f2c;
      --ui-secondary: #b99562;
      --ui-dark: #171414;
      --ui-light: #f5efe3;
      --ui-paper: #fbf8f1;
      --ui-sand: #d9cbb7;
      --ui-muted: #747365;
      --ui-surface: color-mix(in srgb, var(--ui-dark) 84%, var(--ui-primary));
      --ui-input: color-mix(in srgb, var(--ui-dark) 86%, var(--ui-primary));
      --ui-line: color-mix(in srgb, var(--ui-light) 14%, transparent);
      color-scheme: dark;
    }
    * { box-sizing: border-box; }
    [hidden] { display: none !important; }
    body {
      margin: 0;
      min-width: 320px;
      background: radial-gradient(circle at 15% 12%, color-mix(in srgb, var(--ui-primary) 24%, transparent), transparent 30rem), radial-gradient(circle at 88% 35%, color-mix(in srgb, var(--ui-secondary) 14%, transparent), transparent 26rem), #100c0d;
      color: var(--ui-light);
      font-family: Manrope, Inter, system-ui, sans-serif;
      line-height: 1.55;
    }
    main { width: min(1180px, calc(100% - 2rem)); margin: 0 auto; padding: 4rem 0; }
    .hero { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 3rem; align-items: end; margin-bottom: 2rem; border-bottom: 1px solid var(--ui-line); padding-bottom: 2rem; }
    .brand { margin: 0 0 1rem; color: var(--ui-secondary); font-size: 0.78rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; }
    h1 { margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(3.2rem, 9vw, 7rem); font-weight: 400; line-height: 0.9; }
    .intro { max-width: 34rem; color: color-mix(in srgb, var(--ui-light) 72%, transparent); font-size: 1.05rem; }
    .tabs { display: flex; gap: 0.6rem; margin: 0 0 1rem; border-bottom: 1px solid var(--ui-line); padding-bottom: 1rem; }
    .tab-button { border-color: var(--ui-line); background: rgba(0, 0, 0, 0.18); color: var(--ui-light); }
    .tab-button.is-active { border-color: var(--ui-secondary); background: var(--ui-secondary); color: var(--ui-dark); }
    .layout { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(22rem, 0.6fr); gap: 1.2rem; align-items: start; }
    .panel, .preview { border: 1px solid var(--ui-line); background: radial-gradient(circle at 85% 10%, color-mix(in srgb, var(--ui-primary) 18%, transparent), transparent 16rem), var(--ui-surface); box-shadow: 0 24px 80px rgba(0, 0, 0, 0.24); }
    .panel { padding: 1.2rem; }
    .preview { position: sticky; top: 1rem; overflow: hidden; }
    .color-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.9rem; }
    .field { display: grid; gap: 0.55rem; border: 1px solid var(--ui-line); background: rgba(0, 0, 0, 0.14); padding: 0.9rem; }
    .field header { display: flex; justify-content: space-between; gap: 0.75rem; align-items: baseline; }
    label { font-weight: 800; color: var(--ui-light); }
    code { color: color-mix(in srgb, var(--ui-secondary) 86%, var(--ui-light)); font-size: 0.78rem; }
    .hint { min-height: 2.8rem; margin: 0; color: color-mix(in srgb, var(--ui-light) 58%, transparent); font-size: 0.84rem; }
    .controls { display: grid; grid-template-columns: 4rem 1fr; gap: 0.6rem; }
    input[type="color"] { width: 100%; height: 3.2rem; border: 1px solid var(--ui-line); background: transparent; cursor: pointer; }
    input[type="text"] { min-height: 3.2rem; width: 100%; border: 1px solid var(--ui-line); background: var(--ui-input); color: var(--ui-light); padding: 0 0.9rem; font: inherit; font-weight: 800; }
    input:focus-visible, button:focus-visible, a:focus-visible { outline: 2px solid var(--ui-secondary); outline-offset: 3px; }
    .actions { display: flex; flex-wrap: wrap; gap: 0.8rem; align-items: center; margin-top: 1.1rem; }
    button, .link-button { min-height: 3rem; border: 1px solid var(--ui-secondary); background: var(--ui-secondary); color: var(--ui-dark); padding: 0 1rem; font: inherit; font-weight: 900; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; }
    button.secondary { background: transparent; color: var(--ui-light); border-color: var(--ui-line); }
    .status { min-height: 1.5rem; color: var(--ui-secondary); font-weight: 800; }
    .suggestion { display: grid; gap: 0.7rem; margin-top: 1rem; border: 1px solid var(--ui-line); background: rgba(0, 0, 0, 0.16); padding: 1rem; }
    .suggestion-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; justify-content: space-between; }
    .suggestion-swatch { width: 3.3rem; height: 2rem; border: 1px solid var(--ui-line); background: var(--suggested-secondary, var(--ui-secondary)); }
    .suggestion p { margin: 0; color: color-mix(in srgb, var(--ui-light) 66%, transparent); }
    .preview-image { min-height: 16rem; background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.34)), radial-gradient(circle at 50% 25%, color-mix(in srgb, var(--ui-primary) 28%, transparent), transparent 14rem), color-mix(in srgb, var(--ui-dark) 82%, var(--ui-secondary)); display: grid; align-items: end; padding: 1.2rem; }
    .preview h2 { margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 3.5rem; font-weight: 400; line-height: 0.95; }
    .preview-body { padding: 1.2rem; }
    .preview p { color: color-mix(in srgb, var(--ui-light) 68%, transparent); }
    .chips { display: flex; flex-wrap: wrap; gap: 0.55rem; margin-top: 1rem; }
    .chip { border: 1px solid var(--ui-line); background: color-mix(in srgb, var(--ui-primary) 22%, var(--ui-dark)); padding: 0.5rem 0.65rem; color: var(--ui-light); font-size: 0.82rem; font-weight: 800; }
    .swatches { display: grid; grid-template-columns: repeat(7, 1fr); height: 4rem; border-top: 1px solid var(--ui-line); }
    .swatches span:nth-child(1) { background: var(--ui-primary); }
    .swatches span:nth-child(2) { background: var(--ui-secondary); }
    .swatches span:nth-child(3) { background: var(--ui-dark); }
    .swatches span:nth-child(4) { background: var(--ui-light); }
    .swatches span:nth-child(5) { background: var(--ui-paper); }
    .swatches span:nth-child(6) { background: var(--ui-sand); }
    .swatches span:nth-child(7) { background: var(--ui-muted); }
    .note { margin-top: 1rem; color: color-mix(in srgb, var(--ui-light) 58%, transparent); font-size: 0.9rem; }
    .image-toolbar { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.8rem; margin-bottom: 1rem; }
    .image-toolbar h2 { margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(2rem, 5vw, 3.6rem); font-weight: 400; line-height: 0.95; }
    .image-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
    .image-card { border: 1px solid var(--ui-line); background: rgba(0, 0, 0, 0.16); padding: 0.85rem; display: grid; gap: 0.85rem; }
    .image-card.has-backup { border-color: color-mix(in srgb, var(--ui-secondary) 62%, var(--ui-line)); }
    .image-frame { width: 100%; aspect-ratio: 4 / 3; background: color-mix(in srgb, var(--ui-dark) 72%, var(--ui-sand)); overflow: hidden; border: 1px solid var(--ui-line); }
    .image-frame img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .image-old { display: grid; grid-template-columns: 5rem 1fr; align-items: center; gap: 0.7rem; border: 1px solid var(--ui-line); padding: 0.5rem; background: rgba(0, 0, 0, 0.2); }
    .image-old .image-frame { aspect-ratio: 1 / 1; }
    .image-old strong { display: block; color: var(--ui-secondary); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; }
    .image-meta { display: grid; gap: 0.2rem; }
    .image-meta h3 { margin: 0; font-size: 1rem; overflow-wrap: anywhere; }
    .image-meta p { margin: 0; color: color-mix(in srgb, var(--ui-light) 60%, transparent); font-size: 0.84rem; }
    .image-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.55rem; }
    .image-actions button { width: 100%; padding-inline: 0.7rem; }
    .image-actions .wide { grid-column: 1 / -1; }
    .selected-file { min-height: 1.3rem; margin: 0; color: color-mix(in srgb, var(--ui-secondary) 84%, var(--ui-light)); font-size: 0.84rem; overflow-wrap: anywhere; }
    .empty-state { border: 1px solid var(--ui-line); padding: 1rem; color: color-mix(in srgb, var(--ui-light) 66%, transparent); }
    .logo-panel { display: grid; grid-template-columns: minmax(0, 1fr) minmax(20rem, 0.7fr); gap: 1rem; align-items: start; }
    .logo-preview { border: 1px solid var(--ui-line); background: #151112; padding: 1rem; display: grid; gap: 1rem; }
    .logo-stage { min-height: 15rem; display: grid; place-items: center; border: 1px solid var(--ui-line); background: radial-gradient(circle at 50% 25%, color-mix(in srgb, var(--ui-primary) 20%, transparent), transparent 16rem), #100c0d; padding: 1.2rem; }
    .logo-stage img { display: block; width: min(100%, 34rem); height: auto; object-fit: contain; }
    .logo-mini-row { display: grid; grid-template-columns: 9rem 1fr; gap: 1rem; align-items: center; }
    .logo-mini { min-height: 5rem; display: grid; place-items: center; border: 1px solid var(--ui-line); background: #100c0d; padding: 0.8rem; }
    .logo-mini img { display: block; max-width: 100%; max-height: 4rem; object-fit: contain; }
    .logo-copy { display: grid; gap: 0.7rem; }
    .logo-copy h2 { margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(2.3rem, 6vw, 4.2rem); font-weight: 400; line-height: 0.95; }
    .logo-copy p { margin: 0; color: color-mix(in srgb, var(--ui-light) 68%, transparent); }
    @media (max-width: 880px) { .hero, .layout, .color-grid, .image-grid { grid-template-columns: 1fr; } .preview { position: static; } }
    @media (max-width: 880px) { .logo-panel { grid-template-columns: 1fr; } }
    ${seoStyles}
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <div>
        <p class="brand">ALMA / Editor visual</p>
        <h1>Ajustes del proyecto</h1>
      </div>
      <p class="intro">Gestiona la paleta, las imágenes, el logo y el SEO de ALMA desde una herramienta visual. Los cambios se escriben directamente en los archivos del proyecto.</p>
    </section>

    <nav class="tabs" aria-label="Secciones del editor">
      <button class="tab-button is-active" type="button" data-tab="colors">Colores</button>
      <button class="tab-button" type="button" data-tab="images">Imágenes</button>
      <button class="tab-button" type="button" data-tab="logo">Logo</button>
      <button class="tab-button" type="button" data-tab="seo">SEO y datos</button>
      <a class="link-button" href="http://127.0.0.1:4321/" target="_blank" rel="noreferrer">Abrir web</a>
    </nav>

    <section class="layout" id="tab-colors">
      <form class="panel" id="theme-form">
        <div class="color-grid" id="fields"></div>
        <section class="suggestion" id="secondary-suggestion">
          <div class="suggestion-row">
            <div>
              <strong>Secundario sugerido</strong>
              <p>Al cambiar el primario, ALMA propone un acento cálido para conservar la coherencia editorial. Puedes ignorarlo y elegir el secundario libremente.</p>
            </div>
            <span class="suggestion-swatch" id="suggestion-swatch" aria-hidden="true"></span>
          </div>
          <div class="suggestion-row">
            <code id="suggestion-value">#b99562</code>
            <button class="secondary" type="button" id="apply-suggestion">Usar secundario sugerido</button>
          </div>
        </section>
        <div class="actions">
          <button type="submit">Guardar colores</button>
          <button class="secondary" type="button" id="reload">Recargar archivo</button>
        </div>
        <p class="status" id="status" role="status" aria-live="polite"></p>
        <p class="note">Si la web estaba abierta, recarga la pestaña tras guardar. El editor actualiza <code>public/theme-live.css</code> y, si existe, <code>dist/theme-live.css</code>.</p>
      </form>

      <aside class="preview" aria-label="Vista previa aproximada">
        <div class="preview-image"><div><p class="brand">ALMA / Escuela & Agencia</p><h2>Tu imagen cuenta una historia.</h2></div></div>
        <div class="preview-body"><p>Vista previa rápida de la dirección visual. La web real aplica además variables derivadas para fondos, bordes y estados.</p><div class="chips"><span class="chip">Formación</span><span class="chip">Imagen</span><span class="chip">Talento</span></div></div>
        <div class="swatches" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
      </aside>
    </section>

    <section class="panel" id="tab-images" hidden>
      <div class="image-toolbar">
        <div>
          <p class="brand">ALMA / Imágenes locales</p>
          <h2>Imágenes</h2>
        </div>
        <button class="secondary" type="button" id="image-reload">Recargar imágenes</button>
      </div>
      <div class="image-grid" id="image-grid"></div>
      <p class="status" id="image-status" role="status" aria-live="polite"></p>
      <p class="note">Al aplicar una imagen, la anterior queda guardada como <code>OLD_nombre.ext</code>. Confirmar borra esa copia; restaurar recupera la anterior.</p>
    </section>

    <section class="panel" id="tab-logo" hidden>
      <div class="logo-panel">
        <div class="logo-copy">
          <p class="brand">ALMA / Logo</p>
          <h2>Marca principal</h2>
          <p>Este logo se usa en la cabecera, el menú móvil, el pie y el gran bloque ALMA del inicio. Al aplicar un logo nuevo, el anterior queda como <code>OLD_logo.png</code> hasta que confirmes o restaures.</p>
          <input type="file" accept="image/*" hidden id="logo-file">
          <p class="selected-file" id="logo-selected" aria-live="polite"></p>
          <div class="actions">
            <button class="secondary" type="button" id="logo-choose">Cambiar logo</button>
            <button type="button" id="logo-apply" disabled>Aplicar</button>
            <button class="secondary" type="button" id="logo-confirm" disabled>Confirmar</button>
            <button class="secondary" type="button" id="logo-restore" disabled>Restaurar</button>
          </div>
          <p class="status" id="logo-status" role="status" aria-live="polite"></p>
        </div>
        <div class="logo-preview">
          <div class="logo-stage"><img id="logo-preview-main" alt="Logo ALMA actual"></div>
          <div class="logo-mini-row">
            <div class="logo-mini"><img id="logo-preview-mini" alt=""></div>
            <div>
              <strong id="logo-name">logo.png</strong>
              <p class="note" id="logo-path">/assets/images/alma/logo.png</p>
            </div>
          </div>
          <div class="image-old" id="logo-old" hidden>
            <div class="image-frame"><img id="logo-old-image" alt="Logo anterior de ALMA"></div>
            <div><strong>Anterior disponible</strong><p>OLD_logo.png</p></div>
          </div>
        </div>
      </div>
    </section>
    ${seoMarkup}
  </main>
  <script type="module" src="/seo-editor.js"></script>

  <script>
    const fields = ${JSON.stringify(editableColors)};
    const fieldContainer = document.querySelector('#fields');
    const form = document.querySelector('#theme-form');
    const status = document.querySelector('#status');
    const reloadButton = document.querySelector('#reload');
    const applySuggestionButton = document.querySelector('#apply-suggestion');
    const suggestionValue = document.querySelector('#suggestion-value');
    const suggestionSwatch = document.querySelector('#suggestion-swatch');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabColors = document.querySelector('#tab-colors');
    const tabImages = document.querySelector('#tab-images');
    const tabLogo = document.querySelector('#tab-logo');
    const imageGrid = document.querySelector('#image-grid');
    const imageStatus = document.querySelector('#image-status');
    const imageReloadButton = document.querySelector('#image-reload');
    const selectedImages = new Map();
    const logoFileInput = document.querySelector('#logo-file');
    const logoChooseButton = document.querySelector('#logo-choose');
    const logoApplyButton = document.querySelector('#logo-apply');
    const logoConfirmButton = document.querySelector('#logo-confirm');
    const logoRestoreButton = document.querySelector('#logo-restore');
    const logoSelected = document.querySelector('#logo-selected');
    const logoStatus = document.querySelector('#logo-status');
    const logoPreviewMain = document.querySelector('#logo-preview-main');
    const logoPreviewMini = document.querySelector('#logo-preview-mini');
    const logoOld = document.querySelector('#logo-old');
    const logoOldImage = document.querySelector('#logo-old-image');
    const logoName = document.querySelector('#logo-name');
    const logoPath = document.querySelector('#logo-path');
    let selectedLogoFile = null;

    const cssVarMap = {
      '--alma-primary': '--ui-primary',
      '--alma-secondary': '--ui-secondary',
      '--alma-dark': '--ui-dark',
      '--alma-light': '--ui-light',
      '--alma-paper': '--ui-paper',
      '--alma-sand': '--ui-sand',
      '--alma-muted': '--ui-muted'
    };

    function activateTab(tab) {
      tabButtons.forEach((button) => button.classList.toggle('is-active', button.dataset.tab === tab));
      tabColors.hidden = tab !== 'colors';
      tabImages.hidden = tab !== 'images';
      tabLogo.hidden = tab !== 'logo';
      document.querySelector('#tab-seo').hidden = tab !== 'seo';
      if (tab === 'images') loadImages().catch((error) => { imageStatus.textContent = error.message; });
      if (tab === 'logo') loadLogo().catch((error) => { logoStatus.textContent = error.message; });
    }

    function setPreviewValue(key, value) {
      document.documentElement.style.setProperty(cssVarMap[key], value);
    }

    function hexToRgb(hex) {
      const clean = hex.replace('#', '');
      return { r: parseInt(clean.slice(0, 2), 16), g: parseInt(clean.slice(2, 4), 16), b: parseInt(clean.slice(4, 6), 16) };
    }

    function rgbToHex(r, g, b) {
      return '#' + [r, g, b].map((value) => Math.round(Math.max(0, Math.min(255, value))).toString(16).padStart(2, '0')).join('');
    }

    function rgbToHsl(r, g, b) {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h = 0, s = 0;
      const l = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
        if (max === g) h = (b - r) / d + 2;
        if (max === b) h = (r - g) / d + 4;
        h *= 60;
      }
      return { h, s: s * 100, l: l * 100 };
    }

    function hslToRgb(h, s, l) {
      s /= 100; l /= 100;
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = l - c / 2;
      let r = 0, g = 0, b = 0;
      if (h < 60) [r, g, b] = [c, x, 0];
      else if (h < 120) [r, g, b] = [x, c, 0];
      else if (h < 180) [r, g, b] = [0, c, x];
      else if (h < 240) [r, g, b] = [0, x, c];
      else if (h < 300) [r, g, b] = [x, 0, c];
      else [r, g, b] = [c, 0, x];
      return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
    }

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function suggestSecondary(primary) {
      if (!/^#[0-9a-fA-F]{6}$/.test(primary)) return '#b99562';
      const rgb = hexToRgb(primary);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const nextHue = (hsl.h + 42 + 360) % 360;
      const nextSaturation = clamp(hsl.s * 0.58, 30, 52);
      const nextLightness = clamp(hsl.l * 1.68, 48, 66);
      const suggested = hslToRgb(nextHue, nextSaturation, nextLightness);
      return rgbToHex(suggested.r, suggested.g, suggested.b);
    }

    function updateSuggestion(primary) {
      const suggested = suggestSecondary(primary);
      suggestionValue.textContent = suggested;
      suggestionSwatch.style.setProperty('--suggested-secondary', suggested);
      return suggested;
    }

    function setFieldValue(key, value) {
      const colorInput = document.querySelector('input[name="' + key + '"]');
      const textInput = document.querySelector('input[data-key="' + key + '"]');
      if (colorInput) colorInput.value = value;
      if (textInput) textInput.value = value;
      setPreviewValue(key, value);
      if (key === '--alma-primary') updateSuggestion(value);
    }

    function renderFields(values) {
      fieldContainer.innerHTML = '';
      for (const field of fields) {
        const value = values[field.key] || '#000000';
        const id = field.key.replace(/^--/, '');
        const wrapper = document.createElement('section');
        wrapper.className = 'field';
        wrapper.innerHTML = [
          '<header>',
          '<label for="' + id + '-text">' + field.label + '</label>',
          '<code>' + field.key + '</code>',
          '</header>',
          '<p class="hint">' + field.hint + '</p>',
          '<div class="controls">',
          '<input id="' + id + '-color" type="color" value="' + value + '" aria-label="' + field.label + '" />',
          '<input id="' + id + '-text" type="text" value="' + value + '" inputmode="text" spellcheck="false" data-key="' + field.key + '" />',
          '</div>'
        ].join('');

        const colorInput = wrapper.querySelector('#' + id + '-color');
        const textInput = wrapper.querySelector('#' + id + '-text');
        colorInput.name = field.key;

        colorInput.addEventListener('input', () => setFieldValue(field.key, colorInput.value));
        textInput.addEventListener('input', () => {
          const next = textInput.value.trim();
          if (/^#[0-9a-fA-F]{6}$/.test(next)) setFieldValue(field.key, next.toLowerCase());
        });

        fieldContainer.append(wrapper);
        setPreviewValue(field.key, value);
      }
      updateSuggestion(values['--alma-primary'] || '#7d1f2c');
    }

    async function loadTheme() {
      status.textContent = 'Cargando colores...';
      const response = await fetch('/api/theme', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo leer theme.css');
      renderFields(data.values);
      status.textContent = 'Colores cargados desde theme.css.';
    }

    function collectValues() {
      const values = {};
      for (const field of fields) {
        const input = document.querySelector('input[name="' + field.key + '"]');
        values[field.key] = input.value;
      }
      return values;
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
    }

    function formatBytes(bytes) {
      if (!Number.isFinite(bytes)) return '';
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }

    function renderImages(images) {
      selectedImages.clear();
      imageGrid.innerHTML = '';

      if (!images.length) {
        imageGrid.innerHTML = '<div class="empty-state">No hay imágenes en la carpeta local.</div>';
        return;
      }

      for (const image of images) {
        const card = document.createElement('article');
        card.className = 'image-card' + (image.backup ? ' has-backup' : '');
        const safeName = escapeHtml(image.fileName);
        const oldBlock = image.backup
          ? '<div class="image-old"><div class="image-frame"><img src="' + image.backup.src + '" alt="Imagen anterior de ' + safeName + '"></div><div><strong>Anterior disponible</strong><p>' + escapeHtml(image.backup.fileName) + '</p></div></div>'
          : '';

        card.innerHTML = [
          '<div class="image-frame"><img src="' + image.src + '" alt="' + safeName + '"></div>',
          '<div class="image-meta"><h3>' + safeName + '</h3><p>' + escapeHtml(image.cleanSrc) + '</p><p>' + formatBytes(image.size) + ' · ' + escapeHtml(image.extension) + '</p></div>',
          oldBlock,
          '<input type="file" accept="image/*" hidden>',
          '<p class="selected-file" aria-live="polite"></p>',
          '<div class="image-actions">',
          '<button class="secondary choose-image" type="button">Cambiar imagen</button>',
          '<button class="apply-image" type="button" disabled>Aplicar</button>',
          '<button class="secondary confirm-image" type="button"' + (image.backup ? '' : ' disabled') + '>Confirmar</button>',
          '<button class="secondary restore-image" type="button"' + (image.backup ? '' : ' disabled') + '>Restaurar</button>',
          '</div>'
        ].join('');

        const fileInput = card.querySelector('input[type="file"]');
        const selectedFileLabel = card.querySelector('.selected-file');
        const applyButton = card.querySelector('.apply-image');

        card.querySelector('.choose-image').addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', () => {
          const file = fileInput.files && fileInput.files[0];
          if (!file) return;
          selectedImages.set(image.fileName, file);
          selectedFileLabel.textContent = file.name;
          applyButton.disabled = false;
        });

        applyButton.addEventListener('click', () => applySelectedImage(image.fileName));
        card.querySelector('.confirm-image').addEventListener('click', () => postImageAction('/api/images/confirm', image.fileName));
        card.querySelector('.restore-image').addEventListener('click', () => postImageAction('/api/images/restore', image.fileName));

        imageGrid.append(card);
      }
    }

    async function loadImages() {
      imageStatus.textContent = 'Cargando imágenes...';
      const response = await fetch('/api/images', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudieron leer las imágenes.');
      renderImages(data.images);
      imageStatus.textContent = 'Imágenes cargadas desde la carpeta local.';
    }

    async function applySelectedImage(fileName) {
      const file = selectedImages.get(fileName);
      if (!file) {
        imageStatus.textContent = 'Elige una imagen antes de aplicar.';
        return;
      }

      imageStatus.textContent = 'Aplicando imagen...';
      const response = await fetch('/api/images/apply?fileName=' + encodeURIComponent(fileName), {
        method: 'POST',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: await file.arrayBuffer()
      });
      const data = await response.json();
      if (!response.ok) {
        imageStatus.textContent = data.error || 'No se pudo aplicar la imagen.';
        return;
      }
      await loadImages();
      imageStatus.textContent = 'Imagen aplicada. La anterior queda disponible para confirmar o restaurar.';
    }

    async function postImageAction(path, fileName) {
      imageStatus.textContent = 'Actualizando imagen...';
      const response = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName })
      });
      const data = await response.json();
      if (!response.ok) {
        imageStatus.textContent = data.error || 'No se pudo completar la acción.';
        return;
      }
      await loadImages();
      imageStatus.textContent = path.endsWith('/restore') ? 'Imagen restaurada.' : 'Cambio confirmado.';
    }

    function renderLogo(logo) {
      const src = logo.src || logo.cleanSrc || '/assets/images/alma/logo.png';
      logoPreviewMain.src = src;
      logoPreviewMini.src = src;
      logoName.textContent = logo.fileName || 'logo.png';
      logoPath.textContent = logo.cleanSrc || '/assets/images/alma/logo.png';
      logoConfirmButton.disabled = !logo.backup;
      logoRestoreButton.disabled = !logo.backup;

      if (logo.backup) {
        logoOld.hidden = false;
        logoOldImage.src = logo.backup.src;
      } else {
        logoOld.hidden = true;
        logoOldImage.removeAttribute('src');
      }
    }

    async function loadLogo() {
      logoStatus.textContent = 'Cargando logo...';
      const response = await fetch('/api/logo', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo leer el logo.');
      renderLogo(data.logo);
      logoStatus.textContent = 'Logo cargado.';
    }

    async function applyLogo() {
      if (!selectedLogoFile) {
        logoStatus.textContent = 'Elige un logo antes de aplicar.';
        return;
      }

      logoStatus.textContent = 'Aplicando logo...';
      const response = await fetch('/api/logo/apply', {
        method: 'POST',
        headers: { 'Content-Type': selectedLogoFile.type || 'application/octet-stream' },
        body: await selectedLogoFile.arrayBuffer()
      });
      const data = await response.json();
      if (!response.ok) {
        logoStatus.textContent = data.error || 'No se pudo aplicar el logo.';
        return;
      }
      selectedLogoFile = null;
      logoFileInput.value = '';
      logoSelected.textContent = '';
      logoApplyButton.disabled = true;
      renderLogo(data.logo);
      logoStatus.textContent = 'Logo aplicado. Recarga la web para verlo.';
    }

    async function postLogoAction(path) {
      logoStatus.textContent = 'Actualizando logo...';
      const response = await fetch(path, { method: 'POST' });
      const data = await response.json();
      if (!response.ok) {
        logoStatus.textContent = data.error || 'No se pudo completar la acción.';
        return;
      }
      renderLogo(data.logo);
      logoStatus.textContent = path.endsWith('/restore') ? 'Logo restaurado.' : 'Cambio de logo confirmado.';
    }

    tabButtons.forEach((button) => {
      button.addEventListener('click', () => activateTab(button.dataset.tab));
    });

    applySuggestionButton.addEventListener('click', () => {
      setFieldValue('--alma-secondary', suggestionValue.textContent.trim());
      status.textContent = 'Secundario sugerido aplicado. Pulsa Guardar colores para escribirlo en el archivo.';
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      status.textContent = 'Guardando...';
      const response = await fetch('/api/theme', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ values: collectValues() }) });
      const data = await response.json();
      if (!response.ok) {
        status.textContent = data.error || 'No se pudo guardar.';
        return;
      }
      renderFields(data.values);
      status.textContent = 'Guardado. Se actualizaron theme.css y el tema vivo de la web.';
    });

    reloadButton.addEventListener('click', () => loadTheme().catch((error) => { status.textContent = error.message; }));
    imageReloadButton.addEventListener('click', () => loadImages().catch((error) => { imageStatus.textContent = error.message; }));
    logoChooseButton.addEventListener('click', () => logoFileInput.click());
    logoFileInput.addEventListener('change', () => {
      const file = logoFileInput.files && logoFileInput.files[0];
      if (!file) return;
      selectedLogoFile = file;
      logoSelected.textContent = file.name;
      logoApplyButton.disabled = false;
    });
    logoApplyButton.addEventListener('click', () => applyLogo());
    logoConfirmButton.addEventListener('click', () => postLogoAction('/api/logo/confirm'));
    logoRestoreButton.addEventListener('click', () => postLogoAction('/api/logo/restore'));
    loadTheme().catch((error) => { status.textContent = error.message; });
  </script>
</body>
</html>`;
}

const server = createServer(async (request, response) => {
  try {
    const host = request.headers.host;
    const allowedHosts = [`127.0.0.1:${request.socket.localPort}`, `localhost:${request.socket.localPort}`];
    if (!allowedHosts.includes(host) || (request.headers.origin && request.headers.origin !== `http://${host}`)) {
      return sendJson(response, 403, { error: "Abre el editor desde su dirección local." });
    }
    const url = new URL(request.url ?? "/", `http://${host}`);
    if (seoStore.busy && request.method === "POST") return sendJson(response, 409, { error: "Espera a que termine la generación de la web." });
    if (request.method === "GET" && url.pathname === "/seo-editor.js") {
      response.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-store" });
      return response.end(await readFile(join(__dirname, "seo-editor-client.mjs"), "utf8"));
    }
    if (request.method === "GET" && url.pathname === "/api/seo") return sendJson(response, 200, await seoStore.state());
    if (request.method === "POST" && ["/api/seo/apply", "/api/seo/restore"].includes(url.pathname)) {
      if (!request.headers["content-type"]?.startsWith("application/json")) return sendJson(response, 415, { error: "Se esperaba una configuración JSON." });
      try {
        const data = JSON.parse((await readRequestBody(request, 1024 * 512)).toString("utf8"));
        return sendJson(response, 200, await seoStore.apply(data.settings, data.revision, url.pathname.endsWith("/restore")));
      } catch (error) {
        return sendJson(response, error.statusCode || 400, { error: error.message, saved: Boolean(error.saved), applied: false });
      }
    }
    if (request.method === "GET" && url.pathname.startsWith(`${imageRouteBase}/`)) {
      const fileName = decodeURIComponent(url.pathname.slice(`${imageRouteBase}/`.length));
      return sendImageAsset(response, fileName);
    }
    if (request.method === "GET" && url.pathname === "/") return sendHtml(response);
    if (request.method === "GET" && url.pathname === "/api/theme") {
      const { values } = await readTheme();
      await writeLiveTheme(values);
      return sendJson(response, 200, { colors: editableColors, values, themePath, liveThemePath });
    }
    if (request.method === "GET" && url.pathname === "/api/images") {
      const images = await listImages();
      return sendJson(response, 200, { imageRouteBase, imageAssetsPath, images });
    }
    if (request.method === "GET" && url.pathname === "/api/logo") {
      const logo = await readLogoInfo();
      return sendJson(response, 200, { logo });
    }
    if (request.method === "POST" && url.pathname === "/api/logo/apply") {
      try {
        const buffer = await readRequestBody(request);
        const logo = await applyLogo(buffer);
        return sendJson(response, 200, { logo });
      } catch (error) {
        return sendJson(response, 400, { error: error.message });
      }
    }
    if (request.method === "POST" && url.pathname === "/api/logo/confirm") {
      try {
        const logo = await confirmLogo();
        return sendJson(response, 200, { logo });
      } catch (error) {
        return sendJson(response, 400, { error: error.message });
      }
    }
    if (request.method === "POST" && url.pathname === "/api/logo/restore") {
      try {
        const logo = await restoreLogo();
        return sendJson(response, 200, { logo });
      } catch (error) {
        return sendJson(response, 400, { error: error.message });
      }
    }
    if (request.method === "POST" && url.pathname === "/api/images/apply") {
      try {
        const fileName = url.searchParams.get("fileName") ?? "";
        const buffer = await readRequestBody(request);
        const image = await applyImage(fileName, buffer);
        return sendJson(response, 200, { image });
      } catch (error) {
        return sendJson(response, 400, { error: error.message });
      }
    }
    if (request.method === "POST" && url.pathname === "/api/images/confirm") {
      try {
        const data = await readJsonBody(request);
        const image = await confirmImage(data.fileName);
        return sendJson(response, 200, { image });
      } catch (error) {
        return sendJson(response, 400, { error: error.message });
      }
    }
    if (request.method === "POST" && url.pathname === "/api/images/restore") {
      try {
        const data = await readJsonBody(request);
        const image = await restoreImage(data.fileName);
        return sendJson(response, 200, { image });
      } catch (error) {
        return sendJson(response, 400, { error: error.message });
      }
    }
    if (request.method === "POST" && url.pathname === "/api/theme") {
      let body = "";
      request.on("data", (chunk) => {
        body += chunk;
        if (body.length > 1024 * 32) request.destroy();
      });
      request.on("end", async () => {
        try {
          const data = JSON.parse(body || "{}");
          const result = await saveTheme(data.values ?? {});
          sendJson(response, 200, { values: result.values, liveFiles: result.liveFiles, themePath });
        } catch (error) {
          sendJson(response, 400, { error: error.message });
        }
      });
      return;
    }
    return sendJson(response, 404, { error: "Ruta no encontrada." });
  } catch (error) {
    return sendJson(response, 500, { error: error.message });
  }
});

function openBrowser(url) {
  if (process.platform === "win32") return spawn("cmd", ["/c", "start", "", url], { detached: true, stdio: "ignore" }).unref();
  if (process.platform === "darwin") return spawn("open", [url], { detached: true, stdio: "ignore" }).unref();
  spawn("xdg-open", [url], { detached: true, stdio: "ignore" }).unref();
}

function listen(port) {
  server.removeAllListeners("error");
  server.removeAllListeners("listening");
  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && port < 4999) return listen(port + 1);
    console.error(error);
    process.exit(1);
  });
  server.once("listening", () => {
    const url = `http://127.0.0.1:${port}/`;
    console.log("ALMA · Editor visual");
    console.log(`Archivo: ${themePath}`);
    console.log(`Editor:  ${url}`);
    console.log("Cierra esta ventana para apagar el editor.");
    if (!process.argv.includes("--no-open")) openBrowser(url);
  });
  server.listen(port, "127.0.0.1");
}

listen(4387);
