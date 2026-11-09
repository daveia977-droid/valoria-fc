import { people } from './organisation.js';

export function initClubOrganisation() {
  const surface = document.querySelector('#club-people');
  const dialog = document.querySelector('#person-dialog');
  const title = dialog.querySelector('#person-name');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let opener, animation;
  const count = id => people[id].reports.reduce((n, child) => n + 1 + count(child), 0);
  const paused = () => reduced.matches || document.documentElement.classList.contains('static-motion');
  function link(id) {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'person-link'; button.dataset.person = id;
    button.textContent = `${people[id].name} — ${people[id].role}`; return button;
  }
  function open(id, trigger) {
    const person = people[id]; if (!person) return;
    title.textContent = person.name;
    dialog.querySelector('#person-role').textContent = person.role;
    dialog.querySelector('#person-description').textContent = person.description;
    const manager = dialog.querySelector('#person-manager'); manager.replaceChildren();
    if (person.manager) manager.append(link(person.manager)); else manager.textContent = 'Présidence — sommet de l’organisation.';
    const reports = dialog.querySelector('#person-reports'); reports.replaceChildren();
    person.reports.forEach(child => { const li = document.createElement('li'); li.append(link(child)); reports.append(li); });
    reports.hidden = !person.reports.length;
    dialog.querySelector('#person-empty').hidden = !!person.reports.length;
    const total = count(id);
    dialog.querySelector('#person-count').textContent = total ? `${total} personne${total > 1 ? 's' : ''} dans cette branche, rattachements directs et indirects compris.` : 'Aucun autre rattachement indiqué dans le projet.';
    animation?.cancel();
    if (!dialog.open) { opener = trigger; dialog.showModal(); }
    title.focus({ preventScroll: true });
    surface.querySelectorAll('[data-person]').forEach(button => button.classList.toggle('is-selected', button.dataset.person === id));
    if (!paused()) animation = dialog.querySelector('.person-content').animate([{ opacity: .4, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'cubic-bezier(.16,1,.3,1)' });
  }
  for (const element of [surface, dialog]) element.addEventListener('click', event => {
    const button = event.target.closest('[data-person]'); if (button && element.contains(button)) open(button.dataset.person, button);
  });
  dialog.addEventListener('close', () => { animation?.cancel(); opener?.focus({ preventScroll: true }); });
  const cancel = () => { if (paused()) animation?.cancel(); };
  reduced.addEventListener('change', cancel);
  new MutationObserver(cancel).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}
