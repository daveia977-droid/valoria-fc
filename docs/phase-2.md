# Phase 2 — motion, collection et organigramme

## Périmètre livré, exclusivement local

Le site Vite existant a été amélioré sans ajout de dépendance, sans React/Next.js/Three.js/GSAP, sans déploiement et sans modification des fichiers de l’écusson ou des maillots. Noir, bordeaux, or et crème sont conservés ; violet réservé au troisième maillot.

### Organigramme interactif

L’arbre HTML suit exactement les rattachements du projet : Yvan → Messi → Charel / Mamady / Émilie ; Charel → Marco ; Mamady → Dylan. Le dessin est construit avec des listes imbriquées et des boutons, sans image SVG générée ou canvas.

Un clic, une touche Entrée ou Espace sur un nom ouvre sa fiche : fonction, responsabilités connues, responsable direct et équipe directe. Des boutons permettent de consulter les fiches des personnes rattachées ou du responsable. Le nombre de personnes dans une branche est calculé à partir des sept noms fournis. Une absence de rattachement est explicitement limitée à l’organigramme du projet ; aucun employé n’est inventé.

Le chemin hiérarchique choisi est mis en évidence. Les cartes apparaissent avec le défilement ; le dialogue et son contenu s’animent à l’ouverture et au changement de personne. Échap et Fermer ferment la fiche ; le focus revient au bouton d’origine. Sur mobile, les branches s’empilent avec indentation.

### Défilement et intro

L’entrée progressive existante est conservée. L’écusson reste une image 2D : un déplacement, une inclinaison CSS légère et une petite variation d’échelle suivent la position du scroll. Le mouvement maximal est réduit sur téléphone. Le fond bordeaux/or change légèrement d’opacité pour accompagner la transition.

Les apparitions des textes, cartes et zones de collection sont désormais réversibles : leur état dépend de leur position dans la fenêtre, pas d’une animation jouée une seule fois. Le navigateur conserve son défilement naturel. Le contrôleur groupe lectures de position et écritures dans une frame et ne met à jour que les éléments visibles ; les animations d’ambiance s’arrêtent hors écran ou dans un onglet masqué.

Le bouton de pause coupe les mouvements. La préférence système de réduction du mouvement est prioritaire : tous les contenus deviennent immédiatement visibles et les transitions d’interaction ne sont pas créées.

### Collection

Les quatre onglets de maillots sont conservés. La commande native « Comparer les deux domiciles » révèle V1 et V2 côte à côte, également au clavier et sur mobile.

Les ressources séparées restent absentes : tous les visuels sont des recadrages de `public/assets/collection.webp`. Aucun détail de col, motif, blason ou manche n’a été inventé ou régénéré ; aucun sponsor n’est ajouté. Ce choix conserve les modèles mais limite la définition et empêche une véritable animation volumétrique des vêtements.

## Fichiers modifiés

| Fichier | Changement |
| --- | --- |
| `index.html` | Comparaison native, organigramme en listes, cartes accessibles et dialogue des personnes. |
| `src/main.js` | Initialisation des modules ; navigation, contact et galerie conservés. |
| `src/style.css` | Arbre et connecteurs, états sélectionnés, fiches, comparaison et dispositions mobiles. |
| `src/motion.js` — nouveau | Entrée, ambiance, scroll réversible, pause et préférences. |
| `src/organisation.js` — nouveau | Sept personnes, rôles officiels, relations et navigation des fiches. |
| `src/kit-atlas.js` — nouveau | Réutilisation du même atlas dans la galerie et la comparaison. |
| `tests/phase-2.spec.js` — nouveau | Sept tests supplémentaires. Les sept tests de `tests/site.spec.js` sont inchangés. |
| `README.md`, `docs/phase-2.md`, `design-qa.md` | Instructions et bilan de validation. |

`package.json`, le verrou npm, les images et la configuration Vercel sont préservés.

## Compilation et tests

- `npm run build` : réussite. JavaScript applicatif compilé d’environ 12,3 Ko, soit 4,8 Ko gzip ; aucune nouvelle image ni police à télécharger.
- `npm test` : **14 tests exécutés, 14 réussis, aucun désactivé**, en 15,9 secondes. Les sept tests existants sont inchangés. Résultat complet : `artifacts/phase-2/test-results.txt`.
- Les nouveaux tests couvrent les sept personnes, les quatre relations de branche, la navigation entre fiches et le retour du focus, la comparaison au clavier sur 390/1440 px, les poses de défilement retrouvées en descente/remontée sur téléphone et ordinateur, le changement de préférence système et axe sur les nouveaux états.
- Un premier test a révélé un retour visuel différent après remontée : le calcul utilisait la position déjà transformée. La translation a été retirée de la mesure de référence ; le test vérifie maintenant le retour à la même pose. L’attente du changement de préférence système est explicitement synchronisée avant la fermeture du dialogue.
- Vérification du résultat compilé, via serveur de prévisualisation **local**, sur 320, 390, 768 et 1440 px : comparaison, fiches et absence de débordement. Aucune exception de page ou réponse HTTP en échec. Détails : `artifacts/phase-2/production-smoke.json`.

## Captures et vidéo

Dans `artifacts/phase-2/` :

- `organisation-desktop.jpg` et `organisation-mobile.jpg` : arbre complet, captures issues de la page rendue.
- `fiche-desktop.jpg` et `fiche-mobile.jpg` : fonction de Charel, responsable Messi et collaborateur Marco.
- `comparison-desktop.jpg` et `comparison-mobile.jpg` : maillots domicile côte à côte.
- `hero-desktop.jpg` et `hero-mobile.jpg` : introduction.
- `org-before-after.jpg` : comparaison de l’organisation avant/après.
- `organigramme-motion.mp4` : défilement réel, ouverture de Charel, navigation vers Marco et fermeture.

Les images fixes utilisent le mouvement réduit pour stabiliser la comparaison. La vidéo est enregistrée avec les animations activées. Les captures complètes d’organigramme sont extraites d’une capture pleine page pour éviter un artefact de capture Chromium lié aux éléments fixes. Ces artefacts sont locaux et exclus de Git.

## Lancement local

Depuis la racine du projet, avec Node.js 24 recommandé :

```sh
npm ci
npm run dev -- --host 0.0.0.0 --port 4173 --strictPort
```

Ouvrir dans son navigateur l’adresse locale affichée par Vite. Dans l’environnement cloud, le serveur tourne déjà sur le port 4173 ; cela ne crée pas de lien public. Le relais d’aperçu partagé n’est pas disponible dans l’instance actuelle.

Pour tester la compilation localement :

```sh
npm run build
npm run preview -- --port 4174 --strictPort
```

Pour les tests : `npm test`. Sur une machine sans Chromium, installer le navigateur de test avec `npx playwright install chromium`.

## Limites et arrêt

Pas de modèle 3D ou de véritables reflets calculés ; la profondeur est celle d’une image inclinée en CSS. Pas de ressources de maillot séparées, ni de modification des modèles. Pas de test sur iPhone physique ou Safari, ni de promesse de fréquence d’images sur tout appareil. Le formulaire reste un brouillon local ; aucune messagerie n’a été ajoutée. Aucune analyse nouvelle de Laocoön n’est revendiquée, son accès réseau restant bloqué.

La phase s’arrête après présentation des résultats. Aucun déploiement, aucune demande de secret et aucune publication n’ont été effectués.
