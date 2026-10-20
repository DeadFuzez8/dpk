const header = document.querySelector(".header");
const menuToggle = document.querySelector("#menuToggle");
const nav = document.querySelector("#mainNav");

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 14);
});

menuToggle?.addEventListener("click", () => {
  nav?.classList.toggle("is-open");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("is-open"));
});

/* ---------- Каталог: фильтр по категориям ---------- */
const tabs = document.querySelectorAll(".material-tab");
const groups = document.querySelectorAll("[data-group]");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const key = tab.dataset.tab;
    tabs.forEach((item) => item.classList.toggle("is-active", item === tab));
    groups.forEach((group) => {
      group.hidden = key !== "all" && group.dataset.group !== key;
    });
  });
});

/* ---------- Каталог: карточка товара (данные берутся из атрибутов карточки) ---------- */
const productModal = document.querySelector("#productModal");
const productModalBackdrop = document.querySelector("#productModalBackdrop");
const productModalClose = document.querySelector("#productModalClose");
const productModalTitle = document.querySelector("#productModalTitle");
const productModalMeta = document.querySelector("#productModalMeta");
const productDescription = document.querySelector("#productDescription");
const productMainImage = document.querySelector("#productMainImage img");
const productSpecsList = document.querySelector("#productSpecsList");
let lastProductCard = null;

const openProductModal = (card) => {
  if (!productModal) return;
  const { name, sub, color, price } = card.dataset;
  const image = card.querySelector(".product-visual img");

  lastProductCard = card;
  productModalTitle.textContent = name;
  productModalMeta.textContent = card.closest(".catalog-block")?.querySelector("h3")?.textContent || "КАРТОЧКА ТОВАРА";
  productDescription.textContent = [sub, color].filter(Boolean).join(" · ");
  productDescription.hidden = !productDescription.textContent;
  productMainImage.src = image?.currentSrc || image?.src || "";
  productMainImage.alt = image?.alt || name;

  const specs = [
    ["Исполнение", sub],
    ["Цвет", color],
    ["Цена", price],
  ].filter(([, value]) => value);
  productSpecsList.replaceChildren(
    ...specs.map(([label, value]) => {
      const li = document.createElement("li");
      const term = document.createElement("span");
      term.textContent = label;
      li.append(term, value);
      return li;
    })
  );

  productModal.classList.add("is-open");
  productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  productModalClose?.focus();
};

const closeProductModal = () => {
  if (!productModal?.classList.contains("is-open")) return;
  productModal.classList.remove("is-open");
  productModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  lastProductCard?.focus();
};

document.querySelectorAll(".product-card").forEach((card) => {
  card.addEventListener("click", () => openProductModal(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProductModal(card);
    }
  });
});

productModalClose?.addEventListener("click", closeProductModal);
productModalBackdrop?.addEventListener("click", closeProductModal);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeProductModal();
});

/* ---------- Motion: сцена первого экрана, появление при скролле, параллакс, реакция карточек ---------- */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("js-motion");

  const clamp = (value) => Math.min(Math.max(value, 0), 1);
  const lerp = (from, to, t) => from + (to - from) * t;
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const wideScreen = window.matchMedia("(min-width: 901px)");

  // Появление при скролле: [селектор, шаг задержки между соседями]
  const revealGroups = [
    [".advantages .eyebrow, .advantages h2", 0.1],
    [".advantage", 0.08],
    [".technology__title > *, .technology__description", 0.1],
    [".technology__media", 0],
    [".technology__item", 0.14],
    [".catalog__left > *", 0.08],
    [".catalog__grid .card", 0.1],
    [".catalog-block > h3", 0],
    [".product-card", 0.07],
    [".footer__inner > *", 0.08],
  ];

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  revealGroups.forEach(([selector, step]) => {
    document.querySelectorAll(selector).forEach((element) => {
      const siblings = [...element.parentElement.children].filter((child) => child.matches(selector));
      element.dataset.reveal = "";
      element.style.setProperty("--reveal-delay", `${siblings.indexOf(element) * step}s`);
      revealObserver.observe(element);
    });
  });

  const hero = document.querySelector(".hero");
  const techMedia = document.querySelector(".technology__media");
  const heroVars = ["--clip-left", "--clip-top", "--clip-bottom", "--clip-radius", "--hero-scale", "--text-o", "--hero-text-shift", "--inset-shift"];

  // Первый экран: фото раскрывается из своего кадра на весь экран, текст уходит
  const renderHero = () => {
    if (!hero) return;
    if (!wideScreen.matches) {
      heroVars.forEach((name) => hero.style.removeProperty(name));
      return;
    }
    const distance = Math.max(hero.offsetHeight - window.innerHeight, 1);
    const progress = clamp(window.scrollY / distance);
    const open = easeInOut(clamp(progress / 0.85));
    hero.style.setProperty("--clip-left", `${lerp(44, 0, open).toFixed(2)}%`);
    hero.style.setProperty("--clip-top", `${lerp(104, 0, open).toFixed(1)}px`);
    hero.style.setProperty("--clip-bottom", `${lerp(48, 0, open).toFixed(1)}px`);
    hero.style.setProperty("--clip-radius", `${lerp(4, 0, open).toFixed(2)}px`);
    hero.style.setProperty("--hero-scale", (1 + progress * 0.08).toFixed(4));
    hero.style.setProperty("--text-o", (1 - clamp(progress / 0.4)).toFixed(3));
    hero.style.setProperty("--hero-text-shift", `${(-progress * 90).toFixed(1)}px`);
    hero.style.setProperty("--inset-shift", `${(-progress * 220).toFixed(1)}px`);
  };

  // Технологии: фото внутри рамки движется медленнее страницы
  const renderTech = () => {
    if (!techMedia) return;
    const rect = techMedia.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
    const limit = rect.height * 0.1;
    const shift = Math.max(-limit, Math.min(limit, -offset * 0.14));
    techMedia.style.setProperty("--tech-shift", `${shift.toFixed(1)}px`);
  };

  let frameRequested = false;
  const render = () => {
    frameRequested = false;
    renderHero();
    renderTech();
  };
  const requestRender = () => {
    if (frameRequested) return;
    frameRequested = true;
    requestAnimationFrame(render);
  };

  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", requestRender);
  render();
})();
