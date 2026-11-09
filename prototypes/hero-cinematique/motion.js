const root=document.documentElement;
const story=document.querySelector('.story');
const scene=document.querySelector('.scene');
const opening=document.querySelector('.opening');
const identity=document.querySelector('.identity');
const emblem=document.querySelector('.emblem');
const toggle=document.querySelector('#pause');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const mobile=matchMedia('(max-width:760px)');
let manual=false,frame=0;
const entrances=[];
const clamp=x=>Math.min(1,Math.max(0,x));
const ease=x=>x*x*(3-2*x);
const stop=()=>manual||reduced.matches;
function render(){
 frame=0;
 if(stop()||document.hidden)return;
 const rect=story.getBoundingClientRect();
 const p=clamp(-rect.top/Math.max(1,story.offsetHeight-innerHeight));
 const t=ease(clamp((p-.12)/.76));
 root.style.setProperty('--p',p.toFixed(4));
 root.style.setProperty('--opening',String(1-ease(clamp(p/.48))));
 root.style.setProperty('--identity',String(ease(clamp((p-.38)/.38))));
 root.style.setProperty('--identity-y',`${(1-t)*30}px`);
 root.style.setProperty('--identity-events',p>=.65?'auto':'none');
 root.style.setProperty('--travel-x',`${t*(mobile.matches?innerWidth*.23:innerWidth*.22)}px`);
 root.style.setProperty('--travel-y',`${t*(mobile.matches?innerHeight*.21:innerHeight*.025)}px`);
 root.style.setProperty('--scale',String(1-t*(mobile.matches ? 0.49 : 0.11)));
 root.style.setProperty('--tilt',`${t*-9}deg`);
 root.style.setProperty('--roll',`${t*3}deg`);
 identity.setAttribute('aria-hidden',String(p<.65));
 identity.inert=p<.65;
 scene.dataset.progress=p.toFixed(4);
}
function schedule(){if(!frame)frame=requestAnimationFrame(render);}
function sync(){
 if(frame){cancelAnimationFrame(frame);frame=0;}
 root.classList.toggle('motion-paused',manual);
 toggle.disabled=reduced.matches;
 toggle.setAttribute('aria-pressed',String(stop()));
 toggle.setAttribute('aria-label',reduced.matches?'Animations réduites selon vos préférences':stop()?'Reprendre les animations':'Mettre en pause les animations');
 toggle.querySelector('.pause-word').textContent=stop()?'En pause':'Pause';
 if(stop()){
  entrances.forEach(a=>{if(a.playState==='running')a.finish();});
  opening.removeAttribute('aria-hidden');identity.setAttribute('aria-hidden','true');identity.inert=true;
  root.style.setProperty('--opening','1');
 }else schedule();
}
toggle.addEventListener('click',()=>{manual=!manual;sync();});
reduced.addEventListener('change',sync);
mobile.addEventListener('change',schedule);
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule();});
for(const a of document.querySelectorAll('a[href="#identite"]'))a.addEventListener('click',event=>{
 event.preventDefault();
 if(stop()){document.querySelector('#collection').scrollIntoView({behavior:'auto'});return;}
 scrollTo({top:story.offsetTop+(story.offsetHeight-innerHeight)*.88,behavior:'smooth'});
});
if(!stop()){
 for(const [selector,delay]of[['.opening',80],['.emblem',200],['.scene-footer',350]])entrances.push(document.querySelector(selector).animate([{opacity:0},{opacity:1}],{duration:900,delay,easing:'cubic-bezier(.16,1,.3,1)'}));
}
sync();
