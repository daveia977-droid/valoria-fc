import { test, expect } from '@playwright/test';
test('diagnostic accessible, cinq axes et recommandations',async({page})=>{
await page.goto('/');await page.locator('a[href="./management.html"]').click();
await expect(page).toHaveURL(/management\.html$/);
for(const id of ['structure','direction','pouvoir','culture','environnement','actions','sources'])await expect(page.locator('#'+id)).toBeVisible();
await expect(page.locator('#structure')).toContainText('Messie');
await expect(page.locator('#contenu')).toContainText('Étude de cas fictive');
});
for(const width of [320,390,768,1440])test('diagnostic sans débordement '+width,async({page})=>{await page.setViewportSize({width,height:844});await page.goto('/management.html');await page.evaluate(()=>document.fonts.ready);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);});
