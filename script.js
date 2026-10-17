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

const tabs = document.querySelectorAll(".material-tab");
const panes = document.querySelectorAll(".material-content");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const key = tab.dataset.tab;
    tabs.forEach((item) => item.classList.remove("is-active"));
    panes.forEach((pane) => pane.classList.remove("is-active"));
    tab.classList.add("is-active");
    document.querySelector(`.material-content[data-content="${key}"]`)?.classList.add("is-active");
  });
});

const productData = {
  "CLASSIC 3D": {
    description: "Террасная доска с выраженной древесной текстурой. Подходит для террас, пирсов, зон у бассейна и входных групп.",
    size: { length: "3000 мм", width: "146 мм", height: "23 мм" },
    specs: ["Материал: ДПК", "Поверхность: 3D тиснение", "Монтаж: скрытый крепеж", "Гарантия: до 25 лет"],
    visuals: ["wood-1", "wood-2", "wood-3"],
  },
  "PREMIUM DUO 3D": {
    description: "Двусторонняя доска с премиальной геометрией профиля. Оптимальный выбор для высокой проходимости.",
    size: { length: "3000 мм", width: "150 мм", height: "24 мм" },
    specs: ["Материал: ДПК", "Профиль: пустотелый", "Температурный режим: -50...+80", "Уход: минимальный"],
    visuals: ["wood-2", "gray-1", "wood-3"],
  },
  "ELITE 3D": {
    description: "Премиальная линейка с повышенной устойчивостью к нагрузкам и ультрафиолету.",
    size: { length: "4000 мм", width: "146 мм", height: "23 мм" },
    specs: ["Материал: ДПК", "Профиль: усиленный", "Стабильность цвета: высокая", "Назначение: уличные покрытия"],
    visuals: ["wood-3", "brown-1", "wood-4"],
  },
  "Универсальная доска": {
    description: "Универсальный формат доски для настилов и декоративных поверхностей.",
    size: { length: "3000 мм", width: "140 мм", height: "22 мм" },
    specs: ["Материал: ДПК", "Назначение: универсальное", "Влагостойкость: высокая", "Не требует окрашивания"],
    visuals: ["wood-4", "dark-2", "gray-1"],
  },
};

const defaultProductData = {
  description: "Современный материал для террасных и фасадных решений. Стабилен к влаге, перепадам температуры и ультрафиолету.",
  size: { length: "3000 мм", width: "140 мм", height: "20 мм" },
  specs: ["Материал: композит / ротанг", "Монтаж: стандартный", "Эксплуатация: для улицы", "Сервис: консультация и подбор"],
  visuals: [],
};

const productModal = document.querySelector("#productModal");
const productModalBackdrop = document.querySelector("#productModalBackdrop");
const productModalClose = document.querySelector("#productModalClose");
const productModalTitle = document.querySelector("#productModalTitle");
const productDescription = document.querySelector("#productDescription");
const productMainImage = document.querySelector("#productMainImage");
const productThumbs = document.querySelector("#productThumbs");
const sizeLength = document.querySelector("#sizeLength");
const sizeWidth = document.querySelector("#sizeWidth");
const sizeHeight = document.querySelector("#sizeHeight");
const productSpecsList = document.querySelector("#productSpecsList");

const visualClasses = [
  "wood-1", "wood-2", "wood-3", "wood-4",
  "gray-1", "beige-1", "brown-1",
  "dark-1", "dark-2", "dark-3", "dark-4",
  "panel-1", "panel-2",
  "rattan-1", "rattan-2", "rattan-3", "rattan-4",
];

const clearVisualClasses = (node) => {
  visualClasses.forEach((name) => node.classList.remove(name));
};

const setMainVisual = (visual) => {
  if (!productMainImage) return;
  clearVisualClasses(productMainImage);
  productMainImage.classList.add("product-visual", visual);
};

const fillSpecs = (specs) => {
  if (!productSpecsList) return;
  productSpecsList.innerHTML = "";
  specs.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    productSpecsList.appendChild(li);
  });
};

const buildThumbs = (visuals) => {
  if (!productThumbs) return;
  productThumbs.innerHTML = "";
  visuals.forEach((visual, index) => {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = `product-modal__thumb product-visual ${visual} ${index === 0 ? "is-active" : ""}`;
    thumb.setAttribute("aria-label", "Показать фото");
    thumb.addEventListener("click", () => {
      setMainVisual(visual);
      productThumbs.querySelectorAll(".product-modal__thumb").forEach((item) => item.classList.remove("is-active"));
      thumb.classList.add("is-active");
    });
    productThumbs.appendChild(thumb);
  });
};

const openProductModal = (title, fallbackVisual) => {
  if (!productModal) return;

  const data = productData[title] || defaultProductData;
  const visuals = [fallbackVisual];

  if (productModalTitle) productModalTitle.textContent = title;
  if (productDescription) productDescription.textContent = data.description;
  if (sizeLength) sizeLength.textContent = data.size.length;
  if (sizeWidth) sizeWidth.textContent = data.size.width;
  if (sizeHeight) sizeHeight.textContent = data.size.height;

  setMainVisual(visuals[0]);
  buildThumbs(visuals);
  fillSpecs(data.specs);

  productModal.classList.add("is-open");
  productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
};

const closeProductModal = () => {
  if (!productModal) return;
  productModal.classList.remove("is-open");
  productModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
};

document.querySelectorAll(".product-card").forEach((card) => {
  card.addEventListener("click", () => {
    const title = card.querySelector("h4")?.textContent?.trim() || "Карточка товара";
    const fallbackVisual = card.querySelector(".product-visual")?.classList[1] || "wood-1";
    openProductModal(title, fallbackVisual);
  });
});

productModalClose?.addEventListener("click", closeProductModal);
productModalBackdrop?.addEventListener("click", closeProductModal);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeProductModal();
});