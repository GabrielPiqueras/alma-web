import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(__dirname);
const imageAssetsPath = join(projectRoot, "public", "assets", "images");
const outputPath = join(projectRoot, "src", "data", "imageVersions.ts");
const oldImagePrefix = "OLD_";
const allowedImageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"]);

async function getVersionedImages(directory = imageAssetsPath, prefix = "") {
  await mkdir(directory, { recursive: true });
  const entries = await readdir(directory, { withFileTypes: true });
  const images = [];

  for (const entry of entries) {
    if (entry.name.startsWith(oldImagePrefix)) continue;
    if (entry.isDirectory()) {
      images.push(...await getVersionedImages(join(directory, entry.name), `${prefix}${entry.name}/`));
      continue;
    }
    if (!entry.isFile()) continue;
    if (!allowedImageExtensions.has(extname(entry.name).toLowerCase())) continue;

    const buffer = await readFile(join(directory, entry.name));
    const version = createHash("sha1").update(buffer).digest("hex").slice(0, 12);
    images.push([`${prefix}${entry.name}`, version]);
  }

  return images.sort(([a], [b]) => a.localeCompare(b, "es"));
}

function renderImageVersions(images) {
  const rows = images.map(([fileName, version]) => `  ${JSON.stringify(fileName)}: ${JSON.stringify(version)},`);

  return [
    "/*",
    "  ALMA image versions.",
    "  Este archivo se genera automaticamente al cambiar imagenes o al ejecutar npm run build.",
    "*/",
    "",
    "export const imageVersions = {",
    ...rows,
    "} as const;",
    "",
    "export function versionedImage(src: string) {",
    "  const [path] = src.split(\"?\");",
    "  if (!path.startsWith(\"/assets/images/\")) return src;",
    "  const fileName = path.slice(\"/assets/images/\".length);",
    "  const version = imageVersions[fileName as keyof typeof imageVersions];",
    "  return version ? `${path}?v=${version}` : src;",
    "}",
    ""
  ].join("\n");
}

export async function syncImageVersions() {
  const images = await getVersionedImages();
  await writeFile(outputPath, renderImageVersions(images), "utf8");
  return { outputPath, count: images.length };
}
