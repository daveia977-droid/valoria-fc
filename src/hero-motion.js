import pauseIcon from '@phosphor-icons/core/assets/regular/pause.svg';
import playIcon from '@phosphor-icons/core/assets/regular/play.svg';
import arrowIcon from '@phosphor-icons/core/assets/regular/arrow-up-right.svg';
import downIcon from '@phosphor-icons/core/assets/regular/arrow-down.svg';

const root = document.documentElement;
const story = document.querySelector('.story');
const scene = document.querySelector('.scene');
const identity = document.querySelector('.identity');
const heroAction = document.querySelector('.hero-action');
const toggle = document.querySelector('#pause');
const clubLink = document.querySelector('.navigation a[href="#identite"]');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const mobile = matchMedia('(max-width: 760px)');
const short = matchMedia('(max-height: 650px)');
const entrances = [];
let manual = false;
let frame = 0;
let focusTimer;
const clamp = x => Math.min(1, Math.max(0, x));
const ease = x => x * x * (3 - 2 * x);
const stopped = () => manual || reduced.matches;
const variable = (name, value) => root.style.setProperty(name, String(value));

for (const icon of document.querySelectorAll('[data-icon]')) {
  icon.src = { pause: pauseIcon, arrow: arrowIcon, down: downIcon }[icon.dataset.icon];
}

function render() {
  frame = 0;
  if (stopped() || document.hidden) return;
  const p = clamp(-story.getBoundingClientRect().top / Math.max(1, story.offsetHeight - scene.offsetHeight));
  const t = ease(clamp((p - .08) / .8));
  const reveal = ease(clamp((p - .4) / .3));
  variable('--p', p.toFixed(5));
  variable('--opening', 1 - ease(clamp(p / .36)));
  variable('--title-y', `${-ease(clamp(p / .4)) * 42}px`);
  variable('--identity', reveal);
  variable('--identity-y', `${(1 - reveal) * 24}px`);
  variable('--identity-events', p >= .68 ? 'auto' : 'none');
  variable('--travel-x', `${t * innerWidth * (mobile.matches ? .23 : .22)}px`);
  variable('--travel-y', `${t * innerHeight * (mobile.matches ? (short.matches ? .25 : .21) : (short.matches ? -.09 : -.06))}px`);
  variable('--scale', 1 - t * (mobile.matches ? (short.matches ? .4 : .44) : .06));
  variable('--tilt', `${t * -7}deg`);
  // Keep keyboard focus on a persistent control before its current branch disappears.
  if ((p < .68 && identity.contains(document.activeElement)) ||
      (p > .22 && heroAction.contains(document.activeElement))) {
    clubLink.focus({ preventScroll: true });
  }
  identity.setAttribute('aria-hidden', String(p < .68));
  identity.inert = p < .68;
  heroAction.inert = p > .22;
  heroAction.setAttribute('aria-hidden', String(p > .22));
  scene.dataset.progress = p.toFixed(5);
}

function schedule() {
  if (!frame && !stopped() && !document.hidden) frame = requestAnimationFrame(render);
}

function sync() {
  clearTimeout(focusTimer);
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  const isStopped = stopped();
  const keepIdentityPosition = isStopped && !root.classList.contains('static-motion') && Number(scene.dataset.progress) >= .68;
  const previousTop = keepIdentityPosition ? identity.querySelector('h2').getBoundingClientRect().top : null;
  root.classList.toggle('static-motion', isStopped);
  toggle.disabled = reduced.matches;
  toggle.setAttribute('aria-pressed', String(isStopped));
  toggle.setAttribute('aria-label', reduced.matches ? 'Animations réduites selon vos préférences' : isStopped ? 'Reprendre les animations' : 'Mettre en pause les animations');
  toggle.querySelector('.pause-word').textContent = isStopped ? 'En pause' : 'Pause';
  toggle.querySelector('.icon').src = isStopped ? playIcon : pauseIcon;
  if (isStopped) {
    for (const animation of entrances) animation.cancel();
    identity.removeAttribute('aria-hidden');
    identity.inert = false;
    heroAction.removeAttribute('aria-hidden');
    heroAction.inert = false;
    if (keepIdentityPosition) {
      const shift = identity.querySelector('h2').getBoundingClientRect().top - previousTop;
      scrollBy({ top: shift, behavior: 'instant' });
    }
  } else schedule();
}

toggle.addEventListener('click', () => { manual = !manual; sync(); });
reduced.addEventListener('change', sync);
mobile.addEventListener('change', schedule);
short.addEventListener('change', schedule);
addEventListener('scroll', schedule, { passive: true });
addEventListener('resize', schedule, { passive: true });
document.addEventListener('visibilitychange', () => { if (!document.hidden) schedule(); });

for (const link of document.querySelectorAll('a[href="#identite"]')) {
  link.addEventListener('click', event => {
    event.preventDefault();
    if (location.hash !== "#identite") history.pushState(null, "", "#identite");
    clearTimeout(focusTimer);
    if (stopped()) {
      identity.scrollIntoView({ behavior: 'instant', block: 'start' });
      identity.querySelector('h2').focus({ preventScroll: true });
    } else {
      scrollTo({ top: story.offsetTop + (story.offsetHeight - scene.offsetHeight) * .94, behavior: 'smooth' });
      focusTimer = setTimeout(() => {
        // A later Tab/click must keep its focus; never steal it after navigation.
        if (!identity.inert && document.activeElement === link) identity.querySelector('h2').focus({ preventScroll: true });
      }, 700);
    }
  });
}

sync();
// One-shot entry. This is the original 2D crest, not a volumetric 3D model.
if (!stopped()) {
  for (const [selector, delay, start] of [
    ['.title-reveal', 60, { opacity: 0, transform: 'translateY(14px)' }],
    ['.crest-reveal', 170, { opacity: 0, transform: 'translateY(18px) scale(.96)' }],
    ['.hero-action', 330, { opacity: 0 }],
    ['.scene-footer', 380, { opacity: 0 }],
  ]) {
    entrances.push(document.querySelector(selector).animate([start, { opacity: 1, transform: 'none' }], {
      duration: 1000, delay, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'backwards',
    }));
  }
  // Immediate scrolling takes control; no entry animation can obscure the scroll state.
  addEventListener('scroll', () => { for (const animation of entrances) animation.cancel(); }, { once: true, passive: true });
}
