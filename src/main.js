import './style.css';
import './hero-motion.js';
import { initCollection } from './collection.js';
import { initClubOrganisation } from './club-organisation.js';
initCollection();
initClubOrganisation();

const menu = document.querySelector('#mobile-menu');
const contact = document.querySelector('#contact-dialog');
document.querySelector('#menu-open').addEventListener('click', () => menu.showModal());
document.querySelector('#contact-open').addEventListener('click', () => contact.showModal());
for (const dialog of document.querySelectorAll('dialog')) {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
}
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.close()));

document.querySelector('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const text = `VALORIA FC — Brouillon de message\n\nNom : ${data.get('name')}\nE-mail : ${data.get('email')}\nSujet : ${data.get('subject')}\n\n${data.get('message')}\n\nCe fichier est un brouillon. Aucun message n’a été envoyé.\n`;
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const link = Object.assign(document.createElement('a'), { href: url, download: 'message-valoria-fc.txt' });
  link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector('#form-status').textContent = 'Votre brouillon a été préparé pour téléchargement. Aucun message n’a été envoyé.';
});

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const chapters = [...document.querySelectorAll('.chapter')];
const nav = [...document.querySelectorAll('.desktop-nav a')];
const paused = () => reduced.matches || root.classList.contains('static-motion');
root.classList.add('js-chapters');
const visibility = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); }); }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
chapters.forEach(chapter => visibility.observe(chapter));
let frame = 0;
function render() {
  frame = 0;
  const rectangles = chapters.map(chapter => chapter.getBoundingClientRect());
  let active = '#identite';
  chapters.forEach((chapter, i) => {
    const r = rectangles[i];
    if (r.top <= innerHeight * .4) active = `#${chapter.id}`;
    if (r.bottom < 0 || r.top > innerHeight) return;
    const p = Math.max(-1, Math.min(1, (innerHeight / 2 - r.top - r.height / 2) / innerHeight));
    chapter.style.setProperty('--chapter-shift', `${paused() ? 0 : p * (innerWidth < 761 ? 16 : 26)}px`);
  });
  nav.forEach(link => { if (link.getAttribute('href') === active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
}
function schedule() { if (!frame && !document.hidden) frame = requestAnimationFrame(render); }
addEventListener('scroll', schedule, { passive: true }); addEventListener('resize', schedule, { passive: true });
document.addEventListener('visibilitychange', schedule); reduced.addEventListener('change', schedule);
new MutationObserver(schedule).observe(root, { attributes: true, attributeFilter: ['class'] });
render();
