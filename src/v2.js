// VALORIA FC V2 — fictional European fixtures and simulated ticket flow.
// No user data is collected, stored, transmitted or charged.
const fixtures = [
  { id:'bayern', date:'2026-10-21T21:00:00+02:00', home:'VALORIA FC', away:'Bayern Munich', score:[2,0], played:true, mark:'FCB' },
  { id:'juventus', date:'2026-11-04T21:00:00+01:00', home:'VALORIA FC', away:'Juventus', score:[1,2], played:true, mark:'JUV' },
  { id:'chelsea', date:'2026-11-10T21:00:00+01:00', home:'Chelsea', away:'VALORIA FC', score:[2,2], played:true, mark:'CFC' },
  { id:'barcelona', date:'2026-12-02T21:00:00+01:00', home:'VALORIA FC', away:'FC Barcelone', played:false, mark:'FCB' },
  { id:'liverpool', date:'2026-12-15T21:00:00+01:00', home:'Liverpool', away:'VALORIA FC', played:false, mark:'LFC' },
  { id:'real', date:'2027-01-20T21:00:00+01:00', home:'VALORIA FC', away:'Real Madrid', played:false, mark:'RMA' },
  { id:'inter', date:'2027-02-17T21:00:00+01:00', home:'VALORIA FC', away:'Inter Milan', played:false, mark:'INT' },
  { id:'dortmund', date:'2027-03-10T21:00:00+01:00', home:'Borussia Dortmund', away:'VALORIA FC', played:false, mark:'BVB' }
];
const samplePrices = { A:100, B:70, C:40 };
const longDate = new Intl.DateTimeFormat('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric', timeZone:'Europe/Paris' });
const shortDate = new Intl.DateTimeFormat('fr-FR', { day:'2-digit', month:'short', timeZone:'Europe/Paris' });
const timeFmt = new Intl.DateTimeFormat('fr-FR', { hour:'2-digit', minute:'2-digit', timeZone:'Europe/Paris' });
const eur = new Intl.NumberFormat('fr-FR', { style:'currency', currency:'EUR', maximumFractionDigits:0 });
const niceDate = match => longDate.format(new Date(match.date));
const niceTime = match => timeFmt.format(new Date(match.date));
const crest = (name,mark) => name === 'VALORIA FC'
  ? '<img class="v2-team-crest" src="/assets/crest.webp" alt="" width="64" height="78">'
  : '<span class="v2-team-monogram" aria-hidden="true">' + mark + '</span>';
