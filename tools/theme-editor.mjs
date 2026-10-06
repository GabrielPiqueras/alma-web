import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(__dirname);
const themePath = join(projectRoot, "src", "styles", "theme.css");
const liveThemePath = join(projectRoot, "public", "theme-live.css");
const distLiveThemePath = join(projectRoot, "dist", "theme-live.css");

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
  <title>ALMA · Editor de colores</title>
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
    @media (max-width: 880px) { .hero, .layout, .color-grid { grid-template-columns: 1fr; } .preview { position: static; } }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <div>
        <p class="brand">ALMA / Editor visual</p>
        <h1>Color del proyecto</h1>
      </div>
      <p class="intro">Cambia la paleta base de ALMA desde aquí. Al guardar, se actualiza <strong>src/styles/theme.css</strong> y también el tema vivo que carga la web.</p>
    </section>

    <section class="layout">
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
          <a class="link-button" href="http://127.0.0.1:4321/" target="_blank" rel="noreferrer">Abrir web</a>
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
  </main>

  <script>
    const fields = ${JSON.stringify(editableColors)};
    const fieldContainer = document.querySelector('#fields');
    const form = document.querySelector('#theme-form');
    const status = document.querySelector('#status');
    const reloadButton = document.querySelector('#reload');
    const applySuggestionButton = document.querySelector('#apply-suggestion');
    const suggestionValue = document.querySelector('#suggestion-value');
    const suggestionSwatch = document.querySelector('#suggestion-swatch');

    const cssVarMap = {
      '--alma-primary': '--ui-primary',
      '--alma-secondary': '--ui-secondary',
      '--alma-dark': '--ui-dark',
      '--alma-light': '--ui-light',
      '--alma-paper': '--ui-paper',
      '--alma-sand': '--ui-sand',
      '--alma-muted': '--ui-muted'
    };

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
    loadTheme().catch((error) => { status.textContent = error.message; });
  </script>
</body>
</html>`;
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", "http://localhost");
    if (request.method === "GET" && url.pathname === "/") return sendHtml(response);
    if (request.method === "GET" && url.pathname === "/api/theme") {
      const { values } = await readTheme();
      await writeLiveTheme(values);
      return sendJson(response, 200, { colors: editableColors, values, themePath, liveThemePath });
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
  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && port < 4999) return listen(port + 1);
    console.error(error);
    process.exit(1);
  });
  server.listen(port, "127.0.0.1", () => {
    const url = `http://127.0.0.1:${port}/`;
    console.log("ALMA · Editor visual de colores");
    console.log(`Archivo: ${themePath}`);
    console.log(`Editor:  ${url}`);
    console.log("Cierra esta ventana para apagar el editor.");
    openBrowser(url);
  });
}

listen(4387);