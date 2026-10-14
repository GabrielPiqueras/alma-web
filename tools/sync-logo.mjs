import { syncLogoVersion } from "./logo-tools.mjs";

try {
  const result = await syncLogoVersion();
  console.log(`Logo actualizado: ${result.version || "sin logo"}`);
} catch (error) {
  console.error(error);
  process.exit(1);
}
