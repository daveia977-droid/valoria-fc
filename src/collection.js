const kits = [
  { name: 'Domicile', colours: 'Bleu nuit & or', alt: 'Maillot officiel domicile VALORIA FC bleu nuit et or, sponsor NW$', center: 703, width: 450, left: 487, right: 920 },
  { name: 'Extérieur', colours: 'Crème & or', alt: 'Maillot extérieur VALORIA FC crème et or, sponsor NW$', center: 1132, width: 450, left: 920, right: 1349 },
  { name: 'Third', colours: 'Noir, violet & or', alt: 'Troisième maillot VALORIA FC noir, violet et or, sponsor NW$', center: 1570, width: 480, left: 1349, right: 1832 },
];

function position(viewport, image, index) {
  const kit = kits[index];
  viewport.style.aspectRatio = kit.width / 648;
  image.style.height = (859 / 648 * 100) + '%';
  image.style.top = (-96 / 648 * 100) + '%';
  image.style.clipPath = 'inset(0 ' + ((1 - kit.right / 1832) * 100) + '% 0 ' + ((kit.left / 1832) * 100) + '%)';
  image.style.transform = 'translateX(' + (viewport.clientWidth / 2 - kit.center / 1832 * image.clientWidth) + 'px)';
}

export function initCollection() {
  const section = document.querySelector('#collection');
  if (!section) return;
  const tabs = [...section.querySelectorAll('[data-kit]')];
  const viewport = section.querySelector('.kit-viewport');
  const image = viewport.querySelector('img');
  const panel = section.querySelector('#kit-panel');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let selected = 0, animation;
  const paused = () => reduced.matches || document.documentElement.classList.contains('static-motion');
  const resize = () => position(viewport, image, selected);
  function select(index, focus = false, animate = true) {
    if (index < 0 || index >= kits.length) return;
    animation?.cancel();
    selected = index;
    tabs.forEach((tab,i)=>{
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tabs[index].id);
    panel.dataset.kit = String(index);
    section.querySelector('#kit-name').textContent = kits[index].name;
    section.querySelector('#kit-colours').textContent = kits[index].colours;
    section.querySelector('#kit-number').textContent = String(index + 1).padStart(2,'0');
    section.querySelector('.kit-counter').lastChild.textContent = ' / 03';
    section.querySelector('#kit-announcement').textContent = kits[index].name + ', ' + kits[index].colours + ', sponsor NW$.';
    image.alt = kits[index].alt;
    resize();
    if (focus) tabs[index].focus({preventScroll:true});
    if (animate && !paused()) animation = viewport.animate([
      { opacity: .3, transform: 'translateY(8px)' },
      { opacity: 1, transform: 'none' }
    ], {duration:260,easing:'cubic-bezier(.16,1,.3,1)'});
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>select(index));
    tab.addEventListener('keydown',event=>{
      const next = { ArrowRight:(index + 1) % 3, ArrowLeft:(index + 2) % 3, Home:0, End:2 }[event.key];
      if(next === undefined)return;
      event.preventDefault();
      select(next,true);
    });
  });
  const observer = new ResizeObserver(resize);
  observer.observe(viewport);
  image.addEventListener('load',resize);
  reduced.addEventListener('change',()=>{if(paused())animation?.cancel();});
  new MutationObserver(()=>{if(paused())animation?.cancel();}).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  select(0,false,false);
}
