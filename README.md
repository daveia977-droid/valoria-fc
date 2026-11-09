# valoria-fc
Site vitrine officiel du club de football fictif VALORIA FC — projet pédagogique.

**Budget prioritaire : 0 €.** Voir [AGENTS.md](AGENTS.md) et [le bilan des ressources](docs/budget-zero.md). Aucun achat, essai payant, abonnement, service facturé à l’usage ou déploiement n’est nécessaire pour cette version locale.

**Pour voir le vrai site sur son PC : [PREVISUALISATION.md](PREVISUALISATION.md).** Un ZIP doit être téléchargé puis extrait ; son aperçu dans Codex n’exécute pas Vite. Le guide donne les étapes Windows / macOS / Linux et le diagnostic du relais partagé indisponible.

## Version 1

Site statique en français : noir profond, bordeaux, or et crème, hero « VALORIA FC » avec écusson central, motion design 2D, collection sans sponsor, présentation du club, organisation et responsabilités. Le violet est réservé au troisième maillot.

La première phase de refonte est documentée dans [docs/phase-1.md](docs/phase-1.md). Les captures avant/après et l’aperçu animé sont disponibles localement dans `artifacts/phase-1/` ; aucune refonte des maillots ni intégration 3D n’a été entreprise.

La [phase 2](docs/phase-2.md) ajoute un organigramme interactif animé, des fiches de fonction navigables, un défilement réversible et une comparaison des deux domiciles. Cette phase est exclusivement locale et n’effectue aucun déploiement.

La [phase 3](docs/phase-3.md) unifie désormais l’ensemble du site dans une composition sombre continue, agrandit le blason, compacte l’organigramme mobile et resserre les cadrages de collection. Navigation persistante, suivi du chapitre et progression de lecture ; aucune nouvelle dépendance ou ressource achetée. Les captures de toutes les sections et la vidéo sont dans `artifacts/phase-3/`.

### Domicile V1 en 3D

La [première tenue 3D](docs/maillot-v1-3d.md) est maintenant modélisée et intégrée : dans **Collection**, ouvrir **Explorer le domicile V1 en 3D**. Rotation souris, tactile, clavier et curseur ; face, dos, côtés, zoom et rotation automatique facultative. Dos bordeaux uni sans sponsor, nom ni numéro. Modèle original approximatif créé localement avec Blender, texture de face dérivée du visuel existant ; aucun fichier officiel n’a été remplacé.

Three.js 0.187.0 (MIT) est chargé uniquement à l’ouverture de la vue 3D, avec le GLB autonome de 942 ko. Le reste du site fonctionne sans WebGL. La réduction des animations et la pause globale désactivent la rotation automatique ; la fermeture libère le rendu et ses ressources. Les trois autres tenues et le blason restent en 2D. Budget des nouvelles ressources et services : 0 €.

Les **29 tests Playwright passent** : les 18 précédents, inchangés, et 11 contrôles pour la géométrie volumétrique, le chargement à la demande, les interactions, les replis, le nettoyage et les formats 320/390/768/1440 px. Compilation validée et vue 3D vérifiée dans le résultat compilé sur le serveur local de prévisualisation.

### Développement

Node.js 22.12+ ou 24 recommandé. Aucun secret, compte externe, base de données ou service payant nécessaire.

```sh
npm ci
npm run dev -- --host 0.0.0.0 --port 4173 --strictPort
```

Utiliser le checkout existant. Aucun worktree supplémentaire nécessaire.

### Vérification

```sh
npm run build
npm test
```

Les tests utilisent Chromium système s’il est disponible dans `/usr/bin/chromium`. Sinon, installer le navigateur de Playwright avec `npx playwright install chromium`, ou fournir `CHROMIUM_PATH`. Les sept tests initiaux restent inchangés. Sept tests supplémentaires vérifient les fiches de l’organigramme et leur hiérarchie, la comparaison au clavier, le défilement réversible sur mobile et ordinateur, la réduction du mouvement et les nouveaux états d’accessibilité.

