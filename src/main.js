import "./style.css";
import "./jersey.css";
import { initMotion } from "./motion.js";
import { initOrganisation } from "./organisation.js";
import { positionAtlas, initComparison } from "./kit-atlas.js";
import { initJersey } from "./jersey-entry.js";
import arrowUpRight from "@phosphor-icons/core/assets/regular/arrow-up-right.svg";
import arrowDown from "@phosphor-icons/core/assets/regular/arrow-down.svg";
import arrowUp from "@phosphor-icons/core/assets/regular/arrow-up.svg";

const icons = { "↗": arrowUpRight, "↓": arrowDown, "↑": arrowUp };
document.querySelectorAll('span[aria-hidden="true"]').forEach((span) => {
  const src = icons[span.textContent];
  if (!src) return;
  const icon = Object.assign(document.createElement("img"), {
    src,
    alt: "",
    className: "icon",
  });
  icon.width = 20;
  icon.height = 20;
  span.replaceChildren(icon);
});

const motion = initMotion();
initOrganisation(motion);
initComparison(motion);
const jersey = initJersey(motion);

// Native modal dialogs provide focus containment, Escape handling, and focus return.
const menu = document.querySelector("#mobile-menu");
const contactDialog = document.querySelector("#contact-dialog");
document
  .querySelector("#menu-open")
  .addEventListener("click", () => menu.showModal());
document
  .querySelector("#contact-open")
  .addEventListener("click", () => contactDialog.showModal());
for (const dialog of [menu, contactDialog]) {
  dialog
    .querySelector("[data-close]")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  });
}
menu
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", () => menu.close()));

const kits = [
  {
    name: "Domicile V1",
    alt: "Maillot domicile V1 rouge et or, sans sponsor",
    description:
      "Le rouge pour l’intensité. L’or pour la signature. Une première proposition de tenue domicile.",
  },
  {
    name: "Domicile V2",
    alt: "Maillot domicile V2 bleu nuit et or, sans sponsor",
    description:
      "Le bleu nuit pour la profondeur. Des lignes dorées pour porter la même identité autrement.",
  },
  {
    name: "Extérieur",
    alt: "Maillot extérieur ivoire et or, sans sponsor",
    description:
      "L’ivoire pour la clarté. Des accents bleu nuit et or pour une tenue extérieure singulière.",
  },
  {
    name: "Troisième",
    alt: "Troisième maillot noir, violet et or, sans sponsor",
    description:
      "Le noir et le violet se rencontrent. Une troisième tenue qui affirme le caractère de VALORIA FC.",
  },
];
const tabs = [...document.querySelectorAll("[data-kit]")];
const strip = document.querySelector("#kit-image");
let activeKit = 0;
function positionKit() {
  positionAtlas(document.querySelector(".kit-window"), strip, activeKit);
}
function selectKit(index, focus = false) {
  activeKit = index;
  tabs.forEach((tab, i) => {
    tab.setAttribute("aria-selected", String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
  });
  const kit = kits[index];
  document.querySelector("#kit-name").textContent = kit.name;
  document.querySelector("#kit-description").textContent = kit.description;
  document
    .querySelector("#kit-panel")
    .setAttribute("aria-labelledby", `kit-tab-${index}`);
  strip.alt = kit.alt;
  positionKit();
  jersey.select(index);
  if (focus) tabs[index].focus();
  if (!motion.paused)
    motion.animate(
      document.querySelector("#kit-copy"),
      [
        { opacity: 0.3, transform: "translateY(8px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 250, easing: "cubic-bezier(.16, 1, .3, 1)" },
    );
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectKit(index));
  tab.addEventListener("keydown", (event) => {
    const next = {
      ArrowRight: (index + 1) % 4,
      ArrowLeft: (index + 3) % 4,
      Home: 0,
      End: 3,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    selectKit(next, true);
  });
});
new ResizeObserver(positionKit).observe(document.querySelector(".kit-window"));
strip.addEventListener("load", positionKit);
positionKit();

document.querySelector("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const text = `VALORIA FC — Brouillon de message\n\nNom : ${data.get("name")}\nE-mail : ${data.get("email")}\nSujet : ${data.get("subject")}\n\n${data.get("message")}\n\nCe fichier est un brouillon. Aucun message n’a été envoyé.\n`;
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/plain;charset=utf-8" }),
  );
  const link = Object.assign(document.createElement("a"), {
    href: url,
    download: "message-valoria-fc.txt",
  });
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector("#form-status").textContent =
    "Votre brouillon a été préparé pour téléchargement. Aucun message n’a été envoyé.";
});
