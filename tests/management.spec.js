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
