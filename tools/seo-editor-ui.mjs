export const seoStyles = `
    .tabs { flex-wrap: wrap; }
    .seo-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.2rem; }
    .seo-group { min-width: 0; border: 1px solid var(--ui-line); padding: 1rem; }
    .seo-group h2 { margin: 0 0 .5rem; font-family: Georgia, serif; font-size: 1.8rem; font-weight: 400; }
    .seo-field { display: grid; gap: .4rem; margin-top: 1rem; }
    .seo-field input, .seo-field textarea, .seo-field select { width: 100%; min-width: 0; border: 1px solid var(--ui-line); background: var(--ui-input); color: var(--ui-light); padding: .75rem; font: inherit; }
    .seo-field textarea { min-height: 6.5rem; resize: vertical; }
    .seo-field small, .seo-help { color: #c9bfb4; font-size: .88rem; }
    .seo-help { margin: .5rem 0; }
    .seo-check { display: flex; align-items: start; gap: .65rem; margin-top: 1rem; cursor: pointer; }
    .seo-check input { width: 1.15rem; height: 1.15rem; flex: 0 0 auto; margin-top: .25rem; accent-color: var(--ui-secondary); }
    .seo-subgrid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 1rem; }
    .seo-wide { grid-column: 1 / -1; }
    .seo-preview { background: #fff; color: #303134; border-radius: .35rem; padding: 1.2rem; margin-top: 1rem; overflow-wrap: anywhere; }
    .seo-preview p { margin: .3rem 0; }
    .seo-preview strong { display: block; color: #1a0dab; font-size: 1.2rem; font-weight: 400; }
    .seo-preview small { color: #4d5156; }
    #seo-warnings { padding-left: 1.25rem; color: #ead0a6; }
    #seo-status { white-space: pre-wrap; overflow-wrap: anywhere; }
    #seo-sitemap { color: var(--ui-secondary); overflow-wrap: anywhere; }
    #seo-form button:disabled { opacity: .5; cursor: wait; }
    #seo-form fieldset { margin: 0; padding: 0; border: 0; min-width: 0; }
    #seo-form :focus-visible { outline: 2px solid var(--ui-secondary); outline-offset: 3px; }
    @media (max-width: 880px) { .seo-grid { grid-template-columns: 1fr; } }
    @media (max-width: 480px) { .seo-subgrid { grid-template-columns: 1fr; } }
`;

const textField = (id, label, help = "", max = 200, type = "text") => `
  <div class="seo-field">
    <label for="seo-${id}">${label}</label>
    <input id="seo-${id}" type="${type}" maxlength="${max}" ${help ? `aria-describedby="seo-${id}-help"` : ""}>
    ${help ? `<small id="seo-${id}-help">${help}</small>` : ""}
  </div>`;

