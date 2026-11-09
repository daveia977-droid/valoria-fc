# VALORIA FC — prototypes Collection & Organisation

Étape 1 des phases C/D : démonstration locale indépendante. Les phases A/B validées sont réutilisées sans modifier leurs fichiers ; le site principal, les assets, les dépendances et la configuration de production restent inchangés. Aucun push, intégration à main ou déploiement.

## Choix visuels

- Même textile bordeaux, blason, noir, or, crème et fontes locales Cormorant Garamond / Manrope. Titres éditoriaux à gauche sur ordinateur, puis au-dessus sur téléphone.
- Collection : une tenue dominante, quatre onglets avec sélection visible, commandes Face/Dos, transition brève de 260 ms. Le cadrage et les pixels du maillot proviennent de l’atlas existant ; pas de mélange du décor avec le vêtement. Le fond photographique est raccordé dans ses marges vides. Aucun nouveau visuel n’est produit.
- Organisation : sept personnes, listes imbriquées sémantiques, connexions fines et trois branches sur ordinateur. Sur téléphone, lecture verticale avec indentation et traits de rattachement. Les fiches natives reprennent les descriptions, responsables et collaborateurs déjà validés dans `src/organisation.js`.
- Continuité : même décor d’un chapitre à l’autre, déplacements mesurés de ses couches au scroll, révélation groupée des textes/connexions. Aucun scroll bloqué, carrousel automatique ou boucle d’animation permanente. La préférence de mouvement réduit et la pause du prototype rendent les contenus statiques.

## UI UX Pro Max

Installé et utilisé : `.agents/skills/ui-ux-pro-max/SKILL.md`, version CLI **2.15.0**, licence **MIT**. Installation Codex documentée effectuée dans un dossier temporaire puis copie du seul skill dans le projet ; CLI conservé sous `/tmp`, sans installation globale hors des zones autorisées. Aucune dépendance ajoutée au site.

Recherches locales ciblées : clavier/onglets, reflow des sélections, contrastes, transitions interrompables et hiérarchie sémantique. Elles servent au contrôle de conception ; aucune nouvelle palette, fonte ou architecture n’est imposée. `PROVENANCE.md` conserve la source, la version et l’intégrité du paquet. Aucun Magic MCP, 21st.dev, service payant ou API.

## Ressources manquantes

Les quatre faces sont disponibles dans `public/assets/collection.webp` (1832×859), sans sponsor. Les dos authentiques approuvés ne sont pas présents comme fichiers exploitables. L’ancien SVG « proposition du dos » n’est pas utilisé. La commande **Dos** affiche « Visuel en attente » pour la tenue sélectionnée, sans image arrière inventée. Elle sera raccordée seulement à un fichier reçu et validé.

Les polices des maquettes ne sont pas identifiées avec certitude ; les familles libres déjà présentes sont conservées. Aucun nouvel élément officiel, personne, poste, sponsor, numéro ou fait sportif n’est ajouté.

## Fichiers

- `index.html` : parcours de démonstration, avec hero validé réutilisé et nouvelles sections statiques.
- `style.css`, `collection.js`, `main.js` : composition, sélecteurs, état dos absent et continuité légère des décors.
- `organisation.html`, `organisation.css`, `organisation.js` : fragment source de l’organigramme, styles et fiches. Le fragment est repris statiquement dans `index.html` pour conserver la hiérarchie HTML sans dépendre d’une injection JavaScript.
- `vite.config.js` : compilation séparée, sans changer celle du site.
- `verify.mjs` : contrôles navigateur et captures réelles.

## Prévisualisation locale

Depuis la racine du dépôt, avec les dépendances déjà installées :

```sh
npx vite build --config prototypes/collection-organisation/vite.config.js
npx vite preview --config prototypes/collection-organisation/vite.config.js --host 0.0.0.0 --port 4187 --strictPort
```

Ouvrir `http://localhost:4187/` sur la machine exécutant le serveur. Les liens du menu Collection et Organisation sont internes à ce prototype. Ce n’est pas une nouvelle URL publique et l’iPhone ne peut pas joindre automatiquement le serveur de cet environnement distant.

Une autre possibilité est le serveur Vite existant :

```sh
npm run dev -- --host 0.0.0.0 --port 4173 --strictPort
```

Puis `http://localhost:4173/prototypes/collection-organisation/`. Sur un PC local et un iPhone du même réseau, remplacer localhost par l’IP locale du PC ; aucun compte d’hébergement n’est requis.

## Vérification

Dans un autre terminal, avec le prototype compilé sur 4187 :

```sh
node prototypes/collection-organisation/verify.mjs
```

Les preuves se trouvent dans `artifacts/collection-organisation/` : captures de chaque section à 1440/390 px, vues de dos indisponibles, quatre faces, fiches et résultats JSON. Les interactions et le scroll tactile sont testés en 390×844 ; les captures complètes de chapitre utilisent une fenêtre réellement agrandie en hauteur à la même largeur pour présenter tous les éléments avec la navigation en haut. Les dimensions effectives sont consignées dans le rapport.

Les vidéos montrent des positions de scroll réellement rendues par le navigateur, encodées à 12 images/s ; elles ne mesurent pas le framerate de l’application. Aucun iPhone physique/Safari iOS n’est connecté ; cette vérification reste à effectuer sur appareil réel après validation des prototypes.

Sauvegarde avant travail : `/workspace/valoria-sauvegardes/phases-cd-20261109/` (bundle Git et archive du hero validé). Coût supplémentaire : **0 €**.

Attendre la validation visuelle des deux sections et des transitions avant l’étape 2 d’intégration au site principal. La publication nécessite ensuite une autorisation distincte.

## Résultats de cette livraison

Compilation indépendante réussie. Contrôles du prototype réussis sur **320×568, 390×844, 768×1024, 1440×900 et 844×390** : quatre sélections, clavier, changements rapides, dos manquants, hiérarchie, fiches, retour du focus, mouvement réduit et scroll tactile Chromium. **Huit contrôles axe sans violation détectée**, aucune erreur JavaScript, ressource manquante ou requête distante observée. Aucun modèle ni contexte WebGL chargé.

Captures : `collection-1440.png`, `collection-390.png`, `organisation-1440.png`, `organisation-390.png`. Planches : `planche-desktop.png`, `planche-mobile.png`, `quatre-faces.png`. Démonstrations : `transitions-desktop.mp4` et `transitions-mobile.mp4`, dix secondes chacune, avec descente puis remontée. Rapport : `prototype-verification.json` ; sorties de compilation et contrôles : `build.log`, `tests.log`.

Revue visuelle effectuée sur les quatre captures, les poses intermédiaires des vidéos, la fiche et l’état Dos. Couleurs, matières, hiérarchie et typographie cohérentes avec la maquette. Détail hérité de l’atlas : le centrage optique du Third diffère légèrement du V1 et son recadrage initial peut rogner environ un pixel à l’extrémité gauche de la manche. Aucun nouveau visuel de maillot n’a été fabriqué pour corriger cette limite de la source.

Validation attendue : composition de la collection, sélection/Face-Dos, lisibilité des branches et fiches, continuité des transitions. L’intégration au site principal, ses tests de non-régression et toute publication restent à l’étape suivante, après accord.
