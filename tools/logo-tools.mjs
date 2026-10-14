import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(__dirname);
const logoPath = join(projectRoot, "public", "assets", "images", "alma", "logo.png");
const outputPath = join(projectRoot, "src", "data", "logo.ts");
const logoRoute = "/assets/images/alma/logo.png";

async function transparentTrimmedPng(buffer) {
  const image = sharp(buffer).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const channels = info.channels;
  let minX = info.width;
  let minY = info.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const index = (y * info.width + x) * channels;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const a = data[index + 3];
      const isNearWhite = r > 238 && g > 238 && b > 238 && Math.max(r, g, b) - Math.min(r, g, b) < 12;

      if (isNearWhite) data[index + 3] = 0;

      if (data[index + 3] > 12 && a > 12) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX < minX || maxY < minY) {
    return sharp(buffer).png().toBuffer();
  }

  const padding = 8;
  const left = Math.max(0, minX - padding);
  const top = Math.max(0, minY - padding);
  const width = Math.min(info.width - left, maxX - minX + 1 + padding * 2);
  const height = Math.min(info.height - top, maxY - minY + 1 + padding * 2);

  return sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels
    }
  })
    .extract({ left, top, width, height })
    .png()
    .toBuffer();
}

export async function prepareLogoFile(sourcePath) {
  const buffer = await readFile(sourcePath);
  await saveLogoBuffer(buffer);
}

export async function saveLogoBuffer(buffer) {
  const png = await transparentTrimmedPng(buffer);
  await mkdir(dirname(logoPath), { recursive: true });
  await writeFile(logoPath, png);
  await syncLogoVersion();
  return png;
}

export async function syncLogoVersion() {
  let version = "";
  if (existsSync(logoPath)) {
    const buffer = await readFile(logoPath);
    version = createHash("sha1").update(buffer).digest("hex").slice(0, 12);
  }

  const source = [
    "/*",
    "  ALMA logo settings.",
    "  Este archivo se genera automaticamente al cambiar el logo o al ejecutar npm run build.",
    "*/",
    "",
    `export const logo = {`,
    `  src: "${logoRoute}",`,
    `  version: "${version}"`,
    `} as const;`,
    "",
    "export function versionedLogo() {",
    "  return logo.version ? `${logo.src}?v=${logo.version}` : logo.src;",
    "}",
    ""
  ].join("\n");

  await writeFile(outputPath, source, "utf8");
  return { outputPath, version };
}
