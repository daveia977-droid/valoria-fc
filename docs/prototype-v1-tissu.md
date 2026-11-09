# V1 : audit des ressources et étude indépendante du tissu

> Conservation lors de la mission GitHub Pages : cette étude, initialement locale, est archivée dans `design/maillots/etudes-v1/` avec ses sources. Elle reste hors du contenu publié dans `dist/` et ne remplace pas le modèle affiché par le site. Les constats ci-dessous décrivent les validations et blocages de la phase de modélisation.

## Statut réel

### Ajustement suivant le choix de la base avec plis

La base retenue par l’utilisateur est conservée dans `artifacts/prototype-v1-base-retenue/`, ainsi qu’à son emplacement précédent. Une variante légèrement assouplie est produite dans `artifacts/prototype-v1-assoupli/` : trajets de plis courbes et de longueurs différentes à la taille, rassemblement moins symétrique sous les bras, petites compressions aux épaules et légère irrégularité des manches et des ouvertures. La silhouette générale, le nombre de triangles, les UV et les octets de la texture de face sont conservés ; ce sont des ajustements de sculpture, pas une simulation physique.

Les vues `face-etude.jpg` et `trois-quarts-etude.jpg` utilisent la face existante. `profil-geometrie.jpg` et `dos-geometrie.jpg` restent des diagnostics gris sans habillage validé. `rotation-mobile-geometrie.mp4` montre une véritable rotation pilotée par des événements tactiles dans une fenêtre mobile émulée de 390 × 844 px. Ces fichiers ne constituent pas les quatre vues habillées demandées : le fichier PNG du nouveau dos n’est toujours pas disponible, y compris après inspection du dépôt distant. La cohérence graphique des nouveaux motifs et coutures sur les côtés reste donc à vérifier après réception du PNG.

Le constructeur et le contrôleur utilisent désormais ce nouveau dossier par défaut ; `VFC_STUDY_OUTPUT` permet de sélectionner un autre emplacement sans écraser la base retenue. `VFC_DEMO_MOBILE=1` active la capture tactile mobile. L’application, les autres tenues et les autres sections restent inchangées ; aucun push ou déploiement n’est effectué.

**Le prototype complet de l’étape A n’est pas terminé.** Le PNG original du nouveau dos n’est pas disponible dans les fichiers accessibles à cet environnement. Son aperçu dans la conversation ne donne pas accès au fichier situé dans `C:/Users/...`.

L’utilisateur a confirmé de suspendre uniquement cette fonctionnalité et de poursuivre les corrections indépendantes. Il a aussi confirmé la priorité : **même épaule physique pour le motif doré entre la face et le dos**, avec adaptation de l’orientation du dos lorsque le fichier sera fourni. Aucun motif arrière ou latéral n’a été créé ou présenté comme fidèle à cette nouvelle référence.

## Ressources réellement inspectées

| Tenue | Ressources locales exploitables | Nouveau dos |
| --- | --- | --- |
| Domicile V1 | Face dans `public/assets/collection.webp` ; GLB autonome `public/models/domicile-v1.glb` ; source `design/maillots/domicile-v1.blend`, avec image de face embarquée. | Aperçu visible dans la conversation ; PNG original absent du workspace. |
| Domicile V2 | Face dans le même atlas ; pas de GLB ou projet Blender propre à cette tenue. | Aperçu visible ; fichier absent. |
| Extérieur | Face dans le même atlas ; pas de GLB ou projet Blender propre à cette tenue. | Aperçu visible ; fichier absent. |
| Troisième | Face dans le même atlas ; pas de GLB ou projet Blender propre à cette tenue. | Aperçu visible ; fichier absent. |

Le V1 existant peut servir de base géométrique : six maillages, col et manches en volume, 34 936 triangles après export, enveloppe de profondeur maximale 0,264 unité. Sa texture embarquée ne contient que la face ; le dos utilise un matériau uniforme. Les plis actuels sont faibles. Les trois autres maillots ne sont pas des modèles 3D et ne sont pas traités dans cette étape.

Avant toute modification : archive de 57 fichiers, manifeste SHA-256 et bundle Git conservés dans `/workspace/valoria-sauvegardes/2026-11-09-prototype-v1/`. Le modèle, le projet Blender, les textures et le code du site d’origine sont conservés sans modification.

## Travail indépendant réalisé

Une **étude géométrique séparée** réutilise directement le projet Blender existant. Elle est générée dans `artifacts/prototype-v1/`, sans remplacer le GLB servi par le site.

- Enveloppe du torse épaissie et manches légèrement arrondies ; profondeur maximale mesurée proche de 0,377 unité.
- Plis sculptés par déplacement réel des sommets : aisselles, taille, drapé diagonal et bas du vêtement. Ce ne sont pas des plis simplement imprimés sur un plan. Ils sont procéduraux, sans simulation physique de tissu annoncée.
- Grain textile original calculé localement, sous forme d’une normale PNG de 256 × 256 pixels ; matériau plus mat, sans aspect de métal poli sur les finitions en tissu.
- **JPEG de face du GLB original conservé octet pour octet**, vérifié après export. Les motifs, les écussons, les couleurs de l’image et ses UV existants ne sont pas repeints.
- Nombre de triangles conservé : 34 936. Export autonome d’environ 1,09 Mo, avec deux images embarquées, sans chargement depuis un service tiers.

