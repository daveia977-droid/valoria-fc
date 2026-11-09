# VALORIA FC — prototype local du hero

Direction à valider : **Écrin bordeaux**. Blason validé au centre, grands caractères crème, scène sombre, lumière or/bordeaux et passage continu vers l’identité au défilement. Le prototype réutilise les ressources et polices existantes. Il ne remplace aucune section du site.

Deux états du hero partagent le même décor. Le titre s’efface, le blason change de cadrage, le texte d’identité entre dans la scène. La lecture se rejoue à la remontée. Le scroll reste natif ; le passage dure moins d’une hauteur d’écran supplémentaire. Pause, mouvement réduit, ancres et navigation clavier sont opérationnels.

Le blason reste une image 2D mise en scène sur plusieurs plans CSS, avec perspective limitée. Il n’y a ni nouveau modèle 3D, ni reflets métalliques physiquement recalculés. La présentation de collection en bas est seulement une liaison visuelle vers les quatre faces existantes, pas une nouvelle galerie face/dos terminée.

## Voir le prototype

Depuis la racine du dépôt :

```sh
npm run dev -- --host 127.0.0.1 --port 4173 --strictPort
```

Sur cette même machine, ouvrir `http://127.0.0.1:4173/prototypes/hero-cinematique/`.

Compilation séparée, sans changer le build du site :

```sh
npx vite build --config prototypes/hero-cinematique/vite.config.js
npx vite preview --config prototypes/hero-cinematique/vite.config.js --host 127.0.0.1 --port 4186 --strictPort
```

Ouvrir `http://127.0.0.1:4186/`. Le résultat statique est dans `artifacts/hero-cinematique/dist/`. Ce sont des adresses locales, pas de nouveaux sites publics. Les liens Organisation et « collection existante » conduisent à la production fournie par l’utilisateur ; ils ne la modifient pas.

Dans un autre terminal, vérifier le prototype compilé :

```sh
node prototypes/hero-cinematique/verify.mjs
```

Le test utilise Chromium et les dépendances Playwright/axe déjà installées. Il contrôle quatre largeurs, l’absence de débordement, le retour exact à la pose initiale au scroll inverse, la pause, les changements de préférence de mouvement, les ancres et le focus clavier. Les captures desktop/mobile, la vidéo du scroll et les rapports sont dans `artifacts/art-direction-audit/`.

Aucune dépendance ajoutée, image générée ou ressource achetée. Aucun push ni déploiement. Ne pas intégrer au site complet avant validation de la direction.
