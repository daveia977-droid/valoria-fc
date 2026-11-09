# VALORIA FC — prototype Motion, phases A et B

Prototype local isolé : révélation du club → identité, dans une seule scène HTML/CSS/JavaScript. Aucune intégration au site principal, aucun push ni déploiement. Le code précédent est conservé dans le commit local `21c180d` ; sauvegarde supplémentaire : `/workspace/valoria-sauvegardes/motion-20261109/` (bundle Git, archive du prototype, patch).

## A — Correspondance avec les six visuels joints

| Visuel, dans l’ordre du message | Correspondance et ressources | Mouvement et adaptation |
| --- | --- | --- |
| 1. Planche générale, stade, collection et organisation | Référence de hiérarchie générale. Les images de maillots numérotés et les rôles illustratifs ne sont pas des contenus officiels. | Collection et organisation réservées à la phase C ; aucune modification à cette étape. |
| 2. Planche « Concept site officiel », cadrages 01, 02 et 04 | Référence principale pour ce prototype : titre **au-dessus** du blason, puis texte à gauche / blason à droite. `public/assets/crest.webp`, `hero-burgundy.webp`, polices locales Cormorant Garamond / Manrope. | Entrée mesurée, recadrage continu au scroll. Mobile : texte d’identité en haut, blason réduit plus bas à droite. |
| 3. Grand hero « Écrin bordeaux » | Référence de matière, lumière, navigation et respiration. | Le chevauchement titre/blason illustré est corrigé conformément à la consigne explicite de lisibilité. |
| 4. Triptyque « Révélation / Même scène / Composition mobile » | Relation entre les deux cadrages, mêmes assets et même décor. | Le fond reste présent, le titre se retire, le texte apparaît et le blason se déplace ; remontée symétrique. |
| 5. Grand hero répété | Même référence que le visuel 3. | Aucun chapitre ni effet supplémentaire. |
| 6. Cadrage mobile seul | Référence des marges, du titre lisible, du blason, de la légende et du repère de scroll. | Composition verticale et contrôle tactile de 44 px ; tailles adaptées aux petits écrans et au paysage. |

**Incohérences arbitrées avant intégration :** les consignes écrites priment sur les chevauchements des anciennes images, les numéros/sponsors et les départements fictifs des planches. Les sept personnes du dépôt font autorité. Le fond de stade et les drapeaux de la première planche ne sont pas des ressources originales disponibles dans le dépôt ; ils ne sont pas intégrés. La planche 2 et les variantes « Écrin bordeaux » suffisent pour cette phase. Les dos authentiques restent à fournir/valider avant toute future galerie face/dos ; ils ne bloquent pas le hero. Aucun maillot n’est fabriqué ou régénéré.

## B — Mouvements réellement implémentés

- Une entrée unique : titre en fondu + déplacement de 14 px ; blason en fondu + déplacement de 18 px et échelle 0,96 → 1. Les transformations d’entrée et de scroll sont séparées.
- Scroll natif sur 1,8 écran desktop / 1,75 écran mobile au total, dont un écran visible. Aucun verrouillage, inertie ajoutée ou interception de la molette.
- Le même blason passe du centre à droite. Le titre s’efface et remonte ; « La force du collectif » apparaît à gauche. Sur téléphone, le blason descend et rétrécit pour dégager le texte.
- Mouvement lent du textile existant et de deux couches de lumière CSS. Perspective limitée à 7° sur l’image du blason : **2,5D**, sans modèle ni WebGL.
- Un seul `requestAnimationFrame` demandé à chaque événement utile. Pas de boucle permanente. L’entrée cesse si l’utilisateur commence à défiler.
- Préférence de mouvement réduit, pause ou absence de JavaScript : deux chapitres statiques dans l’ordre de lecture. Aucun texte d’identité supprimé. Liens, focus et scroll restent utilisables.

Les liens Collection et Organisation pointent vers les sections déjà existantes de la production. Ce prototype ne reconstruit pas ces sections et n’altère pas la production.

## Lancer localement

Depuis la racine du dépôt, avec les dépendances existantes :

```sh
npm ci
npm run dev -- --host 0.0.0.0 --port 4173 --strictPort
```

Ouvrir, sur la machine du serveur : `http://localhost:4173/prototypes/hero-cinematique/`.

Pour vérifier le prototype compilé indépendamment du site principal :

```sh
npx vite build --config prototypes/hero-cinematique/vite.config.js
npx vite preview --config prototypes/hero-cinematique/vite.config.js --host 0.0.0.0 --port 4186 --strictPort
```

Ouvrir `http://localhost:4186/`, puis, dans un autre terminal :

```sh
node prototypes/hero-cinematique/verify.mjs
```

Ces adresses sont locales, pas des URL publiques. Sur un iPhone connecté au même réseau qu’un PC exécutant Vite, remplacer `localhost` par l’adresse IP locale du PC. Le serveur de cet environnement distant n’est pas automatiquement accessible depuis le réseau de l’iPhone.

## Vérification et limites

Captures, rapports et séquences de scroll : `artifacts/motion-prototype/`. Les tests vérifient cinq formats, les positions intermédiaires, le scroll inverse, un geste tactile Chromium, le clavier, la pause, le mouvement réduit, les ressources et axe. La comparaison aux maquettes est visuelle ; aucun fichier source de maquette exploitable pour une différence pixel à pixel n’est monté dans cet environnement. Les polices exactes des images ne sont pas identifiées ; les deux familles libres déjà présentes sont conservées.

Aucun appareil iPhone physique n’est connecté : l’émulation mobile ne constitue pas une validation Safari/iOS réelle et ne garantit pas une fréquence d’images sur tous les appareils.

Budget supplémentaire : **0 €**. Aucune dépendance ajoutée, aucune génération d’images, achat ou activation de service. Fontes existantes sous SIL OFL et icônes Phosphor sous MIT, déjà documentées dans le dépôt. Attendre la validation visuelle avant les phases C et D.

## Résultats de cette livraison

- Compilation du site et du prototype : réussies ; 29 tests existants réussis.
- Prototype validé sur les cinq formats ci-dessus : aucune ressource manquante, erreur JavaScript ou requête externe ; six contrôles axe sans violation détectée. Pause : décalage du titre inférieur à 0,5 px.
- Planches : `desktop-deux-cadrages.png`, `mobile-deux-cadrages.png`, `comparaison-avant-apres.png` dans `artifacts/motion-prototype/`.
- Démonstrations : `scroll-mobile.mp4` et `scroll-desktop.mp4`, huit secondes chacune, 96 captures réelles encodées à 12 images/s. Elles montrent le comportement, pas une mesure des performances.
- Rapport visuel et limites : `design-qa.md` à la racine ; résultats détaillés : `artifacts/motion-prototype/prototype-verification.json`.
