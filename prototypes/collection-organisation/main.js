// Reuse the validated A/B prototype as-is, with local navigation in this sandbox.
import '../hero-cinematique/motion.js';
import { initCollection } from './collection.js';
import { initOrganisationPrototype } from './organisation.js';

initCollection();
initOrganisationPrototype();
const root = document.documentElement;
const chapters = [...document.querySelectorAll('.chapter')];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const noMotion = () => reduced.matches || root.classList.contains('static-motion');
root.classList.add('js-chapters');
const visibility = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  }
}, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
chapters.forEach(chapter => visibility.observe(chapter));
let frame = 0;
function render() {
  frame = 0;
  // Read geometry together, then write only the lightweight decorative transforms.
  const positions = chapters.map(chapter => chapter.getBoundingClientRect());
  chapters.forEach((chapter, i) => {
    const rect = positions[i];
    if (rect.bottom < 0 || rect.top > innerHeight) return;
    const progress = Math.max(-1, Math.min(1, (innerHeight / 2 - rect.top - rect.height / 2) / innerHeight));
    chapter.style.setProperty('--chapter-shift', `${noMotion() ? 0 : progress * (innerWidth < 761 ? 16 : 26)}px`);
  });
}
function schedule() { if (!frame && !document.hidden && !noMotion()) frame = requestAnimationFrame(render); }
addEventListener('scroll', schedule, { passive: true });
addEventListener('resize', schedule, { passive: true });
document.addEventListener('visibilitychange', schedule);
reduced.addEventListener('change', () => { render(); });
new MutationObserver(() => { render(); }).observe(root, { attributes: true, attributeFilter: ['class'] });
render();
