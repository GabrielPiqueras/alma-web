const runtime = (window.__almaRuntime = window.__almaRuntime || {});

document.documentElement.classList.add("has-js");

function setIndexedChildren(selector, propertyName) {
  document.querySelectorAll(selector).forEach((parent) => {
    Array.from(parent.children).forEach((child, index) => {
      child.style.setProperty(propertyName, String(index));
    });
  });
}

function initHeader(signal) {
  const header = document.querySelector("[data-site-header]");
  const progress = document.querySelector("[data-scroll-progress]");
  if (!header) return;

  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const currentY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle("is-scrolled", currentY > 24);
    header.classList.toggle("is-hidden", currentY > 180 && currentY > lastY);

    if (progress && maxScroll > 0) {
      progress.style.transform = `scaleX(${Math.min(currentY / maxScroll, 1)})`;
    }

    lastY = currentY;
    ticking = false;
  };

  const requestUpdate = () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  };

  update();
  window.addEventListener("scroll", requestUpdate, { signal, passive: true });
}

function initMenu(signal) {
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  const close = document.querySelector("[data-menu-close]");
  if (!toggle || !menu || !close) return;

  const focusableSelector = "a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex='-1'])";
  let lastFocus = null;

  const openMenu = () => {
    lastFocus = document.activeElement;
    document.body.classList.add("menu-open");
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    const firstLink = menu.querySelector(focusableSelector);
    firstLink?.focus();
  };

  const closeMenu = () => {
    document.body.classList.remove("menu-open");
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    lastFocus?.focus?.();
  };

  const trapFocus = (event) => {
    if (event.key !== "Tab" || !menu.classList.contains("is-open")) return;
    const focusable = Array.from(menu.querySelectorAll(focusableSelector));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  toggle.addEventListener("click", openMenu, { signal });
  close.addEventListener("click", closeMenu, { signal });
  menu.addEventListener(
    "click",
    (event) => {
      if (event.target === menu || event.target.closest("a")) closeMenu();
    },
    { signal }
  );
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape" && menu.classList.contains("is-open")) closeMenu();
      trapFocus(event);
    },
    { signal }
  );
}

function initReveals(signal) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".split-lines").forEach((block) => {
    block.querySelectorAll("[data-line]").forEach((line, index) => {
      line.style.setProperty("--line-index", String(index));
    });
  });
  setIndexedChildren(".stagger-list", "--stagger-index");

  const revealTargets = document.querySelectorAll(
    ".js-reveal, .reveal-mask, .split-lines, .stagger-list"
  );

  if (reduced || !("IntersectionObserver" in window)) {
    revealTargets.forEach((target) => target.classList.add("is-inview"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-inview");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
  );

  revealTargets.forEach((target) => observer.observe(target));
  signal.addEventListener("abort", () => observer.disconnect(), { once: true });
}

function initParallax(signal) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = Array.from(document.querySelectorAll("[data-parallax='soft']"));
  if (reduced || !items.length) return;

  let ticking = false;

  const update = () => {
    const viewport = window.innerHeight;
    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewport) return;
      const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
      const offset = Math.max(-18, Math.min(18, progress * -34));
      item.style.setProperty("--parallax-y", `${offset}px`);
    });
    ticking = false;
  };

  const requestUpdate = () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  };

  update();
  window.addEventListener("scroll", requestUpdate, { signal, passive: true });
  window.addEventListener("resize", requestUpdate, { signal });
}

function initForms(signal) {
  document.querySelectorAll("[data-contact-form]").forEach((form) => {
    const status = form.querySelector("[data-form-status]");
    form.addEventListener(
      "submit",
      async (event) => {
        event.preventDefault();
        status.textContent = "";

        if (!form.checkValidity()) {
          form.reportValidity();
          status.textContent = "Revisa los campos obligatorios antes de continuar.";
          return;
        }

        const endpoint = form.dataset.endpoint?.trim();
        if (!endpoint) {
          status.textContent =
            "Formulario validado. Modo demostración activo: no se ha enviado ningún mensaje.";
          return;
        }

        try {
          const formData = new FormData(form);
          const response = await fetch(endpoint, {
            method: "POST",
            body: formData,
            headers: { Accept: "application/json" }
          });

          if (!response.ok) throw new Error("No se pudo enviar el formulario.");
          form.reset();
          status.textContent = "Mensaje enviado correctamente.";
        } catch {
          status.textContent =
            "No se pudo enviar el formulario. Revisa la configuración del endpoint.";
        }
      },
      { signal }
    );
  });
}

function initPage() {
  runtime.controller?.abort();
  runtime.controller = new AbortController();
  const { signal } = runtime.controller;

  initHeader(signal);
  initMenu(signal);
  initReveals(signal);
  initParallax(signal);
  initForms(signal);
}

if (!runtime.installed) {
  runtime.installed = true;
  document.addEventListener("astro:page-load", initPage);
  document.addEventListener("DOMContentLoaded", initPage, { once: true });
}

initPage();
