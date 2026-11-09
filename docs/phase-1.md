# Première phase de refonte — VALORIA FC

## Livré

- Palette noir profond `#100c0c`, bordeaux `#601e2b`, or `#e6bc78` et crème `#f6f0e5`, y compris navigation, focus, formulaire, boutons et sections secondaires. Le seul violet d’interface restant désigne le troisième maillot.
- Hero en pleine hauteur sur les vues de référence, avec « VALORIA FC » comme unique titre H1 et le blason centré. « La force du collectif » reste visible comme signature.
- Fond bordeaux/or adapté en image WebP. L’image de l’écusson est conservée sans modification.
- Entrée 2D progressive : titre, blason, navigation, signature et bouton. Pas de perspective, `rotateY`, WebGL ou modèle 3D. Mouvement d’ambiance discret et déplacement au scroll plafonné à 8 px.
- Pause et préférence de réduction des animations conservées. Le contenu reste visible lorsque JavaScript ne déclenche pas les animations.
- Vite, HTML, CSS et JavaScript conservés ; aucun ajout de dépendance. Configuration Vercel inchangée ; aucun déploiement.

## Préservation vérifiée

Comparaison avec la sauvegarde de début de phase : contenu HTML situé après le hero identique, à l’exception du renommage de la classe du bouton violet en bouton bordeaux. Les rôles, textes officiels, navigation, formulaires et fonctions de galerie sont conservés.

Les empreintes SHA-256 de l’écusson, de l’atlas des maillots, de `package.json`, de `package-lock.json` et de `vercel.json` sont identiques à celles du début de phase. Aucune nouvelle donnée sportive, commerciale ou de sponsoring n’a été ajoutée.

## Fichiers de code

- `index.html` : couleur du navigateur, fond du hero, titre, composition centrale et classe du bouton de contact.
- `src/style.css` : palette, mise en page du hero et responsive.
- `src/main.js` : séquence d’entrée, mouvements 2D et limitation du déplacement au scroll.
- `public/assets/hero-burgundy.webp` : seul nouveau visuel utilisé.
- `tests/site.spec.js` : une seule assertion actualisée, `COLLECTIF` devient `VALORIA FC` pour vérifier le nouveau titre demandé. Les sept tests et leurs autres assertions sont conservés.

## Validation exécutée

- `npm run build` : réussite.
- `npm test` : **7 tests exécutés, 7 réussis, aucun désactivé** (6,4 secondes pour la dernière exécution).
- Contrôles Playwright supplémentaires : 320 × 568, 390 × 844, 768 × 1024, 1440 × 1000 et paysage 844 × 390. Pas de débordement horizontal, titre entièrement visible, centrage du blason et absence de commandes coupées par le hero.
- Basculement de la préférence système après chargement et pause manuelle : vérifiés. Aucune exception JavaScript ni réponse HTTP en erreur lors des contrôles supplémentaires.
- État détaillé : `artifacts/phase-1/browser-validation.json`. Diff de cette phase : `artifacts/phase-1/code.diff`.
- `git diff --check` : réussite.

## Captures et vidéo

Dans `artifacts/phase-1/` :

- `before-desktop.png` et `after-desktop.png` : 1440 × 1000.
- `before-mobile.png` et `after-mobile.png` : 390 × 844.
- `comparison-desktop.png` et `comparison-mobile.png` : comparaisons assemblées avant/après.
- Variantes `*-full.png` : pages complètes.
- `entrance.mp4` : capture de l’entrée réelle dans Chromium.

Captures à densité 1 et avec mouvement réduit pour rendre les comparaisons reproductibles ; la vidéo montre le mouvement activé. Les artefacts restent locaux, exclus du suivi Git par `.gitignore`.

## Limites et arrêt de phase

Les images restent des ressources 2D ; les reflets métalliques du blason sont inscrits dans son visuel. Aucune nouvelle animation de maillot, comparaison domicile V1/V2 ou vraie 3D n’a été ajoutée. Les appareils sont émulés dans Chromium, pas testés sur un iPhone physique ou Safari. Sur les écrans très courts, le hero grandit pour conserver tous ses contrôles accessibles et se parcourt par défilement normal.

Laocoön reste inaccessible avec la politique réseau active. Cette phase applique le cahier des charges reçu et ne constitue pas une reproduction vérifiée de ce site.

La phase s’arrête ici pour présentation des résultats avant toute nouvelle étape.
