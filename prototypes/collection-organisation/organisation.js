import { people } from '../../src/organisation.js';

/** Preserve the site's seven validated profiles and native modal interactions. */
export function initOrganisationPrototype() {
  const section = document.querySelector('#organisation');
  const tree = section?.querySelector('.org-tree');
  const dialog = section?.querySelector('#org-person-dialog');
  if (!tree || !dialog) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const title = dialog.querySelector('#org-person-name');
  let opener = null;
  let entrance = null;
  section.classList.add('org-motion-ready');

  const count = id => people[id].reports.reduce((total, child) => total + 1 + count(child), 0);
  const canAnimate = () => !reduced.matches && !document.documentElement.classList.contains('static-motion');

  function personLink(id) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'org-person-link';
    button.dataset.orgPerson = id;
    button.textContent = `${people[id].name} — ${people[id].role}`;
    return button;
  }

  function open(id, trigger) {
    const person = people[id];
    if (!person) return;
    const path = [];
    for (let current = id; current; current = people[current].manager) path.push(current);
    tree.querySelectorAll('[data-org-person]').forEach(button => {
      button.classList.toggle('is-selected', button.dataset.orgPerson === id);
      button.classList.toggle('is-lineage', path.includes(button.dataset.orgPerson));
      button.closest('li').classList.toggle('org-has-path', path.includes(button.dataset.orgPerson));
    });

    title.textContent = person.name;
    dialog.querySelector('#org-person-role').textContent = person.role;
    dialog.querySelector('#org-person-description').textContent = person.description;
    const manager = dialog.querySelector('#org-person-manager');
    manager.replaceChildren();
    if (person.manager) manager.append(personLink(person.manager));
    else manager.textContent = 'Présidence — sommet de l’organigramme.';

    const reports = dialog.querySelector('#org-person-reports');
    reports.replaceChildren();
    for (const child of person.reports) {
      const item = document.createElement('li');
      item.append(personLink(child));
      reports.append(item);
    }
    reports.hidden = person.reports.length === 0;
    dialog.querySelector('#org-person-empty').hidden = person.reports.length > 0;
    const descendants = count(id);
    dialog.querySelector('#org-person-count').textContent = descendants
      ? `${descendants} personne${descendants > 1 ? 's' : ''} dans cette branche, rattachements directs et indirects compris.`
      : 'Aucun autre rattachement indiqué dans le projet.';

    if (!dialog.open) {
      opener = trigger;
      dialog.showModal();
      if (canAnimate()) {
        entrance?.cancel();
        entrance = dialog.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'cubic-bezier(.16,1,.3,1)' });
      }
    }
    title.focus({ preventScroll: true });
  }

  for (const surface of [tree, dialog]) {
    surface.addEventListener('click', event => {
      const button = event.target.closest('[data-org-person]');
      if (button && surface.contains(button)) open(button.dataset.orgPerson, button);
    });
  }
  dialog.querySelector('[data-org-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    entrance?.cancel();
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  });
  reduced.addEventListener('change', () => { if (reduced.matches) entrance?.cancel(); });
}
