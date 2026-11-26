import { test, expect } from '@playwright/test';
test('diagnostic accessible, cinq axes et recommandations',async({page})=>{
await page.goto('/');
const link=page.locator('.organisation-dossier');
await expect(link).toContainText('Dossier académique · Partie 01');
await expect(link).toContainText('Consulter le diagnostic de management');
await expect(link).toBeVisible();
await link.click();
await expect(page).toHaveURL(/management\.html$/);
for(const id of ['structure','direction','pouvoir','culture','environnement','actions','sources'])await expect(page.locator('#'+id)).toBeVisible();
await expect(page.locator('#structure')).toContainText('Messie');
await expect(page.locator('#contenu')).toContainText('Étude de cas fictive');
});
for(const width of [320,390,768,1440])test('diagnostic sans débordement '+width,async({page})=>{await page.setViewportSize({width,height:844});await page.goto('/management.html');await page.evaluate(()=>document.fonts.ready);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);});

for(const width of [320,390,768,1440])test('lien du dossier accessible '+width,async({page})=>{await page.setViewportSize({width,height:844});await page.goto('/');const link=page.locator('.organisation-dossier');await link.scrollIntoViewIfNeeded();await expect(link).toBeVisible();expect(await link.evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.height>=44;})).toBe(true);await link.focus();await page.keyboard.press('Enter');await expect(page).toHaveURL(/management\.html$/);});

test('les auteurs sont cités sans année dans le diagnostic web', async ({page}) => {
  await page.goto('/management.html');
  const body = await page.locator('#contenu').innerText();
  expect(body).not.toMatch(/(?:Mintzberg|Fayol|Stalker|Lewin|McGregor|Herzberg|Maslow|Raven|Friedberg|Kilmann|Hofstede)\s*(?:,\s*|\(\s*)\d{4}/i);
  for (const name of ['Mintzberg','Fayol','Burns et Stalker','Lewin','McGregor','Herzberg','Maslow','French et Raven','Crozier et Friedberg','Thomas et Kilmann','Hofstede']) expect(body).toContain(name);
  expect(body).toContain('6 juin 2026');
});
for (const path of ['/', '/management.html', '/mentions-legales.html', '/confidentialite.html', '/cgu.html']) {
  test('adresse sans attribution superflue : '+path, async ({page}) => {
    await page.goto(path+'?utm_source=chatgpt.com&source=chatgpt.com&lang=fr#contenu');
    await expect.poll(()=>new URL(page.url()).search).toBe('?lang=fr');
    expect(new URL(page.url()).hash).toBe('#contenu');
    await page.goto(path+'?source=direct&lang=fr');
    await expect.poll(()=>new URL(page.url()).search).toBe('?source=direct&lang=fr');
  });
}