Le contrôle responsive est effectué par émulation de navigateur, pas sur un iPhone physique. Le test axe ne remplace pas un audit humain complet d’accessibilité.

### Animations

- Entrée progressive du titre « VALORIA FC », de l’écusson central, de la navigation et des textes ; arrière-plan textile bordeaux/or en mouvement continu.
- Flottement de l’image de l’écusson et changement de position / inclinaison lié au défilement ; perspective CSS d’une image 2D, sans modèle 3D.
- Apparitions des sections et des cartes de l’organigramme, pilotées par la position de défilement dans les deux sens.
- Animation des fiches de fonction et de la comparaison des deux domiciles ; transitions entre les quatre tenues conservées.
- Bouton de pause, respect de `prefers-reduced-motion` et arrêt du mouvement d’ambiance hors écran / onglet masqué.
- Web Animations API, IntersectionObserver et CSS : aucune bibliothèque de motion, aucun WebGL requis, aucun défilement détourné.

### Modifier les contenus

- `index.html` : textes, organisation, navigation et formulaire.
- `src/main.js` : initialisation, navigation, descriptions de maillots et formulaire.
- `src/motion.js` : contrôleur de mouvement et apparitions réversibles.
- `src/organisation.js` : fonctions, rattachements, fiches et navigation entre personnes.
- `src/kit-atlas.js` : cadrage fidèle des visuels existants et comparaison des domiciles.
- `src/jersey-entry.js`, `src/jersey-viewer.js`, `src/jersey.css` : ouverture différée, rendu WebGL et interface de la tenue 3D.
- `public/models/domicile-v1.glb` : véritable maillage 3D avec texture embarquée ; aucune API de modèles externe.
- `tools/prepare_jersey_texture.py`, `tools/build_jersey.py` : reproduction locale de la texture dérivée et du modèle Blender.
- `src/style.css` : palette, typographies, mise en page et responsive.
- `public/assets/` : visuels WebP optimisés. `collection.webp` contient uniquement les maillots **sans sponsor**.
- `docs/references.md` : ressources examinées, choix, licences et provenance des visuels.

Les images sont des adaptations générées à partir des références visuelles reçues dans la conversation. Elles ne remplacent pas un master vectoriel de l’écusson. Les mots et dates présents sur les anciens visuels ne constituent pas des faits sportifs officiels.

### Contact et périmètre

Aucune adresse de contact n’a été fournie. Le formulaire prépare un fichier texte local ; il n’envoie aucun message, ne stocke rien et ne transmet aucune donnée. Le site l’indique avant la saisie et après le téléchargement.

Pas de paiement, réservation, sponsor signé, palmarès, joueur recruté ou calendrier inventé. Les fonctions d’entraîneur et de joueurs restent à définir.

### Vercel — préparation uniquement

Vercel est l’hébergeur choisi. Le fichier `vercel.json` configure Vite, la compilation `npm run build`, le dossier `dist` et les en-têtes de sécurité. Les fichiers statiques restent compatibles avec tout serveur HTTP ; les animations ne dépendent pas de l’hébergeur. Le dépôt ne contient aucune clé de déploiement.

La procédure d’import GitHub, de prévisualisation et de retour arrière est décrite dans [docs/vercel-deploy.md](docs/vercel-deploy.md). Les changements de la branche `feat/valoria-v1` sont encore locaux : ils doivent être enregistrés et poussés sur GitHub avant qu’un import Vercel puisse les récupérer. Aucun commit, push ou déploiement n’a été effectué automatiquement.

Pour vérifier localement le résultat de production : `npm run build`, puis `npm run preview -- --port 4174 --strictPort`.

Avant publication : fournir les coordonnées et mentions légales adaptées au responsable réel de la publication ; valider les visuels et leurs droits d’utilisation. Aucun déploiement n’a été effectué dans cette tâche.

Retour arrière : conserver le déploiement Vercel précédent et utiliser les actions de restauration proposées par Vercel si nécessaire. Le développement est isolé dans la branche `feat/valoria-v1` ; aucune modification de `main`, aucun push automatique.
