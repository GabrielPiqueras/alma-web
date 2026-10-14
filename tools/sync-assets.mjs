import { syncImageVersions } from "./image-versions.mjs";
import { syncLogoVersion } from "./logo-tools.mjs";

try {
  const images = await syncImageVersions();
  const logo = await syncLogoVersion();
  console.log(`Versiones de imagen actualizadas: ${images.count}`);
  console.log(`Logo actualizado: ${logo.version || "sin logo"}`);
} catch (error) {
  console.error(error);
  process.exit(1);
}
