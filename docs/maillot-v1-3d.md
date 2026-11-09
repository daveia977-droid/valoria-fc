# Domicile V1 : première version réellement en 3D

## Réalisation

Le GLB contient six maillages : corps creux avec panneaux avant et arrière, deux manches avec ouvertures, deux bordures de manche et col en volume. La géométrie a une profondeur d’environ 0,264 unité et ne consiste pas en un plan portant une image. La texture de face réutilise les pixels du premier maillot de `collection.webp` ; le dos est uni, suivant la décision de l’utilisateur. Le modèle embarque son image JPEG et ne demande aucune ressource externe.

La coupe est une approximation construite à partir d’une seule vue de face. Ce n’est ni un patron de confection, ni un scan, ni une simulation physique de tissu. L’éclairage d’origine reste visible dans la texture photographique ; il n’a pas été reconstruit en matériau textile complet. Le raccord des épaules a été corrigé après inspection de la rotation. Les ouvertures, le col et les manches possèdent un volume réel, avec une faible épaisseur de tissu.

## Interface opérationnelle

Dans Collection : **Explorer le domicile V1 en 3D** ouvre une fenêtre native. Elle propose rotation libre à 360°, légère inclinaison par glissement vertical, commandes Face/Dos/Côté gauche/Côté droit, curseur d’angle, zoom et réinitialisation. La rotation automatique est désactivée à l’ouverture et disponible sur demande. La souris, le tactile et le clavier sont pris en charge.

`prefers-reduced-motion` et le bouton de pause global bloquent la rotation automatique, sans supprimer les commandes manuelles. L’onglet masqué suspend le rendu. Hors rotation automatique, le rendu n’est calculé qu’après une interaction ou un redimensionnement. Fermer la fenêtre interrompt le chargement et libère géométries, matériaux, textures, contexte WebGL, observateurs et événements. La touche Échap ferme et rend le focus au bouton d’ouverture.

L’absence de WebGL ou une erreur de chargement affiche un message et permet de réessayer ou revenir à la collection 2D. Les trois autres tenues et le blason ne sont pas modélisés dans cette étape.

## Fichiers ajoutés ou modifiés

- `index.html`, `src/main.js` : bouton et fenêtre de visualisation, initialisation.
- `src/jersey-entry.js` : chargement différé, états de chargement et d’erreur, gestion de fermeture.
- `src/jersey-viewer.js` : Three.js, chargement du GLB, éclairage, commandes, rendu et libération.
- `src/jersey.css` : fenêtre responsive, scène et commandes.
- `public/models/domicile-v1.glb` : modèle autonome de 941 476 octets.
- `tools/prepare_jersey_texture.py`, `tools/build_jersey.py` : sources reproductibles de la texture et de la géométrie.
- `package.json`, `package-lock.json`, `public/licenses/Three.txt` : Three.js 0.187.0, MIT.
- `tests/jersey-3d.spec.js` : onze tests supplémentaires ; les dix-huit tests antérieurs sont inchangés.
- README, guide de prévisualisation, définition du dos et bilan budgétaire actualisés.

Les fichiers originaux `collection.webp`, `crest.webp`, le module d’organisation et `vercel.json` sont inchangés, vérifiés par SHA-256 avant/après.

## Vérifications et performances

- `npm run build` : réussite. Le module 3D représente environ 628 ko minifiés / 159 ko gzip. Vite signale sa taille supérieure à 500 ko ; il est déjà séparé par import dynamique, pas intégré au JavaScript initial de 15,5 ko.
- `npm test` : **29 tests réussis**, dont les sept tests initiaux, les onze autres contrôles précédents et les onze nouveaux.
- Géométrie du GLB, texture embarquée, dos sans texture, vues WebGL différentes, chargement différé, zoom, clavier, fermeture et réouverture vérifiés.
- Réduction du mouvement modifiée à chaud, pause globale, modèle 404, nouvel essai, absence de WebGL et fermeture pendant un chargement vérifiés.
- Affichage 320/390/768/1440 px ; vrai flux d’événements tactiles émulés à 320/390 px et glissement souris aux deux autres largeurs.
- Captures réalisées dans le résultat compilé servi localement sur le port 4174 ; aucune erreur JavaScript détectée lors de ce parcours.
- Limite : Chromium et téléphones émulés ; pas de validation sur un téléphone physique ou tous les GPU/navigateurs. Un appareil doit permettre WebGL 2 pour cette vue.

Captures : `artifacts/maillots-3d/ordinateur.jpg`, `mobile.jpg`, `mobile-commandes.jpg`, `face.jpg`, `dos.jpg`, `cote.jpg`, `vue-trois-quarts.jpg`. Projet Blender éditable : `artifacts/maillots-3d/domicile-v1.blend`. Les captures sont des images du vrai rendu WebGL, pas une génération de maillot.

## Reproduction facultative du modèle

Le site est prêt à fonctionner avec son GLB fourni ; ces étapes sont destinées uniquement à modifier le modèle, avec Python/Pillow et Blender installés gratuitement en local :

```sh
python3 tools/prepare_jersey_texture.py
blender --background --factory-startup --threads 4 --python-exit-code 1 --python tools/build_jersey.py
```

Blender signale l’absence de son compresseur Draco facultatif sur cet environnement, mais exporte correctement le GLB sans compression Draco. Aucun composant Draco n’est utilisé ou requis dans le navigateur.

## Publication

L’utilisateur a autorisé la publication après réalisation. Aucun déploiement n’a encore abouti : l’accès à `api.vercel.com` est refusé par le proxy (HTTP 403) et aucun compte Vercel n’est connecté à cet environnement. Ne pas présenter une adresse locale comme une adresse Vercel. Le code est compilé, testé et préparé en archive pour publication ; le budget de 0 € reste prioritaire.
