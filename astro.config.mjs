import { defineConfig } from "astro/config";
import { readFileSync } from "node:fs";
import { normalizeSiteUrl } from "./src/data/seo-utils.mjs";

const seo = JSON.parse(readFileSync(new URL("./src/data/seo.json", import.meta.url), "utf8"));
const siteUrl = normalizeSiteUrl(seo.siteUrl);

export default defineConfig({
  site: siteUrl || undefined,
  output: "static",
  trailingSlash: "ignore",
  devToolbar: {
    enabled: false
  },
  build: {
    format: "directory"
  }
});
