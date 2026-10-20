import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { createSeoStore, validateSeoSettings } from "./seo-settings.mjs";
import { canonicalPageUrl, pageIsIndexable, serializeJsonLd } from "../src/data/seo-utils.mjs";

const initial = {
  siteUrl: "", siteName: "ALMA", defaultTitle: "ALMA — Escuela", defaultDescription: "Formación e imagen.",
  indexingEnabled: false, googleSiteVerification: "",
  contact: { email: "", phone: "", city: "", streetAddress: "", postalCode: "", region: "", country: "", instagram: "" },
  pages: {}
};

test("normaliza dominio, contacto, verificación y exclusiones de páginas", () => {
  const input = structuredClone(initial);
  input.siteUrl = "alma-seo-validation.es/";
  input.indexingEnabled = true;
  input.contact = { ...input.contact, email: "info@alma-seo-validation.es", phone: "+34 911 000 000", city: "Alicante", country: "es", instagram: "https://www.instagram.com/alma_prueba/" };
  input.googleSiteVerification = '<meta name="google-site-verification" content="google_TEST-123" />';
  input.pages = { "/equipo/": { title: "Nuestro equipo | ALMA" }, "/privacidad": { indexable: false }, "/contacto": { title: "", description: "", indexable: true } };
  const settings = validateSeoSettings(input);
  assert.equal(settings.siteUrl, "https://alma-seo-validation.es");
  assert.equal(settings.contact.instagram, "@alma_prueba");
  assert.equal(settings.contact.country, "ES");
  assert.equal(settings.googleSiteVerification, "google_TEST-123");
  assert.deepEqual(Object.keys(settings.pages), ["/equipo", "/privacidad"]);
  assert.equal(canonicalPageUrl(settings.siteUrl, "/equipo"), "https://alma-seo-validation.es/equipo/");
  assert.equal(pageIsIndexable(settings, "/privacidad/"), false);
  assert.equal(pageIsIndexable(settings, "/equipo/"), true);
});

test("rechaza dominios de ejemplo, direcciones con rutas y activación sin dominio", () => {
  for (const siteUrl of ["http://alma.es", "https://alma.es/escuela", "https://user:pass@alma.es", "https://alma-demo.example", "http://localhost:4321", "https://127.0.0.1", "https://alma.es?x=1"]) {
    assert.throws(() => validateSeoSettings({ ...initial, siteUrl }));
  }
  assert.throws(() => validateSeoSettings({ ...initial, indexingEnabled: true }));
  assert.throws(() => validateSeoSettings({ ...initial, googleSiteVerification: '"><script>' }));
  assert.throws(() => validateSeoSettings({ ...initial, pages: { "/equipo": {}, "/equipo/": {} } }));
});

test("serializa datos estructurados sin permitir cerrar la etiqueta script", () => {
  const value = { name: "</script><script>alert(1)</script>" };
  const encoded = serializeJsonLd(value);
  assert.equal(encoded.includes("</script>"), false);
  assert.deepEqual(JSON.parse(encoded), value);
});

async function fixture(t) {
  const base = resolve(tmpdir());
  const root = await mkdtemp(join(base, "alma-seo-test-"));
  assert.ok(resolve(root).startsWith(base + sep));
  t.after(async () => {
    assert.ok(resolve(root).startsWith(base + sep + "alma-seo-test-"));
    await rm(root, { recursive: true, force: true });
  });
  await mkdir(join(root, "src/data"), { recursive: true });
  await mkdir(join(root, "dist/equipo"), { recursive: true });
  await writeFile(join(root, "src/data/seo.json"), JSON.stringify(initial));
  await writeFile(join(root, "dist/index.html"), '<title>ALMA &amp; Escuela</title><meta name="description" content="Formación">');
  await writeFile(join(root, "dist/equipo/index.html"), '<title>Equipo | ALMA</title><meta name="description" content="Profesorado">');
  return root;
}

test("guarda, genera y restaura; conserva el respaldo al repetir sin cambios", async t => {
  const root = await fixture(t);
  let builds = 0;
  const store = createSeoStore(root, async () => { builds++; });
  const before = await store.state();
  assert.deepEqual(before.pages.map(page => page.path), ["/", "/equipo"]);
  assert.equal(before.pages[0].title, "ALMA & Escuela");
  const next = { ...initial, siteUrl: "https://alma-seo-validation.es", indexingEnabled: true };
  const saved = await store.apply(next, before.revision);
  assert.equal(saved.applied, true);
  assert.equal(saved.busy, false);
  assert.equal(saved.hasBackup, true);
  assert.equal(builds, 1);
  const repeated = await store.apply(next, saved.revision);
  assert.equal(JSON.parse(await readFile(join(root, ".alma-editor/seo-previous.json"), "utf8")).siteUrl, "");
  const restored = await store.apply(null, repeated.revision, true);
  assert.deepEqual(restored.settings, initial);
  assert.equal(builds, 3);
  await assert.rejects(store.apply(next, before.revision), error => error.statusCode === 409);
});

test("detecta cambios concurrentes y diferencia guardar de generar", async t => {
  const root = await fixture(t);
  const store = createSeoStore(root, async () => { throw new Error("Fallo de compilación de prueba"); });
  const before = await store.state();
  const next = { ...initial, defaultTitle: "ALMA nuevo título" };
  await assert.rejects(store.apply(next, before.revision), error => error.saved === true && error.statusCode === 422 && error.message.includes("no se ha podido generar"));
  assert.equal((await store.state()).settings.defaultTitle, "ALMA nuevo título");
  assert.equal(store.busy, false);
  await assert.rejects(store.apply(initial, before.revision), error => error.statusCode === 409 && !error.saved);
});

test("impide aplicar dos configuraciones mientras se genera la web", async t => {
  const root = await fixture(t);
  let release;
  const pending = new Promise(resolve => { release = resolve; });
  const store = createSeoStore(root, () => pending);
  const before = await store.state();
  const first = store.apply(initial, before.revision);
  await assert.rejects(store.apply(initial, before.revision), error => error.statusCode === 409);
  release();
  await first;
});
