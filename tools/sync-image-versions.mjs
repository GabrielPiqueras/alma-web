import { syncImageVersions } from "./image-versions.mjs";

try {
  const result = await syncImageVersions();
  console.log(`Versiones de imagen actualizadas: ${result.count}`);
} catch (error) {
  console.error(error);
  process.exit(1);
}
