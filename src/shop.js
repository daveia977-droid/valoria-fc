import { uiIcon } from './ui-icons.js';
const merchandise = Object.freeze([
  { id:'domicile', type:'maillots', name:'Maillot Domicile', detail:'Bleu nuit & or · 2026/27', note:'La tenue principale de VALORIA FC, avec le marquage NW$. Visuel officiel du projet.', kit:0 },
  { id:'exterieur', type:'maillots', name:'Maillot Extérieur', detail:'Crème & or · 2026/27', note:'Une silhouette claire, fidèle à la collection validée du club.', kit:1 },
  { id:'third', type:'maillots', name:'Maillot Third', detail:'Noir, violet & or · 2026/27', note:'Notre troisième identité sur le terrain, dans les couleurs de la collection.', kit:2 },
  { id:'echarpe', type:'echarpes', name:'Écharpe VALORIA', detail:'Bordeaux & or · Concept', note:'Une écharpe à porter les jours de match ou dans les tribunes.', image:'scarf.svg' },
  { id:'gants', type:'gants', name:'Gants d’entraînement', detail:'Noir & bordeaux · Concept', note:'Une paire de gants pensée pour les séances d’hiver.', image:'gloves.svg' },
  { id:'chaussettes', type:'chaussettes', name:'Chaussettes club', detail:'Bordeaux & or · Concept', note:'Des chaussettes longues inspirées de notre identité.', image:'socks.svg' },
  { id:'casquette', type:'accessoires', name:'Casquette VALORIA', detail:'Bordeaux & or · Concept', note:'Un accessoire de tous les jours aux couleurs du club.', image:'cap.svg' },
  { id:'gourde', type:'accessoires', name:'Gourde VALORIA', detail:'Bordeaux & or · Concept', note:'Une gourde réutilisable pensée pour les entraînements.', image:'bottle.svg' }
]);
const atlas = [
  {center:703,width:450,left:487,right:920},
  {center:1132,width:450,left:920,right:1349},
  {center:1570,width:480,left:1349,right:1832}
];
const sponsor = '<svg class="shop-kit-sponsor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 106" aria-hidden="true" focusable="false"><text x="120" y="72" text-anchor="middle">NW$</text><path d="M38 82C85 91 152 94 205 79" fill="none" stroke="currentColor" stroke-width="3.8" stroke-linecap="round"/></svg>';

function merchandiseArt(item) {
  if (item.kit !== undefined) {
    return '<div class="shop-art shop-art-kit" aria-hidden="true"><div class="shop-kit-frame" data-shop-kit="' + item.kit + '">' +
      '<img class="shop-kit-sheet" src="/assets/collection.webp" alt="" width="1832" height="859" loading="lazy">' + sponsor + '</div></div>';
  }
  return '<div class="shop-art shop-art-accessory"><img src="/assets/shop/' + item.image + '" alt="Illustration du concept : ' + item.name + '" width="640" height="640" loading="lazy"></div>';
}

function catalogueCard(item) {
  const concept = item.kit === undefined;
  return '<article class="shop-product" data-category="' + item.type + '">' +
    merchandiseArt(item) +
    '<div class="shop-product-copy"><span class="shop-product-category">' + (concept ? 'Merchandising' : 'Collection 2026 / 2027') + '</span>' +
    '<h3>' + item.name + '</h3><p>' + item.detail + '</p>' +
    '<div class="shop-product-bottom"><span>Prix à annoncer</span><button type="button" class="shop-product-view" data-product="' + item.id + '">Voir la fiche ' + uiIcon('arrow-up-right') + '</button></div>' +
    '</div></article>';
}

function positionGarments(root) {
  for (const frame of root.querySelectorAll('.shop-kit-frame')) {
    const image = frame.querySelector('.shop-kit-sheet');
    const kit = atlas[Number(frame.dataset.shopKit)];
    frame.style.aspectRatio = kit.width / 648;
    image.style.height = (859 / 648 * 100) + '%';
    image.style.top = (-96 / 648 * 100) + '%';
    image.style.clipPath = 'inset(0 ' + ((1-kit.right/1832)*100) + '% 0 ' + (kit.left/1832*100) + '%)';
    image.style.transform = 'translateX(' + (frame.clientWidth/2 - kit.center/1832*image.clientWidth) + 'px)';
  }
}
export function initShop() {
  const section = document.querySelector('#boutique');
  if (!section) return;
  const grid = section.querySelector('#shop-products');
  const filters = [...section.querySelectorAll('.shop-filter')];
  const dialog = document.querySelector('#shop-product-dialog');
  grid.innerHTML = merchandise.map(catalogueCard).join('');

  const resize = () => positionGarments(document);
  requestAnimationFrame(resize);
  const observer = new ResizeObserver(resize);
  for (const frame of document.querySelectorAll('.shop-kit-frame')) {
    observer.observe(frame);
    frame.querySelector('img').addEventListener('load', resize);
  }

  filters.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    for (const item of filters) {
      const active = item === button;
      item.setAttribute('aria-pressed', String(active));
      item.classList.toggle('is-active', active);
    }
    let count = 0;
    for (const card of grid.querySelectorAll('.shop-product')) {
      const visible = filter === 'tous' || card.dataset.category === filter;
      card.hidden = !visible;
      if (visible) count++;
    }
    section.querySelector('#shop-result-count').textContent = count + (count === 1 ? ' article' : ' articles');
    requestAnimationFrame(resize);
  }));

  let opener;
  grid.addEventListener('click', event => {
    const btn = event.target.closest('button[data-product]');
    if (!btn) return;
    const item = merchandise.find(x => x.id === btn.dataset.product);
    if (!item) return;
    opener = btn;
    dialog.querySelector('#shop-dialog-title').textContent = item.name;
    dialog.querySelector('#shop-dialog-detail').textContent = item.detail;
    dialog.querySelector('#shop-dialog-desc').textContent = item.note;
    const media = dialog.querySelector('#shop-dialog-visual');
    media.innerHTML = merchandiseArt(item);
    dialog.showModal();
    const frame = media.querySelector('.shop-kit-frame');
    if (frame) { observer.observe(frame); frame.querySelector('img').addEventListener('load', resize, { once:true }); }
    requestAnimationFrame(resize);
  });
  dialog.addEventListener('close', () => { opener?.focus({preventScroll:true}); opener = null; });
}
