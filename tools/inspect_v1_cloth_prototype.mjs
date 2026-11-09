import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const dir=process.env.VFC_STUDY_OUTPUT || 'artifacts/prototype-v1-assoupli';
const oldPath='public/models/domicile-v1.glb';
const newPath=`${dir}/domicile-v1-volume-et-plis.glb`;
const url=process.env.COLLECTION_PREVIEW_URL || 'http://127.0.0.1:4173/';
function readGlb(path) {
 const b=readFileSync(path);assert.equal(b.toString('ascii',0,4),'glTF');assert.equal(b.readUInt32LE(8),b.length);
 const length=b.readUInt32LE(12);
 return {json:JSON.parse(b.toString('utf8',20,20+length)),bin:b.subarray(28+length),bytes:b.length};
}
function imageBytes(model) {
 const j=model.json;
 const m=j.materials.find(m=>m.name.startsWith('Face'));
 const texture=j.textures[m.pbrMetallicRoughness.baseColorTexture.index];
 const image=j.images[texture.source];const v=j.bufferViews[image.bufferView];
 return model.bin.subarray(v.byteOffset || 0,(v.byteOffset || 0)+v.byteLength);
}
function metrics(model) {
 const j=model.json;const primitives=j.meshes.flatMap(m=>m.primitives);
 const p=primitives.map(p=>j.accessors[p.attributes.POSITION]);
 const size=[0,1,2].map(i=>Math.max(...p.map(a=>a.max[i]))-Math.min(...p.map(a=>a.min[i])));
 for(const primitive of primitives) {
  const a=j.accessors[primitive.attributes.POSITION];const v=j.bufferViews[a.bufferView];
  const data=new DataView(model.bin.buffer,model.bin.byteOffset,model.bin.byteLength);
  for(let i=0;i<a.count;i++)for(let c=0;c<3;c++)assert(Number.isFinite(data.getFloat32((v.byteOffset||0)+(a.byteOffset||0)+i*(v.byteStride||12)+c*4,true)));
 }
 return {bytes:model.bytes,meshes:j.meshes.length,triangles:primitives.reduce((sum,p)=>sum+j.accessors[p.indices].count/3,0),size_xyz:size,embedded_images:j.images.length};
}
function clay(model,path) {
 const j=structuredClone(model.json);
 for(const m of j.materials){
  delete m.pbrMetallicRoughness.baseColorTexture;
  m.pbrMetallicRoughness.baseColorFactor=[.18,.18,.18,1];
  m.pbrMetallicRoughness.metallicFactor=0;m.pbrMetallicRoughness.roughnessFactor=.85;
 }
 let json=Buffer.from(JSON.stringify(j));json=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]);
 const head=Buffer.alloc(20);head.write('glTF');head.writeUInt32LE(2,4);head.writeUInt32LE(28+json.length+model.bin.length,8);head.writeUInt32LE(json.length,12);head.write('JSON',16);
 const binHead=Buffer.alloc(8);binHead.writeUInt32LE(model.bin.length);binHead.write('BIN\0',4);
 writeFileSync(path,Buffer.concat([head,json,binHead,model.bin]));
}
const old=readGlb(oldPath),study=readGlb(newPath);
assert(imageBytes(old).equals(imageBytes(study)),'The approved front JPEG must remain byte-identical');
const before=metrics(old),after=metrics(study);
assert.equal(after.triangles,before.triangles);
assert(after.size_xyz[2]>before.size_xyz[2]*1.2);
assert(after.bytes<1_500_000);
assert(study.json.materials.every(m=>m.normalTexture?.texCoord===1));
clay(old,`${dir}/geometrie-originale-neutre.glb`);
clay(study,`${dir}/geometrie-etude-neutre.glb`);
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
const errors=[];
async function open(path,width=1100,height=850,clayView=false) {
 const page=await browser.newPage({viewport:{width,height},hasTouch:width<761,reducedMotion:'reduce'});
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/models/domicile-v1.glb',r=>r.fulfill({path,contentType:'model/gltf-binary'}));
 await page.goto(url);await page.locator('#kit-panel').scrollIntoViewIfNeeded();
 await page.locator('#kit-panel[data-presentation="3d"]').waitFor({timeout:25000});
 await page.locator('#kit-motion-note').evaluate((el,isClay)=>el.textContent=isClay?'ÉTUDE GÉOMÉTRIQUE SANS HABILLAGE · DOS EN ATTENTE DU PNG':'ÉTUDE DU VOLUME ET DES PLIS · NOUVEAU DOS EN ATTENTE DU PNG',clayView);
 return page;
}
async function angle(page,steps) {
 await page.locator('#kit-panel').focus();await page.keyboard.press('Home');
 for(let i=0;i<steps;i++)await page.keyboard.press('ArrowRight');
}
for(const [label,path,isClay] of [['etude',newPath,false],['geometrie',`${dir}/geometrie-etude-neutre.glb`,true],['original',`${dir}/geometrie-originale-neutre.glb`,true]]) {
 const p=await open(path,1100,850,isClay);
 for(const [view,steps] of [['face',0],['profil',6],['dos',12],['trois-quarts',3]]){
  if(!isClay && ['dos','profil'].includes(view))continue; // Do not offer an invented new rear or side design.
  await angle(p,steps);await p.locator('#kit-panel').blur();
  await p.locator('#kit-panel').screenshot({path:`${dir}/${view}-${label}.jpg`,type:'jpeg',quality:94});
 }
 await p.close();
}
const mobileChecks=[];
for(const width of [320,390,768,1440]) {
 const p=await open(newPath,width,900);
 const stage=p.locator('#kit-panel'),canvas=p.locator('.jersey-canvas canvas');
 assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 const box=await canvas.boundingBox();assert(box.x>=0&&box.x+box.width<=width&&box.height>350);
 const start={x:box.x+box.width/2,y:box.y+box.height/2};
 if(width<761){
  const cdp=await p.context().newCDPSession(p);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[start]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start.x+70,y:start.y}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert.equal(await stage.getAttribute('data-angle'),'46');
  const y=await p.evaluate(()=>scrollY);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[start]});
  for(let i=1;i<=5;i++){
   await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start.x,y:start.y-i*20}]});await p.waitForTimeout(35);
  }
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(100);
  assert(await p.evaluate(()=>scrollY)>y+30);
  await cdp.detach();
 }else{
  await stage.focus();await p.keyboard.press('ArrowRight');assert.equal(await stage.getAttribute('data-angle'),'15');
 }
 if(width===390){await stage.scrollIntoViewIfNeeded();await angle(p,0);await stage.blur();await stage.screenshot({path:`${dir}/mobile-etude.jpg`,type:'jpeg',quality:92});}
 mobileChecks.push({width,rendered:true,noOverflow:true,manualRotation:true,nativeTouchScroll:width<761?true:'not a touch viewport'});
 await p.close();
}
// Record a full turn in neutral clay to show actual folds without asserting a rear design.
mkdirSync(`${dir}/frames`,{recursive:true});
const demoMobile=process.env.VFC_DEMO_MOBILE==='1';
const p=await open(`${dir}/geometrie-etude-neutre.glb`,demoMobile?390:1280,demoMobile?844:900,true);
const b=await p.locator('.jersey-canvas').boundingBox();let frame=0;
const touch=demoMobile?await p.context().newCDPSession(p):undefined;
const demoAngles=[];
for(let pass=0;pass<2;pass++){
 const d=180/.65,x=b.x+(b.width-d)/2,y=b.y+b.height*.5;
 if(touch)await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
 else{await p.mouse.move(x,y);await p.mouse.down();}
 for(let i=1;i<=30;i++){
  if(touch)await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+d*i/30,y}]});
  else await p.mouse.move(x+d*i/30,y);
  if(i===15){
   await p.waitForFunction(expected=>Math.abs(Number(document.querySelector('#kit-panel').dataset.angle)-expected)<2,90+180*pass,{timeout:2000});
   const observed=Number(await p.locator('#kit-panel').getAttribute('data-angle'));
   assert(Math.abs(observed-(90+180*pass))<2);
   demoAngles.push(observed);
  }
  await (demoMobile?p:p.locator('#kit-panel')).screenshot({path:`${dir}/frames/f${String(frame++).padStart(3,'0')}.jpg`,type:'jpeg',quality:88});
 }
 if(touch)await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 else await p.mouse.up();
}
if(touch)await touch.detach();
await browser.close();assert.deepEqual(errors,[]);
const report={status:'Geometry study verified. Rear design blocked pending the original PNG. No official rear/side appearance inferred.',before,after,front_texture_sha256:createHash('sha256').update(imageBytes(study)).digest('hex'),front_texture_byte_identical:true,cloth_simulation:false,folds:'Actual displaced vertices; knit detail uses a separate procedural normal map.',viewport_checks:mobileChecks,page_errors:errors,phone_hardware_tested:false,demo_input:demoMobile?'emulated mobile touch':'mouse',demo_angles_observed:demoAngles,frame_count:frame,website_modified:false};
writeFileSync(`${dir}/verification-etude.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
