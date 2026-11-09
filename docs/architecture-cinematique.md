# Analyse — Bronze and Time × VALORIA FC

Analyse du dépôt existant, avant intégration de la nouvelle direction. La référence en ligne reste inaccessible ; les propositions suivantes viennent du cahier des charges reçu et du code inspecté, pas d’une observation de Laocoön.

## Décisions confirmées

- Hébergement : Vercel, déjà configuré dans `vercel.json` ; aucun déploiement réalisé.
- Palette demandée : noir profond, bordeaux, or métallique et crème. Le violet est réservé au troisième maillot.
- Écusson : bouclier et deux ailes dorées formant un V, légèrement croisées à leur base.
- Quatre maillots **sans sponsor**. La confirmation explicite de l’utilisateur remplace la mention « Victoria » dans le prompt technique.
- Conserver le contenu officiel du projet et les rôles existants ; ne pas inventer de faits sportifs.

## État constaté

Le dépôt contient un site Vite en HTML, CSS et JavaScript, des polices locales, des icônes Phosphor et sept tests Playwright. Il ne contient ni React/Next.js, ni moteur WebGL, ni service serveur.

Le hero actuel (`index.html`, `src/style.css`) place le blason sur le côté d’un titre « La force du collectif » et utilise une palette principalement violette. Les mouvements de `src/main.js` sont des transformations d’images et des apparitions déclenchées dans les sections. Ils ne constituent pas une narration continue à plusieurs scènes.

La collection utilise une image contenant les quatre tenues, cadrée selon l’onglet choisi. La comparaison simultanée des deux domiciles n’existe pas. Les ressources de `public/assets` sont des images raster ; il n’y a ni SVG maître ni modèle GLB du blason ou des maillots.

## Architecture recommandée

Conserver Vite et le HTML sémantique : les besoins actuels ne nécessitent pas de serveur, CMS ou routes dynamiques justifiant Next.js. Vercel sait déjà héberger cette compilation statique.

Séparer le JavaScript en petits modules :

| Module prévu | Responsabilité |
| --- | --- |
| `motion-controller` | État commun : pause, réduction du mouvement, visibilité, nettoyage des animations. |
| `scroll-story` | Progression locale de chaque scène, lecture du défilement puis écritures groupées dans une seule frame. |
| `hero-scene` | Apparition de « VALORIA FC », navigation et révélation du blason central. |
| `crest-scene` | Perspective et éclairage ; image légère de repli, puis éventuel rendu Three.js chargé à la demande. |
| `kit-gallery` | Présentation des quatre tenues indépendantes, navigation accessible et transitions. |
| `home-kit-comparison` | Vue côte à côte V1/V2, labels persistants, disposition adaptée au mobile. |
| `navigation` / `contact` | Préserver les dialogues natifs et le brouillon local déjà fonctionnels. |

Utiliser d’abord les API natives pour les transformations et les fondus. Évaluer GSAP seulement si l’orchestration observée exige une timeline qui devient difficile à maintenir ; vérifier sa licence avant ajout. Three.js est pertinent pour de véritables reflets et une rotation volumétrique, sous réserve d’un modèle original validé. React Three Fiber et une migration React ne sont pas nécessaires pour une seule scène.

## Mise en scène proposée — à confronter à la référence

1. **Révélation :** arrivée dans une scène sombre, blason central et titre monumental « VALORIA FC ». Entrée des éléments en séquence, sans écran d’attente bloquant.
2. **Perspective :** rotation limitée et changement de cadrage liés au défilement, réversibles lorsque l’utilisateur remonte. Les reflets dynamiques réels nécessitent des matériaux et une géométrie 3D.
3. **Identité :** transition vers le contenu du club ; garder le texte comme HTML lisible et sélectionnable.
4. **Collection :** révélation successive des tenues, puis comparaison explicite des deux propositions domicile. Ne pas reconstruire leurs détails ou rajouter de sponsor.
5. **Organisation :** retour à une présentation stable des rôles et des responsabilités.

Conserver le défilement natif et les longueurs naturelles des contenus. Pas de longue section vide destinée seulement à ralentir la lecture. Sur mobile : moins de rotations et de particules, composition verticale et contrôles tactiles. Le mode de mouvement réduit montre directement les contenus.

## Ressources à préparer avant intégration

- **Accès à Laocoön :** les domaines `getlayers.ai` et `www.getlayers.ai` sont enregistrés dans le brouillon réseau, mais ne sont pas encore autorisés dans la politique active. Captures et observations réelles restent nécessaires pour analyser cette référence.
- **Blason 3D si retenu :** produire ou obtenir un GLB/GLTF fidèle, avec bouclier et deux ailes distincts, matériaux métalliques, textures optimisées et éclairage original ou autorisé. L’image générée actuelle n’est pas un modèle prêt à utiliser. Cette production et sa validation sont une étape distincte.
- **Maillots :** préparer quatre exports séparés, idéalement détourés et de bonne définition, sans « Victoria », en conservant cols, finitions et motifs validés. L’atlas actuel peut servir de référence, mais limite les mouvements indépendants.
- **Visuel du hero :** adapter ou remplacer le textile violet actuel pour correspondre à la palette noir/bordeaux/or. Ne récupérer aucun actif propriétaire de Laocoön.

## Validation prévue

Préserver les sept contrôles existants et ajouter les comportements nouveaux : progression et retour arrière des scènes, comparaison V1/V2 au clavier, repli sans WebGL, perte du contexte graphique, pause et préférences système. Comparer les captures desktop/mobile et mesurer le poids des ressources avant d’activer la 3D. Limiter la densité de pixels et suspendre le rendu hors écran.

## Ordre d’exécution

1. Débloquer et observer la référence ; compléter les observations.
2. Préparer et valider les ressources manquantes.
3. Recomposer le hero et la palette ; découper le contrôleur de mouvement.
4. Ajouter la narration au défilement, la collection immersive et la comparaison.
5. Intégrer éventuellement la vraie 3D avec son repli ; vérifier performance et accessibilité.
6. Préparer une prévisualisation Vercel après vérification ; ne pas annoncer de lien avant un déploiement effectif.

État actualisé : analyse du dépôt terminée ; analyse visuelle externe bloquée. La [première phase](phase-1.md) est intégrée : palette, hero central et entrée 2D. La [phase 2](phase-2.md) ajoute maintenant une progression native réversible, la comparaison de l’atlas existant et l’organigramme interactif. La véritable 3D, les ressources de maillot indépendantes et toute reproduction observée de Laocoön restent hors périmètre.
