import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://alma-demo.example",
  output: "static",
  trailingSlash: "ignore",
  devToolbar: {
    enabled: false
  },
  build: {
    format: "directory"
  }
});
