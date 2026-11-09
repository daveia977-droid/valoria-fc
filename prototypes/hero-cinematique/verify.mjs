import{chromium}from'@playwright/test';
import assert from'node:assert/strict';
import{mkdirSync,writeFileSync}from'node:fs';
import{createRequire}from'node:module';
const require=createRequire(import.meta.url),dir='artifacts/art-direction-audit';mkdirSync(`${dir}/frames`,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
const result={viewports:[],pageErrors:[],badResponses:[],outsideRequests:[],a11y:[],source:'compiled standalone hero, original assets'};
try{
 for(const width of[320,390,768,1440]){
  const p=await browser.newPage({viewport:{width,height:width<761?844:1000},hasTouch:width<761});
  p.on('pageerror',e=>result.pageErrors.push(e.message));p.on('response',r=>{if(r.status()>=400)result.badResponses.push({url:r.url(),status:r.status()});});
  p.on('request',r=>{const u=new URL(r.url());if(['https:','http:'].includes(u.protocol)&&u.origin!=='http://127.0.0.1:4186')result.outsideRequests.push(u.href);});
  await p.goto('http://127.0.0.1:4186/');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1400);
  await p.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
  const auditState=async state=>{
   const violations=await p.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));});
   result.a11y.push({width,state,violations});assert.deepEqual(violations,[]);
  };
  if([390,1440].includes(width))await auditState('initial');
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if(width<761)assert.equal(await p.locator('.org-link').isVisible(),false);
  assert((await p.locator('.brand span').boundingBox()).height<22);
  assert.equal(await p.locator('h1').count(),1);
  const getPose=()=>p.locator('.emblem').evaluate(e=>getComputedStyle(e).transform);
  const original=await getPose();
  if([390,1440].includes(width))await p.screenshot({path:`${dir}/hero-prototype-${width}.jpg`,type:'jpeg',quality:94});
  await p.evaluate(()=>scrollTo(0,(document.querySelector('.story').offsetHeight-innerHeight)*.94));
  await p.waitForFunction(()=>Number(document.querySelector('.scene').dataset.progress)>.9);
  assert.notEqual(await getPose(),original);
  assert.equal(await p.locator('.identity').getAttribute('aria-hidden'),'false');
  if([390,1440].includes(width))await auditState('identite');
  if([390,1440].includes(width))await p.screenshot({path:`${dir}/hero-transition-${width}.jpg`,type:'jpeg',quality:92});
  await p.evaluate(()=>scrollTo(0,0));await p.waitForFunction(()=>Number(document.querySelector('.scene').dataset.progress)<.01);
  assert.equal(await getPose(),original,'Scroll must reverse to the same pose');
  await p.getByRole('navigation').getByRole('link',{name:'Le club',exact:true}).click();
  await p.waitForFunction(()=>Number(document.querySelector('.scene').dataset.progress)>.8);
  await p.locator('.identity .line-link').focus();assert(await p.locator('.identity .line-link').evaluate(e=>document.activeElement===e));
  await p.getByRole('button',{name:'Mettre en pause les animations'}).click();assert.equal(await p.locator('#pause').getAttribute('aria-pressed'),'true');
  assert.equal(await p.locator('.identity').getAttribute('aria-hidden'),'true');
  await p.getByRole('button',{name:'Reprendre les animations'}).click();
  await p.evaluate(()=>scrollTo(0,0));
  await p.emulateMedia({reducedMotion:'reduce'});
  await p.waitForFunction(()=>document.querySelector('#pause').disabled);
  assert(await p.locator('#pause').isDisabled());
  assert.equal(await p.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0);
  assert(await p.locator('h1').isVisible());
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await p.locator('.navigation a[href="#collection"]').click();
  assert.equal(new URL(p.url()).hash,'#collection');
  assert((await p.locator('#collection-title').innerText()).includes('Quatre expressions'));
  const violations=await p.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));});
  result.a11y.push({width,violations});assert.deepEqual(violations,[]);
  result.viewports.push({width,overflow:false,reversibleScroll:true,reducedMotion:true,pause:true,keyboard:true});await p.close();
 }
 // Film the real scroll-driven prototype in an emulated mobile viewport.
 const p=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});await p.goto('http://127.0.0.1:4186/');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1500);
 let index=0;
 const capture=()=>p.screenshot({path:`${dir}/frames/f${String(index++).padStart(3,'0')}.jpg`,type:'jpeg',quality:88});
 for(let i=0;i<8;i++)await capture();
 for(let i=0;i<=42;i++){
  await p.evaluate(t=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,(document.querySelector('.story').offsetHeight-innerHeight)*t);},i/42*.96);
  await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await capture();
 }
 for(let i=0;i<8;i++)await capture();
 for(let i=28;i>=0;i--){await p.evaluate(t=>scrollTo(0,(document.querySelector('.story').offsetHeight-innerHeight)*t),i/28*.96);await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await capture();}
 result.frames=index;await p.close();
 assert.deepEqual(result.pageErrors,[]);assert.deepEqual(result.badResponses,[]);assert.deepEqual(result.outsideRequests,[]);
 result.status='passed';writeFileSync(`${dir}/prototype-verification.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{await browser.close();}
