import { uiIcon } from './ui-icons.js';

const currency = new Intl.NumberFormat('fr-FR', {style:'currency',currency:'EUR',maximumFractionDigits:2});
const money = amount => currency.format(amount);
export const merchandise = Object.freeze([
 {id:'domicile',type:'maillots',name:'Maillot Domicile',detail:'Bleu nuit & or · 2026/27',note:'Le maillot officiel de VALORIA FC, bleu nuit et or, avec le marquage NW$.',kit:0,price:100,sizes:['XS','S','M','L','XL','2XL']},
 {id:'exterieur',type:'maillots',name:'Maillot Extérieur',detail:'Crème & or · 2026/27',note:'La tenue extérieure crème et or validée pour la collection 2026/27.',kit:1,price:100,sizes:['XS','S','M','L','XL','2XL']},
 {id:'third',type:'maillots',name:'Maillot Third',detail:'Noir, violet & or · 2026/27',note:'Troisième maillot VALORIA FC, dans le style noir, violet et or.',kit:2,price:100,featured:true,sizes:['XS','S','M','L','XL','2XL']},
 {id:'echarpe',type:'echarpes',name:'Écharpe VALORIA',detail:'Bordeaux & or · Concept photo',note:'Écharpe de supporter en bordeaux et or. Photographie conceptuelle, produit non fabriqué.',photo:0,price:30,sizes:['Unique']},
 {id:'gants',type:'gants',name:'Gants d’entraînement',detail:'Noir & bordeaux · Concept photo',note:'Gants d’entraînement aux couleurs de VALORIA FC. Concept, disponibilité à confirmer.',photo:1,price:30,sizes:['S','M','L']},
 {id:'chaussettes',type:'chaussettes',name:'Chaussettes club',detail:'Bordeaux & or · Concept photo',note:'Chaussettes de football côtelées. Concept de merchandising, sans stock réel.',photo:2,price:20,sizes:['36–39','40–43','44–47']},
 {id:'casquette',type:'accessoires',name:'Casquette VALORIA',detail:'Bordeaux & or · Concept photo',note:'Casquette brodée inspirée du club. Visuel de présentation uniquement.',photo:3,price:30,sizes:['Unique']},
 {id:'gourde',type:'accessoires',name:'Gourde VALORIA',detail:'Bordeaux & or · Concept photo',note:'Gourde métallique bordeaux et or imaginée pour VALORIA FC.',photo:4,price:30,sizes:['Unique']}
]);
const transparentKits = new Map();
const atlas=[
 {center:703,width:450,left:487,right:920},
 {center:1132,width:450,left:920,right:1349},
 {center:1570,width:480,left:1349,right:1832}
];
const sponsor='<svg class="shop-kit-sponsor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 106" aria-hidden="true" focusable="false"><text x="120" y="72" text-anchor="middle">NW$</text><path d="M38 82C85 91 152 94 205 79" fill="none" stroke="currentColor" stroke-width="3.8" stroke-linecap="round"/></svg>';
const STORAGE_KEY='valoria-cart-v6-session';
const positions=['0%','25%','50%','75%','100%'];
const itemById=id=>merchandise.find(item=>item.id===id);
const cleanQuantity=value=>Math.max(1,Math.min(9,Number.parseInt(value,10)||1));
const cartKey=(id,size)=>id+':'+size;
const formatDate=date=>new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'long',year:'numeric'}).format(date);
const dateString=date=>[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
const addDays=(d,n)=>new Date(d.getFullYear(),d.getMonth(),d.getDate()+n);

function readCart() {
 try{
  const raw=JSON.parse(sessionStorage.getItem(STORAGE_KEY)||'[]');
  if(!Array.isArray(raw)) return [];
  return raw.filter(e=>e&&itemById(e.id)&&itemById(e.id).sizes.includes(e.size)&&Number.isFinite(Number(e.qty)))
   .map(e=>({id:e.id,size:e.size,qty:cleanQuantity(e.qty)})).slice(0,25);
 }catch{return []}
}
const sum=cart=>cart.reduce((acc,line)=>acc+itemById(line.id).price*line.qty,0);
const count=cart=>cart.reduce((acc,line)=>acc+line.qty,0);

function merchandiseArt(item){
 if(item.kit!==undefined) return '<div class="shop-art shop-art-kit" role="img" aria-label="Visuel du maillot '+item.name+'"><div class="shop-kit-frame" data-shop-kit="'+item.kit+'">'+
  (transparentKits.has(item.kit)
    ? '<img class="shop-kit-cutout" src="'+transparentKits.get(item.kit)+'" alt="" width="480" height="648">'
    : '<img class="shop-kit-sheet" src="/assets/collection.webp" alt="" width="1832" height="859" loading="lazy">'
  )+sponsor+'</div>'+(item.featured?'<span class="shop-best-seller">Meilleure vente</span>':'')+'</div>';
 return '<div class="shop-art shop-art-accessory"><div class="shop-product-photo" role="img" aria-label="Photographie conceptuelle de '+item.name+'" style="--photo-position:'+positions[item.photo]+'"></div></div>';
}
function productCard(item){
 return '<article class="shop-product" data-category="'+item.type+'">'+merchandiseArt(item)+
  '<div class="shop-product-copy"><span class="shop-product-category">'+(item.kit!==undefined?'Collection 2026 / 2027':'Merchandising · Concept')+'</span>'+
  '<h3>'+item.name+'</h3><p>'+item.detail+'</p>'+
  '<div class="shop-product-bottom"><span class="shop-card-price">'+money(item.price)+'</span>'+
  '<button type="button" class="shop-product-view" data-product="'+item.id+'">Voir les détails '+uiIcon('arrow-up-right')+'</button></div></div></article>';
}
function positionGarments(root){
 for(const frame of root.querySelectorAll('.shop-kit-frame')){
  if(!frame.clientWidth) continue;
  const image=frame.querySelector('.shop-kit-sheet'),kit=atlas[Number(frame.dataset.shopKit)];
  if(!image) continue;
  frame.style.aspectRatio=String(kit.width/648);
  image.style.height=(859/648*100)+'%';
  image.style.top=(-96/648*100)+'%';
  image.style.clipPath='inset(0 '+((1-kit.right/1832)*100)+'% 0 '+(kit.left/1832*100)+'%)';
  if(image.clientWidth) image.style.transform='translateX('+(frame.clientWidth/2-kit.center/1832*image.clientWidth)+'px)';
 }
}


/**
 * Make actual transparent garment thumbnails from the original approved kit atlas.
 * The source mask is shipped with the site. No new artwork, remote API or third-party
 * photo is introduced; original colours, shape and sponsor overlay are preserved.
 * CSS-mask sprites remain a fallback if Canvas is unavailable (e.g. blocked graphics).
 */
async function prepareKitCutouts() {
  if (transparentKits.size === atlas.length) return;
  const source = new Image();
  const mask = new Image();
  source.src = '/assets/collection.webp';
  mask.src = '/assets/collection-mask.png';
  await Promise.all([source.decode(), mask.decode()]);
  if (!source.naturalWidth || !mask.naturalWidth) return;
  const width = source.naturalWidth, height = source.naturalHeight;
  const sourceCanvas = document.createElement('canvas');
  sourceCanvas.width=width; sourceCanvas.height=height;
  const sourceContext=sourceCanvas.getContext('2d',{willReadFrequently:true});
  const maskCanvas=document.createElement('canvas');
  maskCanvas.width=width; maskCanvas.height=height;
  const maskContext=maskCanvas.getContext('2d',{willReadFrequently:true});
  if (!sourceContext || !maskContext) return;
  sourceContext.drawImage(source,0,0,width,height);
  maskContext.drawImage(mask,0,0,width,height);
  // Masks may be encoded either as transparency or as grayscale. Choose per image.
  const corner=maskContext.getImageData(3,3,1,1).data;
  const inside=maskContext.getImageData(Math.floor(atlas[0].center),350,1,1).data;
  const difference=Math.abs(Number(corner[3])-Number(inside[3]));
  const useLuma=difference<24;
  const luminance=p=>p[0]*.2126+p[1]*.7152+p[2]*.0722;
  const backgroundLevel=useLuma?luminance(corner):corner[3];
  const insideLevel=useLuma?luminance(inside):inside[3];
  const inverted=backgroundLevel>insideLevel;

  for(let index=0;index<atlas.length;index++){
    const kit=atlas[index];
    const left=Math.round(kit.center-kit.width/2);
    const top=96, imageWidth=kit.width, imageHeight=648;
    const pixels=sourceContext.getImageData(left,top,imageWidth,imageHeight);
    const clipping=maskContext.getImageData(left,top,imageWidth,imageHeight);
    for(let i=0;i<pixels.data.length;i+=4){
      const coverage=useLuma?luminance(clipping.data.subarray(i,i+3)):clipping.data[i+3];
      const alpha=inverted?255-coverage:coverage;
      pixels.data[i+3]=Math.round(pixels.data[i+3]*alpha/255);
    }
    const cropped=document.createElement('canvas');
    cropped.width=imageWidth; cropped.height=imageHeight;
    cropped.getContext('2d').putImageData(pixels,0,0);
    transparentKits.set(index,cropped.toDataURL('image/webp',.94));
  }
  for(const frame of document.querySelectorAll('.shop-kit-frame')){
    const kitNumber=Number(frame.dataset.shopKit);
    const old=frame.querySelector('img.shop-kit-sheet');
    if(!old)continue;
    const img=document.createElement('img');
    img.className='shop-kit-cutout';
    img.src=transparentKits.get(kitNumber);
    img.alt='';
    img.width=atlas[kitNumber].width;
    img.height=648;
    old.replaceWith(img);
    frame.dataset.cutout='ready';
  }
}

export function initShop(){
 const section=document.querySelector('#boutique'); if(!section)return;
 const grid=section.querySelector('#shop-products');
 const filters=[...section.querySelectorAll('.shop-filter')];
 const detail=document.querySelector('#shop-product-dialog');
 const cartDialog=document.querySelector('#shop-cart-dialog');
 const confirmation=document.querySelector('#shop-confirm-dialog');
 const cartContainer=cartDialog.querySelector('#shop-cart-lines');
 const cartCount=section.querySelector('#shop-cart-count');
 const openCart=section.querySelector('#shop-cart-open');
 const submit=cartDialog.querySelector('#shop-checkout-submit');
 const date=cartDialog.querySelector('#shop-delivery-date');
 const dateHint=cartDialog.querySelector('#shop-date-hint');
 let activeProduct=null, opener=null,cart=readCart();
 grid.innerHTML=merchandise.map(productCard).join('');
 prepareKitCutouts().catch(()=>{/* Existing CSS mask remains the visual fallback. */});
 const resize=()=>positionGarments(document);
 requestAnimationFrame(resize);
 const observer=new ResizeObserver(resize);
 const observe=root=>{for(const frame of root.querySelectorAll('.shop-kit-frame')){observer.observe(frame);frame.querySelector('img').addEventListener('load',resize)}};
 observe(grid);
 filters.forEach(button=>button.addEventListener('click',()=>{
  const filter=button.dataset.filter;
  for(const btn of filters){const active=btn===button;btn.setAttribute('aria-pressed',String(active));btn.classList.toggle('is-active',active)}
  let n=0;
  for(const card of grid.querySelectorAll('.shop-product')){const show=filter==='tous'||card.dataset.category===filter;card.hidden=!show;if(show)n++}
  section.querySelector('#shop-result-count').textContent=n+(n===1?' article':' articles');
  requestAnimationFrame(resize);
 }));

 function renderCart(){
  const total=sum(cart); cartCount.textContent=String(count(cart));
  cartDialog.querySelector('#shop-cart-heading-count').textContent='| '+count(cart)+(count(cart)===1?' article':' articles');
  cartDialog.querySelector('#shop-cart-total').textContent=money(total);
  cartDialog.querySelector('#shop-cart-subtotal').textContent=money(total);
  cartContainer.innerHTML=cart.length?cart.map(line=>{
   const item=itemById(line.id),key=cartKey(line.id,line.size);
   return '<li class="shop-cart-line" data-key="'+key+'">'+
     '<div class="shop-cart-line-main">'+merchandiseArt(item)+
       '<div class="shop-cart-line-info"><span class="shop-cart-line-category">VALORIA FC · 26/27</span><strong>'+item.name+'</strong><span class="shop-cart-size">'+(line.size==='Unique'?'Taille unique':'Taille : '+line.size)+'</span><span class="shop-cart-unit-price">'+money(item.price)+' / unité</span></div>'+
       '<strong class="shop-cart-line-total">'+money(item.price*line.qty)+'</strong></div>'+
     '<div class="shop-cart-line-actions"><div class="shop-qty-control"><button type="button" data-qty="-1" aria-label="Diminuer '+item.name+'">−</button><output aria-label="Quantité">'+line.qty+'</output><button type="button" data-qty="1" aria-label="Augmenter '+item.name+'">+</button></div>'+
       '<button type="button" class="shop-cart-remove" data-remove aria-label="Retirer '+item.name+'">Retirer '+uiIcon('trash-2')+'</button></div></li>';
   }).join(''):'<li class="shop-cart-empty">Votre panier est vide. Explorez les articles VALORIA pour commencer.</li>';
  cartDialog.querySelector('#shop-cart-summary').hidden=cart.length===0;
  submit.disabled=cart.length===0;
  if(cart.length)requestAnimationFrame(resize);
 }
 function persist(){try{sessionStorage.setItem(STORAGE_KEY,JSON.stringify(cart))}catch{} renderCart()}
 function addToCart(id,size,qty){
  const item=itemById(id);if(!item||!item.sizes.includes(size))return;
  const existing=cart.find(l=>l.id===id&&l.size===size);
  if(existing) existing.qty=cleanQuantity(existing.qty+qty);
  else cart.push({id,size,qty:cleanQuantity(qty)});
  persist();
 }

 grid.addEventListener('click',event=>{
  const button=event.target.closest('button[data-product]');if(!button)return;
  activeProduct=itemById(button.dataset.product);if(!activeProduct)return;
  opener=button;
  detail.querySelector('#shop-dialog-title').textContent=activeProduct.name;
  detail.querySelector('#shop-dialog-detail').textContent=activeProduct.detail;
  detail.querySelector('#shop-dialog-desc').textContent=activeProduct.note;
  detail.querySelector('#shop-dialog-price').textContent=money(activeProduct.price);
  detail.querySelector('#shop-dialog-size').innerHTML=activeProduct.sizes.map(s=>'<option value="'+s+'">'+s+'</option>').join('');
  detail.querySelector('#shop-dialog-quantity').value='1';
  detail.querySelector('#shop-dialog-visual').innerHTML=merchandiseArt(activeProduct);
  detail.querySelector('#shop-dialog-feedback').textContent='';
  detail.showModal();
  observe(detail.querySelector('#shop-dialog-visual'));
  requestAnimationFrame(resize);
 });
 detail.querySelector('#shop-detail-add').addEventListener('click',()=>{
  if(!activeProduct)return;
  addToCart(activeProduct.id,detail.querySelector('#shop-dialog-size').value,
    cleanQuantity(detail.querySelector('#shop-dialog-quantity').value));
  detail.querySelector('#shop-dialog-feedback').textContent='Ajouté au panier. Vous pouvez continuer vos achats.';
  detail.close();setDeliveryRange();renderCart();cartDialog.showModal();requestAnimationFrame(resize);
 });
 detail.addEventListener('close',()=>{opener?.focus({preventScroll:true});opener=null});

 function setDeliveryRange(){
  const delivery=addDays(new Date(),7);
  date.value=dateString(delivery);
  dateHint.textContent=formatDate(delivery)+' · Estimation à J+7, sans garantie de livraison.';
 }

 openCart.addEventListener('click',()=>{setDeliveryRange();renderCart();cartDialog.showModal()});
 cartDialog.querySelector('#shop-continue').addEventListener('click',()=>cartDialog.close());
 cartContainer.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  const li=button.closest('li[data-key]');if(!li)return;
  const line=cart.find(l=>cartKey(l.id,l.size)===li.dataset.key);if(!line)return;
  if(button.hasAttribute('data-remove'))cart=cart.filter(l=>l!==line);
  else if(button.hasAttribute('data-qty')){
   const diff=Number(button.dataset.qty);
   if(diff<0&&line.qty===1)cart=cart.filter(l=>l!==line);
   else line.qty=cleanQuantity(line.qty+diff);
  }
  persist();
 });
 cartDialog.querySelector('#shop-cart-form').addEventListener('submit',event=>{
  event.preventDefault();
  if(cart.length===0||!date.value)return;
  // Always derive the estimate from the visitor's current local calendar day.
  const selected=addDays(new Date(),7);
  date.value=dateString(selected);
  const lines=cart.map(l=>itemById(l.id).name+' ('+l.size+') × '+l.qty);
  confirmation.querySelector('#shop-confirm-detail').textContent=lines.join(' · ');
  confirmation.querySelector('#shop-confirm-total').textContent=money(sum(cart));
  confirmation.querySelector('#shop-confirm-date').textContent=formatDate(selected);
  cart=[];persist();
  cartDialog.close();confirmation.showModal();
 });
 confirmation.querySelector('#shop-confirm-ok').addEventListener('click',()=>confirmation.close());
 renderCart();
}