export const seoMarkup = `
    <section class="panel" id="tab-seo" hidden>
      <p class="brand">ALMA / SEO y datos</p>
      <p>Configura cómo se presenta ALMA en los buscadores y sus datos de contacto. Los cambios se aplican al proyecto local; después tendrás que subirlos a la web publicada.</p>
      <form id="seo-form">
        <fieldset id="seo-fields" disabled>
          <div class="seo-grid">
            <section class="seo-group">
              <h2>Dominio e indexación</h2>
              ${textField("siteUrl", "Dominio público", "El dominio definitivo, con HTTPS y sin rutas. Puedes dejarlo vacío mientras preparas la web.", 250)}
              <label class="seo-check"><input id="seo-indexingEnabled" type="checkbox"><span>Permitir que los buscadores indexen la web</span></label>
              <p class="seo-help">Si está desactivado, todas las páginas llevan «noindex» y el sitemap queda vacío. Esto no hace privada la web ni elimina resultados de inmediato.</p>
              ${textField("siteName", "Nombre de la web", "", 80)}
              ${textField("defaultTitle", "Título de Inicio", "Se usa en la pestaña del navegador y como propuesta de título en buscadores.", 150)}
              <div class="seo-field"><label for="seo-defaultDescription">Descripción general</label><textarea id="seo-defaultDescription" maxlength="500"></textarea><small>Se usa en Inicio, el pie de página y la información de la organización.</small></div>
            </section>
            <section class="seo-group">
              <h2>Datos de ALMA</h2>
              <p class="seo-help">Introduce datos reales. Los campos vacíos no se muestran. Aparecen en Contacto, el pie y la información que leen los buscadores.</p>
              <div class="seo-subgrid">
                ${textField("email", "Correo electrónico", "", 200, "email")}
                ${textField("phone", "Teléfono", "", 40, "tel")}
                ${textField("city", "Ciudad")}
                ${textField("region", "Provincia o región")}
                ${textField("streetAddress", "Dirección")}
                ${textField("postalCode", "Código postal", "", 20)}
                ${textField("country", "País", "Código de dos letras, por ejemplo ES.", 2)}
                ${textField("instagram", "Instagram", "Usuario con @ o enlace a tu perfil.")}
              </div>
              <p class="seo-help">Configurar un correo de contacto no activa el envío del formulario, que conserva su modo actual.</p>
            </section>
            <section class="seo-group">
              <h2>Páginas</h2>
              <p class="seo-help">Cada página tiene su propia dirección. Deja un campo vacío para usar el texto original de esa página.</p>
              <div class="seo-field"><label for="seo-page">Página a editar</label><select id="seo-page"></select></div>
              ${textField("pageTitle", "Título personalizado", "Título completo, incluido ALMA si quieres que aparezca.", 150)}
              <div class="seo-field"><label for="seo-pageDescription">Descripción personalizada</label><textarea id="seo-pageDescription" maxlength="500"></textarea></div>
              <label class="seo-check"><input id="seo-pageIndexable" type="checkbox"><span>Incluir esta página cuando la indexación general esté activada</span></label>
              <div class="seo-preview" aria-label="Vista previa orientativa en buscadores">
                <small id="seo-preview-url"></small>
                <strong id="seo-preview-title"></strong>
                <p id="seo-preview-description"></p>
              </div>
              <p class="seo-help" id="seo-counts"></p>
              <p class="seo-help">Vista orientativa: Google puede mostrar otros textos. Cambiar estos campos no modifica el contenido visible de la página.</p>
            </section>
            <section class="seo-group">
              <h2>Google Search Console</h2>
              ${textField("googleSiteVerification", "Código de verificación HTML", "Pega el código o la etiqueta meta que proporciona Google. Para una propiedad de dominio, la verificación DNS se hace en tu proveedor.", 500)}
              <p class="seo-help">Una vez publicada la web, verifica la propiedad en Search Console y envía el sitemap. Este editor prepara los archivos, pero no envía información a Google.</p>
              <p><a id="seo-sitemap" hidden target="_blank" rel="noreferrer"></a></p>
              <a class="link-button secondary" href="https://search.google.com/search-console" target="_blank" rel="noreferrer">Abrir Search Console</a>
              <h2 style="margin-top:1.5rem">Estado guardado</h2>
              <ul id="seo-warnings"></ul>
              <p class="seo-help" id="seo-page-count"></p>
            </section>
          </div>
          <div class="actions">
            <button type="submit">Guardar y aplicar</button>
            <button class="secondary" type="button" id="seo-reload">Recargar datos</button>
            <button class="secondary" type="button" id="seo-restore" disabled>Restaurar configuración anterior</button>
          </div>
        </fieldset>
        <p class="status" id="seo-status" role="status" aria-live="polite">Cargando ajustes…</p>
        <p class="seo-help">Guardar y aplicar regenera las páginas, el sitemap y las instrucciones para buscadores. Conserva una copia de los ajustes anteriores.</p>
      </form>
    </section>
`;
