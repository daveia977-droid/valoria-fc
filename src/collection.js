const kits = [
  { name: 'Domicile V1', colours: 'Rouge & or', alt: 'Maillot Domicile V1 VALORIA FC rouge et or, sans sponsor', center: 265, width: 480, left: 0, right: 487 },
  { name: 'Domicile V2', colours: 'Bleu nuit & or', alt: 'Maillot Domicile V2 VALORIA FC bleu nuit et or, sans sponsor', center: 703, width: 450, left: 487, right: 920 },
  { name: 'Extérieur', colours: 'Crème & or', alt: 'Maillot Extérieur VALORIA FC crème et or, sans sponsor', center: 1132, width: 450, left: 920, right: 1349 },
  { name: 'Third', colours: 'Violet & or', alt: 'Troisième maillot VALORIA FC noir, violet et or, sans sponsor', center: 1570, width: 480, left: 1349, right: 1832 },
];

function position(viewport, image, index) {
  const kit = kits[index];
  viewport.style.aspectRatio = kit.width / 648;
  // Preserve source scale/proportions and isolate the authentic garment from its neighbours.
  image.style.height = `${859 / 648 * 100}%`;
  image.style.top = `${-96 / 648 * 100}%`;
  image.style.clipPath = `inset(0 ${(1 - kit.right / 1832) * 100}% 0 ${kit.left / 1832 * 100}%)`;
  image.style.transform = `translateX(${viewport.clientWidth / 2 - kit.center / 1832 * image.clientWidth}px)`;
}

export function initCollection() {
  const section = document.querySelector('#collection');
  const tabs = [...section.querySelectorAll('[data-kit]')];
  const viewport = section.querySelector('.kit-viewport');
  const image = viewport.querySelector('img');
  const panel = section.querySelector('#kit-panel');
  const comparison = section.querySelector('#home-comparison');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let selected = 0, animation;
  const paused = () => reduced.matches || document.documentElement.classList.contains('static-motion');
  const resize = () => {
    position(viewport, image, selected);
    section.querySelectorAll('[data-comparison]').forEach(element => position(element, element.querySelector('img'), Number(element.dataset.comparison)));
  };
  function select(index, focus = false, animate = true) {
    animation?.cancel(); selected = index;
    tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    panel.setAttribute('aria-labelledby', tabs[index].id);
    section.querySelector('#kit-name').textContent = kits[index].name;
    section.querySelector('#kit-colours').textContent = kits[index].colours;
    section.querySelector('#kit-number').textContent = `0${index + 1}`;
    section.querySelector('#kit-announcement').textContent = `${kits[index].name}, ${kits[index].colours}.`;
    image.alt = kits[index].alt;
    resize();
    if (focus) tabs[index].focus({ preventScroll: true });
    if (animate && !paused()) animation = viewport.animate([{ opacity: .2, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.16,1,.3,1)' });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      const next = { ArrowRight: (index + 1) % 4, ArrowLeft: (index + 3) % 4, Home: 0, End: 3 }[event.key];
      if (next === undefined) return; event.preventDefault(); select(next, true);
    });
  });
  const observer = new ResizeObserver(resize);
  observer.observe(viewport);
  section.querySelectorAll('[data-comparison]').forEach(element => observer.observe(element));
  section.querySelectorAll('.kit-strip').forEach(element => element.addEventListener('load', resize));
  comparison.addEventListener('toggle', resize);
  const cancel = () => { if (paused()) animation?.cancel(); };
  reduced.addEventListener('change', cancel);
  new MutationObserver(cancel).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  select(0, false, false);
}
