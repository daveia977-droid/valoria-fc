# Correction ciblée de la collection — 9 novembre 2026

## Résultat

La fenêtre « Vue 360° », ses boutons Face/Dos/Côtés, sa jauge, son zoom et sa rotation automatique sont retirés. La collection conserve les quatre sélections existantes, la comparaison des deux domiciles, les couleurs, les textes officiels et les images validées. Les maillots sont agrandis ; sur mobile, la sélection est placée avant le maillot et les textes secondaires sont masqués pour privilégier le visuel.

Le domicile V1 réutilise **exactement le GLB existant** : glissement horizontal direct à la souris ou au doigt, sans commandes supplémentaires. Le panneau de présentation est accessible au clavier ; flèches gauche/droite pour tourner et Début pour revenir de face. Une mention courte indique « Prototype 3D ». La coupe approximative du prototype n’a pas été retouchée.

Les trois autres tenues gardent leur image de face d’origine. Une inclinaison bornée à 3°/4° accompagne le pointeur ; elle est annulée par la réduction du mouvement ou la pause globale. La mention « Visuel 2D » distingue cette perspective d’une vraie rotation. Aucun dos ni côté n’est créé.

Le mouvement vertical au doigt conserve le défilement naturel. La 3D ne tourne jamais automatiquement ; le rendu est calculé seulement sur interaction ou redimensionnement. Le modèle et son moteur se chargent lorsque le domicile V1 est visible et sont libérés à la sortie ou au changement de tenue. Si le GLB ou WebGL est indisponible, l’image originale reste affichée, sans fenêtre ni commandes d’erreur supplémentaires.

## Portée vérifiée

- Modifiés : `index.html` uniquement dans la collection et pour retirer sa modale ; deux lignes d’initialisation dans `src/main.js` ; `src/jersey-entry.js`, `src/jersey-viewer.js`, `src/jersey.css` et les tests propres à cette ancienne fenêtre.
- Styles limités à `#collection`. Le hero, le club, l’organigramme, le contact, la navigation et leurs modules ne sont pas refondus.
- Les fichiers `public/`, dont tous les visuels et le GLB, sont inchangés. Vérification SHA-256 avant/après, également pour les modules des autres sections, les 18 tests antérieurs, les dépendances et `vercel.json`.
- Aucune bibliothèque, API, nouvelle génération d’image, modèle ou service ajouté. Budget de cette intervention : **0 €**. Aucun déploiement Vercel.

## Conservation et GitHub

Le code complet a été retrouvé dans `/workspace/valoria-fc`, branche locale `feat/valoria-v1`. La branche distante `main` ne contenait effectivement que `README.md` au début de l’intervention.

Avant toute modification : archive complète hors checkout, incluant les ressources et captures ignorées par Git, dans `/workspace/valoria-sauvegardes/2026-11-09-collection/etat-avant.tar.gz` (179 fichiers, vérifiés), manifeste SHA-256 et bundle de l’historique Git. L’état source initial complet est aussi conservé dans le commit `7468ca9` de la branche de travail. Aucun fichier source existant n’est supprimé.

La synchronisation cible `feat/valoria-v1`, sans modifier `main`, pour permettre une revue avant validation. Les sources Blender et SVG déjà présentes sont également copiées sans modification dans `design/maillots/`. Les captures livrées et la démonstration sont dans `docs/media/`. Les dépendances installées, caches et fichiers compilés restent exclus de Git et sont reproductibles avec `npm ci` et `npm run build`.

## Validation

- `npm run build` : réussite. Le module Three.js reste séparé par import dynamique ; Vite conserve son avertissement de taille supérieure à 500 ko pour ce seul module différé.
- `npm test` : **29 tests réussis**. Les 18 tests des autres fonctionnalités restent inchangés ; les 11 tests maillot sont adaptés à la suppression de la fenêtre et vérifient les interactions intégrées.
- Géométrie réelle du GLB, chargement différé, rotation clavier et souris, absence de commandes supplémentaires, repli en cas de fichier 404 ou d’absence de WebGL, changement pendant le chargement et libération des ressources vérifiés.
- Perspectives 2D bornées et pause globale vérifiées ; rotation manuelle compatible avec la réduction du mouvement, sans animation passive.
- 320/390/768/1440 px vérifiés. Rotation tactile **et défilement vertical natif** testés avec événements tactiles Chromium à 320/390 px. Les quatre tenues restent visibles en grand, sans débordement.
- Captures et démonstration réalisées sur le résultat compilé servi localement, sans erreur JavaScript détectée. Démonstration : véritables glissements du pointeur sur le GLB, puis inclinaison du visuel V2 ; pas de vidéo préfabriquée du maillot.
- Limite : appareils mobiles émulés, pas de téléphone physique ; les trois autres modèles 3D ne sont pas disponibles. Leur présentation reste honnêtement en 2D.

[Capture desktop](media/collection-desktop.jpg) · [Capture mobile](media/collection-mobile.jpg) · [Démonstration, 7,5 secondes](media/collection-mouvement.mp4)

## Prévisualisation locale

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 4173 --strictPort
```

Ouvrir `http://127.0.0.1:4173/` sur la machine qui exécute Vite, puis Collection. Cette adresse est locale, pas une URL publique ou Vercel. Voir le guide Windows dans `PREVISUALISATION.md`.

Aucune nouvelle phase ne sera entreprise sans validation.
