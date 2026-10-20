const $ = id => document.getElementById(`seo-${id}`);
const globalFields = ["siteUrl", "siteName", "defaultTitle", "defaultDescription", "googleSiteVerification"];
const contactFields = ["email", "phone", "city", "streetAddress", "postalCode", "region", "country", "instagram"];
let state, draft, selectedPage, dirty = false, loading = false;

function status(message) { $("status").textContent = message; }
async function request(path, body) {
  const response = await fetch(path, body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {});
  const data = await response.json();
  if (!response.ok) throw Object.assign(new Error(data.error || "No se ha podido completar la operación."), data);
  return data;
}
function rememberPage() {
  if (!selectedPage || !draft) return;
  draft.pages[selectedPage] = {
    title: $("pageTitle").value.trim(),
    description: $("pageDescription").value.trim(),
    indexable: $("pageIndexable").checked
  };
}
function sourceValue(page, field) {
  // Built HTML contains the last applied override, not the original page source.
  if (state.settings.pages[selectedPage]?.[field]) return "Texto original de la página (se recuperará al aplicar)";
  return page?.[field] || "";
}
function showPage() {
  selectedPage = $("page").value;
  const page = state.pages.find(item => item.path === selectedPage);
  const override = draft.pages[selectedPage] || {};
  $("pageTitle").value = override.title || "";
  $("pageDescription").value = override.description || "";
  $("pageTitle").placeholder = sourceValue(page, "title");
  $("pageDescription").placeholder = sourceValue(page, "description");
  $("pageIndexable").checked = override.indexable !== false;
  preview();
}
function preview() {
  if (!state) return;
  const page = state.pages.find(item => item.path === selectedPage);
  const home = selectedPage === "/";
  const title = $("pageTitle").value.trim() || (home ? $("defaultTitle").value : sourceValue(page, "title"));
  const description = $("pageDescription").value.trim() || (home ? $("defaultDescription").value : sourceValue(page, "description"));
  const domain = $("siteUrl").value.trim().replace(/\/+$/, "");
  $("preview-title").textContent = title;
  $("preview-description").textContent = description;
  $("preview-url").textContent = (domain || "Dominio pendiente") + (home ? "/" : selectedPage + "/");
  $("counts").textContent = `Título: ${title.length} caracteres · Descripción: ${description.length} caracteres.`;
}
function render(next) {
  state = next;
  draft = structuredClone(next.settings);
  for (const key of globalFields) $(key).value = draft[key];
  for (const key of contactFields) $(key).value = draft.contact[key];
  $("indexingEnabled").checked = draft.indexingEnabled;
  $("page").replaceChildren(...next.pages.map(page => {
    const option = document.createElement("option");
    option.value = page.path;
    option.textContent = page.path === "/" ? "Inicio (/)" : page.path;
    return option;
  }));
  if (next.pages.some(page => page.path === selectedPage)) $("page").value = selectedPage;
  showPage();
  $("warnings").replaceChildren(...(next.warnings.length ? next.warnings : ["Configuración preparada para publicar."]).map(message => {
    const li = document.createElement("li"); li.textContent = message; return li;
  }));
  $("page-count").textContent = `${next.pages.length} páginas detectadas en la última generación.`;
  const sitemap = $("sitemap");
  sitemap.hidden = !draft.siteUrl || !draft.indexingEnabled;
  if (!sitemap.hidden) { sitemap.href = `${draft.siteUrl}/sitemap.xml`; sitemap.textContent = `Sitemap: ${sitemap.href}`; }
  $("restore").disabled = !next.hasBackup;
  dirty = false;
}
async function load() {
  if (loading) return;
  loading = true;
  $("fields").disabled = true;
  status("Cargando ajustes…");
  try { render(await request("/api/seo")); status("Ajustes cargados."); }
  catch (error) { status(error.message); }
  finally { loading = false; $("fields").disabled = !state; }
}
async function apply(restore = false) {
  if (!state || loading) return;
  rememberPage();
  for (const key of globalFields) draft[key] = $(key).value;
  for (const key of contactFields) draft.contact[key] = $(key).value;
  draft.indexingEnabled = $("indexingEnabled").checked;
  loading = true;
  $("fields").disabled = true;
  status(restore ? "Restaurando y regenerando la web…" : "Guardando ajustes y regenerando la web…");
  try {
    render(await request(restore ? "/api/seo/restore" : "/api/seo/apply", { settings: draft, revision: state.revision }));
    status("Configuración aplicada y web local regenerada. Recarga la web para verla. Para actualizar la versión pública, sube los cambios como de costumbre.");
  } catch (error) {
    if (error.saved) {
      try { render(await request("/api/seo")); } catch { /* Keep the build error visible. */ }
    }
    status(error.message);
  } finally { loading = false; $("fields").disabled = false; }
}
$("form").addEventListener("submit", event => { event.preventDefault(); apply(); });
$("form").addEventListener("input", () => { dirty = true; preview(); });
$("page").addEventListener("change", () => { rememberPage(); showPage(); });
$("reload").addEventListener("click", () => {
  if (!dirty || confirm("Se descartarán los cambios sin guardar de esta pestaña. ¿Recargar los datos?")) load();
});
$("restore").addEventListener("click", () => {
  if (confirm("Se recuperará la configuración anterior y se regenerará la web. ¿Restaurar?")) apply(true);
});
document.querySelector('[data-tab="seo"]').addEventListener("click", () => { if (!state) load(); });
window.addEventListener("beforeunload", event => {
  if (dirty || loading) { event.preventDefault(); event.returnValue = ""; }
});
