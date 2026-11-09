# VALORIA FC — audit et premier prototype de direction

## Synchronisation : constat précis

Production annoncée par l’utilisateur : Vercel `valoria-fc`, équipe ROY TEAM, Hobby, **READY**, source `main`, commit `dcd465b20906850f05b22e322176fdf683030310`.

| Référence | Commit vérifié | Différence utile |
| --- | --- | --- |
| `main` distant et désormais local | `dcd465b` | Compilation Vercel avec `npm run build -- --base=/`. |
| `feat/github-pages` | `0eddbf1` | Entièrement incluse dans `main`. |
| `feat/valoria-v1` | `00452c9` | Entièrement incluse dans `main`. |
| Prototype local | branche `prototype/direction-hero` | Fichiers isolés dans `prototypes/hero-cinematique/`, non intégrés au site. |

**Aucune amélioration d’interface committée n’est restée bloquée dans ces deux branches.** `src/`, `public/` et `index.html` sont identiques entre `feat/valoria-v1` et le commit de production confirmé. L’unique retard local était le correctif Vercel de base URL ; il a été repris par avance rapide vérifiée. Aucune fusion de contenus concurrents, aucun écrasement, aucun push.

L’audit visuel porte sur une **prévisualisation locale de ce même code**, capturée dans cette session. La production et Laocoön ont été tentés en HTTPS et dans Chromium : accès bloqué par le proxy, HTTP 403 / `ERR_TUNNEL_CONNECTION_FAILED`. Il n’y a pas d’audit visuel direct de Vercel ou de la référence. Le SHA et l’état READY de production sont des informations fournies par l’utilisateur, cohérentes avec le dépôt distant.

## Parcours capturé et écarts

1. **Arrivée sur le hero — fonctionnelle, ambition visuelle insuffisante.** Captures `01-actuel-hero-1440.jpg` et `01-actuel-hero-390.jpg`. Palette, blason et titre présents ; composition verticale avec slogan, texte et CTA successifs. Le blason est une image et les reflets sont imprimés dans le visuel. Le code de mouvement apporte flottement et perspective limités, sans passage de scène autour d’un objet commun.
2. **Collection — lisible, présentation incomplète par rapport au nouvel objectif.** Captures `02-actuel-collection-*`. Quatre faces disponibles ; le code charge un GLB pour le V1 uniquement. Les trois autres tenues sont correctement identifiées comme images 2D. Il manque les paires face/dos et leur geste commun, désormais demandés pour les quatre tenues. Le V1 affiché utilise encore un dos uniforme ; les études plus souples sont archivées, pas servies par le site.
3. **Organisation — fonctionnelle, à conserver.** Captures `03-actuel-organisation-*`. La hiérarchie et les sept rôles sont présents. L’environnement du contenu reprend le même rythme titre descriptif / texte / blocs que les autres chapitres. L’amélioration proposée concerne le passage visuel vers ce contenu et la réduction des textes redondants, pas l’invention de nouveaux rôles ou une suppression des interactions.

Les captures mobiles de collection/organisation montrent une position intermédiaire de lecture : le haut du chapitre peut passer sous l’en-tête fixe. Ce seul cadrage ne prouve pas un défaut d’ancre. Les vérifications clavier, contraste et mouvement sont complémentaires aux captures ; aucune conformité WCAG complète n’est affirmée.

## Direction proposée : Écrin bordeaux

Références visuelles concrètes : **l’écusson existant** (`crest.webp`), **le textile bordeaux/or existant** (`hero-burgundy.webp`) et **la collection validée** (`collection.webp`). La typographie Cormorant Garamond / Manrope est déjà locale et sous licence libre. Aucun actif propriétaire de Laocoön, aucune nouvelle image générée, aucune police achetée.

Le langage cinématographique retenu vient du brief Bronze and Time reçu, pas d’animations externes prétendument observées : un sujet central, des plans séparés, une lumière directionnelle sobre, un changement de cadrage lié au défilement et des transitions entre chapitres. Noir profond et crème dominent, bordeaux pour l’atmosphère, or pour les lignes et accents. Violet limité au third.

