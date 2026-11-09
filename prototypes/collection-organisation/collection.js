import { positionAtlas } from '../../src/kit-atlas.js';

const kits = [
  { name: 'Domicile V1', colours: 'Rouge & or', alt: 'Face du maillot Domicile V1 VALORIA FC rouge et or, sans sponsor' },
  { name: 'Domicile V2', colours: 'Bleu nuit & or', alt: 'Face du maillot Domicile V2 VALORIA FC bleu nuit et or, sans sponsor' },
  { name: 'Extérieur', colours: 'Crème & or', alt: 'Face du maillot Extérieur VALORIA FC crème et or, sans sponsor' },
  { name: 'Third', colours: 'Violet & or', alt: 'Face du troisième maillot VALORIA FC noir, violet et or, sans sponsor' },
];

export function initCollection() {
  const section = document.querySelector('#collection');
  const tabs = [...section.querySelectorAll('[data-kit]')];
  const panel = section.querySelector('#kit-panel');
  const viewport = section.querySelector('.kit-viewport');
  const image = viewport.querySelector('img');
  const back = section.querySelector('#kit-back-state');
  const viewButtons = [...section.querySelectorAll('[data-view]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let selected = 0, view = 'face', animation;
  const noMotion = () => reduced.matches || document.documentElement.classList.contains('static-motion');
  const size = () => positionAtlas(viewport, image, selected);
  function render(animate = true) {
    animation?.cancel();
    const kit = kits[selected];
    for (const [i, tab] of tabs.entries()) {
      tab.setAttribute('aria-selected', String(i === selected));
      tab.tabIndex = i === selected ? 0 : -1;
    }
    panel.setAttribute('aria-labelledby', tabs[selected].id);
    section.querySelector('#kit-name').textContent = kit.name;
    section.querySelector('#kit-colours').textContent = kit.colours;
    section.querySelector('#kit-number').textContent = `0${selected + 1}`;
    image.alt = kit.alt;
    viewport.hidden = view !== 'face';
    back.hidden = view !== 'back';
    for (const button of viewButtons) button.setAttribute('aria-pressed', String(button.dataset.view === view));
    section.querySelector('#kit-announcement').textContent = `${kit.name}. ${view === 'face' ? 'Vue de face.' : 'Vue de dos : visuel en attente de validation.'}`;
    if (view === 'face') size();
    if (animate && !noMotion()) {
      // The original flat artwork only crossfades/translates; there is no garment rotation.
      animation = (view === 'face' ? viewport : back).animate([
        { opacity: .15, transform: 'translateY(8px)' },
        { opacity: 1, transform: 'none' },
      ], { duration: 260, easing: 'cubic-bezier(.16,1,.3,1)' });
    }
  }
  function select(index, focus = false) {
    selected = index;
    render();
    if (focus) tabs[selected].focus({ preventScroll: true });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (selected + 1) % kits.length;
      if (event.key === 'ArrowLeft') next = (selected + kits.length - 1) % kits.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = kits.length - 1;
      if (next === undefined) return;
      event.preventDefault(); select(next, true);
    });
  });
  for (const button of viewButtons) button.addEventListener('click', () => { view = button.dataset.view; render(); });
  image.addEventListener('load', size);
  const resize = new ResizeObserver(() => { if (view === 'face') size(); });
  resize.observe(viewport);
  const cancel = () => { if (noMotion()) animation?.cancel(); };
  reduced.addEventListener('change', cancel);
  new MutationObserver(cancel).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  render(false);
}
