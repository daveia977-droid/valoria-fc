export const people = {
  yvan: {
    name: "Yvan",
    role: "Président",
    description: "Stratégie, décisions majeures et partenariats.",
    manager: null,
    reports: ["messi"],
  },
  messi: {
    name: "Messi",
    role: "Directeur général",
    description:
      "Coordination des services, ressources humaines, fonctionnement quotidien et coordination sportive.",
    manager: "yvan",
    reports: ["charel", "mamady", "emilie"],
  },
  charel: {
    name: "Charel",
    role: "Finances et transferts",
    description: "Budget, finances et négociations financières des transferts.",
    manager: "messi",
    reports: ["marco"],
  },
  marco: {
    name: "Marco",
    role: "Comptabilité",
    description: "Comptabilité, sous la responsabilité de Charel.",
    manager: "charel",
    reports: [],
  },
  mamady: {
    name: "Mamady",
    role: "Logistique et commerce",
    description: "Déplacements, équipements, billetterie et boutique.",
    manager: "messi",
    reports: ["dylan"],
  },
  dylan: {
    name: "Dylan",
    role: "Équipements",
    description: "Gestion des équipements, sous la responsabilité de Mamady.",
    manager: "mamady",
    reports: [],
  },
  emilie: {
    name: "Émilie",
    role: "Marketing et communication",
    description:
      "Image de marque, communication, réseaux sociaux et fidélisation des supporters, directement sous la responsabilité de Messi.",
    manager: "messi",
    reports: [],
  },
};

export function initOrganisation(motion) {
  const tree = document.querySelector("#org-tree");
  const dialog = document.querySelector("#person-dialog");
  const title = dialog.querySelector("#person-name");
  const role = dialog.querySelector("#person-role");
  const description = dialog.querySelector("#person-description");
  const manager = dialog.querySelector("#person-manager");
  const reports = dialog.querySelector("#person-reports");
  const count = (id) =>
    people[id].reports.reduce((total, child) => total + 1 + count(child), 0);

  function personLink(id) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.person = id;
    button.className = "person-link";
    button.textContent = `${people[id].name} — ${people[id].role}`;
    return button;
  }

  function open(id) {
    const person = people[id];
    if (!person) return;
    const path = [];
    for (let current = id; current; current = people[current].manager)
      path.push(current);
    tree.querySelectorAll("[data-person]").forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.person === id);
      button.classList.toggle(
        "is-lineage",
        path.includes(button.dataset.person),
      );
      button
        .closest("li")
        .classList.toggle("has-path", path.includes(button.dataset.person));
    });
    title.textContent = person.name;
    role.textContent = person.role;
    description.textContent = person.description;
    manager.replaceChildren();
    if (person.manager) manager.append(personLink(person.manager));
    else manager.textContent = "Présidence — sommet de l’organigramme.";
    reports.replaceChildren();
    for (const child of person.reports) {
      const item = document.createElement("li");
      item.append(personLink(child));
      reports.append(item);
    }
    const empty = dialog.querySelector("#person-empty");
    empty.hidden = person.reports.length > 0;
    reports.hidden = !person.reports.length;
    dialog.querySelector("#person-count").textContent = count(id)
      ? `${count(id)} personne${count(id) > 1 ? "s" : ""} dans cette branche, rattachements directs et indirects compris.`
      : "Aucun autre rattachement indiqué dans le projet.";
    const wasOpen = dialog.open;
    if (!wasOpen) dialog.showModal();
    title.focus({ preventScroll: true });
    motion.animate(
      wasOpen ? dialog.querySelector(".person-content") : dialog,
      [
        { opacity: 0.4, transform: "translateY(10px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: wasOpen ? 180 : 280, easing: "cubic-bezier(.16,1,.3,1)" },
    );
  }

  for (const surface of [tree, dialog]) {
    surface.addEventListener("click", (event) => {
      const button = event.target.closest("[data-person]");
      if (button) open(button.dataset.person);
    });
  }
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