function markFor(name,match) { return name === 'VALORIA FC' ? 'VAL' : match.mark; }
function team(name,match) {
  return '<div class="v2-team">' + crest(name,markFor(name,match)) + '<strong>' + name + '</strong></div>';
}
function matchCard(match) {
  return '<li><button class="v2-match-card' + (match.played ? ' is-played':'') + '" type="button" data-match-id="' + match.id + '" aria-label="Voir la fiche du match fictif ' + match.home + ' contre ' + match.away + '">'
    + '<span class="v2-card-top"><span class="v2-card-tag">UCL · FICTION</span><span>' + (match.played?'TERMINÉ':'À VENIR') + '</span></span>'
    + '<span class="v2-card-date">' + shortDate.format(new Date(match.date)) + ' · ' + niceTime(match) + '</span>'
    + '<span class="v2-card-team">' + crest(match.home,markFor(match.home,match)) + '<span>' + match.home + '</span><b>' + (match.played?match.score[0]:'—') + '</b></span>'
    + '<span class="v2-card-team">' + crest(match.away,markFor(match.away,match)) + '<span>' + match.away + '</span><b>' + (match.played?match.score[1]:'—') + '</b></span>'
    + '<span class="v2-card-action">' + (match.played?'Résultat et fiche':'Voir le match et les billets') + ' <span aria-hidden="true">↗</span></span>'
    + '</button></li>';
}
const nextFixture = () => fixtures.find(f=>new Date(f.date).getTime() > Date.now() && !f.played) || fixtures[fixtures.length-1];
function featuredMarkup(match) {
  return '<div class="v2-featured-head"><span>PROCHAINE AFFICHE</span><span>UEFA CHAMPIONS LEAGUE · SCÉNARIO FICTIF</span></div>'
  + '<div class="v2-featured-body"><div class="v2-featured-team">' + team(match.home,match) + '</div>'
  + '<div class="v2-featured-center"><span>PHASE EUROPÉENNE IMAGINAIRE</span><strong>' + niceTime(match) + '</strong><time datetime="' + match.date + '">' + niceDate(match) + '</time></div>'
  + '<div class="v2-featured-team">' + team(match.away,match) + '</div></div>'
  + '<div class="v2-featured-bottom"><div><span>COUP D’ENVOI DANS</span><strong id="v2-countdown">—</strong></div><button type="button" data-match-id="' + match.id + '">Découvrir ce match <span aria-hidden="true">↗</span></button></div>';
}
function initDecor() {
  const atmosphere = document.querySelector('.story .atmosphere');
  if (!atmosphere) return;
  const decor = document.createElement('div');
  decor.className='v2-hero-decor';
  decor.setAttribute('aria-hidden','true');
  decor.innerHTML='<i class="v2-halo v2-halo-a"></i><i class="v2-halo v2-halo-b"></i><i class="v2-football v2-football-one"></i><i class="v2-football v2-football-two"></i>'
    +'<div class="v2-crowd"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>'
    +'<span class="v2-particle p1"></span><span class="v2-particle p2"></span><span class="v2-particle p3"></span>';
  atmosphere.append(decor);
}
function buildFixtureSection() {
  const story = document.querySelector('.story');
  if (!story) return;
  const section = document.createElement('section');
  section.id = 'matchs';
  section.className = 'v2-matches';
  section.setAttribute('aria-labelledby','v2-matches-title');
  section.innerHTML='<div class="v2-shell">'
    +'<div class="v2-section-head"><div><p class="v2-overline">02 / L’EUROPE EN FICTION</p><h2 id="v2-matches-title">Les grands <em>rendez-vous.</em></h2></div>'
    +'<p>Une saison imaginaire de VALORIA FC en UEFA Champions League. Affiches, scores et horaires sont inventés : aucune rencontre officielle n’est annoncée.</p></div>'
    +'<div id="v2-featured" class="v2-featured" aria-label="Prochain match fictif">' + featuredMarkup(nextFixture()) + '</div>'
    +'<div class="v2-calendar-heading"><div><h3>Calendrier & résultats</h3><p>Glissez horizontalement pour explorer les rencontres.</p></div><div class="v2-arrows"><button type="button" id="v2-prev" aria-label="Matchs précédents">←</button><button type="button" id="v2-next" aria-label="Matchs suivants">→</button></div></div>'
    +'<ul class="v2-match-track" id="v2-match-track" aria-label="Matchs de démonstration">' + fixtures.map(matchCard).join('') + '</ul>'
    +'<p class="v2-fineprint">Démonstration indépendante. VALORIA FC est fictif, ne participe pas réellement aux compétitions de l’UEFA et n’est affilié ni à l’UEFA ni aux clubs cités. Emblèmes des adversaires représentés par des monogrammes non officiels.</p>'
    +'</div>';
  story.after(section);
  const track=section.querySelector('#v2-match-track');
  section.querySelector('#v2-prev').addEventListener('click',()=>track.scrollBy({left:-330,behavior:'smooth'}));
  section.querySelector('#v2-next').addEventListener('click',()=>track.scrollBy({left:330,behavior:'smooth'}));
  const comingIndex = fixtures.findIndex(f=>!f.played);
  if (comingIndex > 0) requestAnimationFrame(()=>{track.scrollLeft= Math.max(0,comingIndex*284-24);});
  const countdown = section.querySelector('#v2-countdown');
  const refresh=()=>{
    const diff=new Date(nextFixture().date).getTime()-Date.now();
    if (diff<=0) {countdown.textContent='Match fictif commencé';return;}
    const days=Math.floor(diff/86400000),hours=Math.floor(diff%86400000/3600000),minutes=Math.floor(diff%3600000/60000),seconds=Math.floor(diff%60000/1000);
    countdown.textContent=[days,hours,minutes,seconds].map(v=>String(v).padStart(2,'0')).join(' : ');
  };
  refresh();
  const timer=window.setInterval(()=>{if(!document.hidden)refresh();},1000);
  window.addEventListener('pagehide',()=>clearInterval(timer),{once:true});
}
function buildSupporters() {
  const before=document.querySelector('.contact-strip');
  if(!before)return;
  const section=document.createElement('section');
  section.id='supporters';
  section.className='v2-supporters';
  section.setAttribute('aria-labelledby','v2-supporters-title');
  section.innerHTML='<div class="v2-shell v2-supporters-layout"><div><p class="v2-overline">05 / LA COMMUNAUTÉ</p><h2 id="v2-supporters-title">Ensemble, <em>plus forts.</em></h2><p>Une même passion, des tribunes imaginaires, une identité à partager. Bienvenue dans l’univers des supporters de VALORIA FC.</p><span class="v2-supporter-pill">COMMUNAUTÉ DE DÉMONSTRATION</span></div><div class="v2-supporter-number"><span>SUPPORTERS FICTIFS</span><strong>10 200</strong><p>Chiffre illustratif, pas une communauté réelle ni un nombre d’inscrits.</p><div class="v2-stands" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div></div>';
  before.before(section);
}
function makeTicketDialog() {
  const dialog=document.createElement('dialog');
  dialog.id='v2-ticket-dialog';
  dialog.className='v2-ticket-dialog';
  dialog.setAttribute('aria-labelledby','v2-dialog-title');
  dialog.innerHTML='<div class="v2-dialog-top"><span>VALORIA FC · MATCH FICTIF</span><button class="v2-close" type="button" id="v2-close">Fermer ×</button></div>'
    +'<div id="v2-ticket-content"></div>';
  document.body.append(dialog);
  dialog.querySelector('#v2-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog)return;
    const r=dialog.getBoundingClientRect();
    if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();
  });
  return dialog;
}
function modalMarkup(match){
  const scoreboard=match.played?'<div class="v2-modal-result">' + match.score[0] + ' – ' + match.score[1] + '</div>':'<div class="v2-modal-result">VS</div>';
  return '<p class="v2-overline">UEFA CHAMPIONS LEAGUE · SCÉNARIO IMAGINAIRE</p><h2 id="v2-dialog-title">La fiche du match.</h2>'
    +'<div class="v2-dialog-fixture"><div>' + team(match.home,match) + '</div>' + scoreboard + '<div>' + team(match.away,match) + '</div></div>'
    +'<p class="v2-fixture-date"><time datetime="' + match.date + '">' + niceDate(match) + ' · ' + niceTime(match) + ' (Paris)</time></p>'
    +(match.played ? '<p class="v2-ended">Match terminé — score entièrement fictif. Aucune billetterie disponible pour cette rencontre.</p>' : ticketMarkup())
    +'<p class="v2-modal-notice">Démonstration non officielle : ni billet valide, ni paiement, ni réservation, ni accès au stade.</p>';
}
function ticketMarkup(){
  return '<form id="v2-ticket-form"><h3>Billetterie de démonstration</h3><p class="v2-form-sub">Choisissez une catégorie et une quantité. Tarifs purement indicatifs.</p>'
    +'<fieldset><legend>Choisir une tribune</legend><div class="v2-ticket-types">'
    +Object.keys(samplePrices).map((type,i)=>'<label><input type="radio" name="tribune" value="' + type + '"' + (i===1?' checked':'') + '><span>Tribune ' + type + '</span><strong>' + eur.format(samplePrices[type]) + '</strong></label>').join('')
    +'</div></fieldset><label class="v2-quantity" for="v2-quantity">Nombre de billets <select id="v2-quantity" name="quantity"><option value="1">1 billet</option><option value="2">2 billets</option><option value="3">3 billets</option><option value="4">4 billets</option></select></label>'
    +'<div class="v2-specimen"><div><span>VALORIA FC</span><span>UEFA CHAMPIONS LEAGUE · FICTION</span></div><strong>SPÉCIMEN</strong><p>NON VALABLE POUR L’ACCÈS</p><div class="v2-specimen-details"><span id="v2-ticket-summary">Tribune B · 1 billet</span><b id="v2-ticket-total">70 €</b></div></div>'
    +'<button class="v2-submit" type="submit">Enregistrer le billet de démonstration</button></form>';
}
function openFixture(dialog,id){
  const match=fixtures.find(f=>f.id===id);
  if(!match)return;
  dialog.querySelector('#v2-ticket-content').innerHTML=modalMarkup(match);
  if(!dialog.open)dialog.showModal();
  const form=dialog.querySelector('#v2-ticket-form');
  if(!form)return;
  const update=()=>{
    const type=form.elements.tribune.value;
    const qty=Math.max(1,Math.min(4,Number(form.elements.quantity.value)||1));
    form.querySelector('#v2-ticket-summary').textContent='Tribune ' + type + ' · ' + qty + ' billet' + (qty>1?'s':'');
    form.querySelector('#v2-ticket-total').textContent=eur.format(samplePrices[type]*qty);
  };
  form.addEventListener('change',update);
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const area=form.elements.tribune.value;
    const qty=Number(form.elements.quantity.value)||1;
    dialog.querySelector('#v2-ticket-content').innerHTML='<div class="v2-confirmation" role="status"><span aria-hidden="true">✓</span><h2 id="v2-dialog-title">Votre billet est enregistré.</h2><p>' + qty + ' billet' + (qty>1?'s':'') + ' · Tribune ' + area + '</p><strong>SPÉCIMEN — non valable pour l’accès</strong><p>Confirmation de démonstration uniquement. Aucune réservation réelle, aucune donnée conservée.</p><button class="v2-submit" id="v2-ok" type="button">OK</button></div>';
    const ok=dialog.querySelector('#v2-ok');
    ok.addEventListener('click',()=>dialog.close());
    ok.focus();
  });
  update();
}
function initNavigation(){
  document.querySelectorAll('.desktop-nav,.menu-dialog nav').forEach(nav=>{
    const collection=nav.querySelector('a[href="#collection"]');
    if(collection)collection.insertAdjacentHTML('beforebegin','<a href="#matchs">Matchs</a>');
    const last=nav.querySelector('a[href="#organisation"]');
    if(last)last.insertAdjacentHTML('afterend','<a href="#supporters">Supporters</a>');
  });
}
export function initV2(){
  initDecor();
  buildFixtureSection();
  buildSupporters();
  initNavigation();
  const dialog=makeTicketDialog();
  document.querySelector('#matchs')?.addEventListener('click',event=>{
    const matchButton=event.target.closest('[data-match-id]');
    if(matchButton)openFixture(dialog,matchButton.dataset.matchId);
  });
}