Le prototype conserve une scène continue : titre monumental et blason central ; au scroll, le titre recule, le blason se déplace et le texte d’identité apparaît. Le même décor conduit au début de collection. Pas de séquence de cartes qui répètent la même apparition. Navigation fine, pause native, gestes verticaux conservés ; mouvement réduit montrant directement une composition stable.

**Limite assumée du prototype :** le blason est toujours une image 2D. Sa perspective et son éclairage d’ambiance ne sont pas un modèle volumétrique ou un matériau métallique physique. Un blason 3D fidèle resterait une fabrication originale distincte à valider ; aucun maître SVG ou GLB du blason n’existe actuellement.

## Collection : choix 2D confirmé

L’utilisateur a précisé **quatre présentations 2D face/dos**, ce qui remplace le besoin initial de fabriquer quatre modèles 3D. Les GLB et projets Blender existants sont conservés ; trois nouveaux GLB n’apporteraient rien à ce choix.

Méthode : préparer quatre paires de vues originales, aux mêmes cadrage et échelle, sans repeindre les motifs ou les couleurs. Les faces peuvent être extraites non destructivement de l’atlas validé. Les **quatre PNG de dos ne sont pas disponibles comme fichiers exploitables** dans le dépôt ou les pièces jointes accessibles ; leur aperçu dans l’historique ne constitue pas un fichier reçu. Leur intégration attend ces fichiers.

Une seule zone de présentation affiche une tenue. Le geste horizontal permet de passer de sa face à son dos par une transition 2D courte, avec un état lisible « Face » / « Dos ». Aucun profil inventé ni rotation volumétrique à 360° annoncée. Navigation clavier équivalente et annonce du changement de vue ; défilement tactile vertical conservé. Charger uniquement les vues utiles et garder la face visible pendant le décodage du dos.

L’orientation restera cohérente sur la même épaule physique, conformément au choix antérieur. Les détails de col, de manches et de dos seront vérifiés sur les références réelles, sans transformer un rendu trois quarts en nouveau profil inventé.

## Plan de correction après validation

1. Valider la composition desktop/mobile et le mouvement du hero présentés ici.
2. Intégrer la scène dans le site, puis construire les liaisons identité → collection → organisation autour des mêmes lumière, typographie et rythme. Préserver les fonctions de l’organigramme et du contact ; ne pas réécrire les contenus sportifs.
3. Intégrer les quatre paires face/dos après réception et contrôle des fichiers. Garder les anciennes ressources et modèles en archive ; aucune fabrication 3D de maillot n’est nécessaire pour ce choix.
4. Préparer une PR fondée sur `origin/main` en conservant l’override Vercel `--base=/`. Tests et revue visuelle avant intégration. **Ne pas pousser un prototype non validé sur `main` : Vercel publierait automatiquement.** Aucun jeton Vercel n’est nécessaire pour ces modifications de code ou une PR.

## Livrables et vérifications

Prototype : `prototypes/hero-cinematique/`. Captures et rapports de cette session : `artifacts/art-direction-audit/`. Le fichier `branches-assets.md` donne l’inventaire détaillé ; `branch-asset-audit.json` contient les hashes et métriques des GLB.

Les captures du prototype et sa vidéo sont des rendus du vrai HTML/CSS/JS compilé localement. Tests de scroll réversible, pause, préférence de mouvement, focus clavier, absence de débordement à 320/390/768/1440 px et contrôles axe automatisés effectués. Ils ne remplacent pas une validation sur iPhone physique ou un audit complet d’accessibilité.

Le site existant compile et ses **29 tests passent**. La compilation séparée du hero ne change pas l’entrée du site, ses assets ou son workflow. Aucun achat, service payant, ajout de dépendance, push ou déploiement. **Coût supplémentaire : 0 €.**