Sources ajoutées : `tools/build_v1_cloth_prototype.py` et `tools/inspect_v1_cloth_prototype.mjs`. Les sources, les modèles et les captures précédents ne sont pas remplacés. Aucune bibliothèque ou dépendance ajoutée. Blender et Three.js déjà présents, outils locaux gratuits ; coût de cette intervention : **0 €**.

## Présentation et vérifications

L’étude est chargée uniquement dans un navigateur de contrôle local par substitution de la réponse GLB. **Le site et la branche GitHub `main` restent inchangés.** Aucun nouveau bouton, fenêtre, contrôle, configurateur ou comportement automatique n’est ajouté.

Les vues de profil, de dos et la rotation de l’étude sont rendues **en gris sans habillage**, avec la mention « étude géométrique sans habillage — dos en attente du PNG ». Elles servent à vérifier le volume et les plis ; elles ne constituent pas des vues officielles du nouveau maillot. Les vues de face réutilisent l’image déjà validée.

- Géométrie vérifiée : dimensions, positions finies, nombre de triangles et présence du grain textile sur une seconde couche d’UV.
- Image de face vérifiée par comparaison exacte des octets avec le GLB d’origine.
- Rendu vérifié à 320, 390, 768 et 1440 px, sans débordement. À 320/390 px, glissement tactile horizontal et défilement vertical natif testés sur cette étude ; commandes clavier vérifiées aux deux autres formats.
- Aucune erreur JavaScript détectée dans ce parcours.
- `npm run build` : réussite sur le site conservé. `npm test` : **29 tests réussis**, sans modification des tests existants. Ces résultats ne constituent pas une validation du nouveau dos, qui n’a pas été intégré.
- Limite de performance : contrôles effectués dans Chromium et sur mobile émulé ; aucun iPhone physique ni objectif de 60 images/seconde certifié.

## Comparaisons et limites restantes

Les captures comparent la géométrie d’origine et l’étude à éclairage identique, ainsi que la face 2D existante et sa présentation sur l’étude. **Aucune comparaison pixel à pixel avec le nouveau dos n’est possible sans son fichier.**

Livrables locaux dans `artifacts/prototype-v1/` : `face-etude.jpg`, `profil-geometrie.jpg`, `dos-geometrie.jpg`, `comparaison-face.jpg`, `comparaison-geometrie-dos.jpg` et `rotation-geometrie.mp4` (5 secondes). Les vues grises sont des diagnostics techniques, sans apparence de dos validée. Source éditable : `domicile-v1-volume-et-plis.blend` ; export d’étude : `domicile-v1-volume-et-plis.glb`. Les originaux restent à leur emplacement initial.

La silhouette conserve la base simplifiée du modèle initial. Les plis nécessitent encore une revue artistique ; ils restent plus réguliers qu’un véritable drapé de vêtement. Les raccords des six pièces et le col devront être contrôlés de nouveau avec l’habillage complet. La texture de face conserve son éclairage photographique d’origine : elle ne constitue pas un albédo uniforme pour une restitution physique exacte.

Les références de dos montrées sont des vues en perspective, pas des textures UV à plat. Même avec les PNG, les zones cachées sous les bras, l’intérieur des manches et certains raccords latéraux ne pourront pas être reproduits exactement sans référence complémentaire. Ces zones ne seront pas complétées par des motifs inventés. Aucun numéro, nom ou sponsor n’est ajouté.

## Suite gratuite, après réception du PNG

1. Conserver le PNG original et l’associer explicitement au V1.
2. Préparer dans Blender une projection et un placement UV du dos correspondant à la même épaule physique que la face, suivant le choix confirmé par l’utilisateur.
3. Ajuster les raccords visibles et signaler les parties réellement absentes des références, sans modifier la face validée.
4. Exporter le V1 corrigé, puis produire les vues de face/profil/dos habillées, la rotation et les comparaisons avant validation.
5. Attendre la validation du V1 avant les trois autres tenues.

Aucun service payant, achat de modèle, génération d’image, changement d’hébergement ou déploiement Vercel n’est nécessaire. Aucun push GitHub n’est effectué pour cette étude incomplète.

## Reproduction locale facultative de l’étude

Avec Blender installé et les dépendances habituelles du projet présentes :

```sh
blender --background --threads 4 --python-exit-code 1 --python tools/build_v1_cloth_prototype.py
npm run dev -- --host 127.0.0.1 --port 4173 --strictPort
```

Dans un autre terminal :

```sh
node tools/inspect_v1_cloth_prototype.mjs
```

Le script de contrôle utilise Playwright et un Chromium installé ; `CHROMIUM_PATH` permet de sélectionner un exécutable existant. Il ne modifie pas le site. Le GLB d’étude et sa source Blender sont dans `artifacts/prototype-v1/` ; les données d’audit sont dans `verification-etude.json`.
