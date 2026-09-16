
document.addEventListener("DOMContentLoaded", () => {

  // Automatically mark the current page's menu item as active
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  // Resource articles have no direct menu item; highlight their parent section
  const parentMap = {
    "immigration-resources.html": "resources.html",
    "criminal-resources.html": "resources.html",
  };
  const targetPage = parentMap[currentPage] || currentPage;
  document.querySelectorAll(".main-nav a").forEach(link => {
    const linkPage = link.getAttribute("href")?.split("/").pop();
    if (linkPage === targetPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  document.querySelectorAll("[id='year']").forEach(el => el.textContent = new Date().getFullYear());

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle) toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
    toggle.textContent = open ? "Close" : "Menu";
  });

  const langBtn = document.getElementById("langToggle");
  const isSpanish = document.documentElement.lang === "es" || location.pathname.includes("/es/");
  if (langBtn) {
    langBtn.textContent = isSpanish ? "EN" : "ES";
    langBtn.setAttribute("aria-label", isSpanish ? "Switch to English" : "Cambiar a español");
    langBtn.addEventListener("click", () => {
      const current = location.pathname.split("/").pop() || "index.html";
      if (isSpanish) {
        const englishName = current;
        location.href = "../" + englishName;
      } else {
        location.href = "es/" + current;
      }
    });
  }

  document.querySelectorAll("[data-faq]").forEach(btn => {
    btn.addEventListener("click", () => {
      const answer = btn.nextElementSibling;
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      answer.hidden = open;
    });
  });

  const form = document.querySelector("#consultationForm");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const status = document.querySelector("#formStatus");
      const spanish = document.documentElement.lang === "es";
      status.textContent = spanish
        ? "Gracias. Este formulario de demostración está listo para conectarse a un servicio seguro de formularios o admisión de casos."
        : "Thank you. This demo form is ready to connect to your preferred secure form/email service.";
      status.classList.add("success");
      form.reset();
    });
  }

  // Priority nav: collapse overflowing items into a "More" dropdown
  const navEl = document.querySelector(".main-nav");
  if (navEl) {
    const spanish = document.documentElement.lang === "es";
    const moreWrap = document.createElement("div");
    moreWrap.className = "more-wrap";
    const moreBtn = document.createElement("button");
    moreBtn.className = "more-btn";
    moreBtn.type = "button";
    moreBtn.setAttribute("aria-haspopup", "true");
    moreBtn.setAttribute("aria-expanded", "false");
    moreBtn.innerHTML = (spanish ? "M\u00e1s" : "More") + ' <span aria-hidden="true">\u25be</span>';
    const moreMenu = document.createElement("div");
    moreMenu.className = "more-menu";
    moreMenu.setAttribute("role", "menu");
    moreWrap.append(moreBtn, moreMenu);
    navEl.appendChild(moreWrap);

    const isMobileMenu = () => window.matchMedia("(max-width:820px)").matches;
    const syncMoreActive = () => {
      moreBtn.classList.toggle("active", !!moreMenu.querySelector("a.active"));
    };
    const fit = () => {
      // Restore everything first (mobile hamburger handles small screens)
      while (moreMenu.firstChild) navEl.insertBefore(moreMenu.firstChild, moreWrap);
      moreWrap.classList.remove("show", "open");
      moreBtn.setAttribute("aria-expanded", "false");
      if (isMobileMenu()) { syncMoreActive(); return; }
      moreWrap.classList.add("show");
      let guard = 20;
      while (guard-- > 0 && navEl.scrollWidth > navEl.clientWidth + 1) {
        const items = navEl.querySelectorAll(":scope > a");
        if (!items.length) break;
        moreMenu.prepend(items[items.length - 1]);
      }
      moreWrap.classList.toggle("show", !!moreMenu.firstChild);
      syncMoreActive();
    };

    moreBtn.addEventListener("click", e => {
      e.stopPropagation();
      const open = moreWrap.classList.toggle("open");
      moreBtn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", () => {
      moreWrap.classList.remove("open");
      moreBtn.setAttribute("aria-expanded", "false");
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        moreWrap.classList.remove("open");
        moreBtn.setAttribute("aria-expanded", "false");
      }
    });
    window.addEventListener("resize", fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    fit();
  }
});
