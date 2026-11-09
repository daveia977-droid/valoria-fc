# Phase 3 — identité continue, mobile et budget 0 €

## Règle de décision

Le cahier des charges artistique et le prompt technique détaillé ont été lus. La contrainte de budget 0 € prime sur leurs autres suggestions. Elle est inscrite dans `AGENTS.md` pour les prochaines phases ; licences et périmètre financier sont consignés dans [budget-zero.md](budget-zero.md).

Aucun abonnement, achat, essai avec renouvellement, modèle, police, image ou outil de génération n’a été ajouté ou activé. Aucun nouveau service facturé à l’utilisation. Les comptes et frais historiques de plateforme ne sont pas accessibles ici ; le bilan ne certifie pas leur gratuité passée.

## Refonte implémentée

### Un système commun

Le fond noir/bordeaux est partagé entre les chapitres. Les grands panneaux crème de la présentation, de l’organisation et du contact sont retirés. Des variations discrètes de bordeaux et la fin atténuée du visuel du hero assurent une continuité sans changement brutal de thème.

Les variables globales définissent les surfaces, les contrastes, les bordures or, les deux familles typographiques locales, les espacements de chapitre, les rayons et la hauteur de navigation. Boutons, liens, fiches, séparateurs, formulaires et footer suivent la même palette. Le crème sert au texte ; le violet demeure associé uniquement au troisième maillot.

Le blason existant occupe davantage de place, sans modification du fichier. « VALORIA FC » apparaît par groupes de mots, avec un nom accessible stable pour les lecteurs d’écran. La navigation reste disponible pendant la lecture ; le chapitre courant est signalé et une ligne or suit la progression réelle de la page.

### Défilement et référence technique

| Principe du texte « Bronze and Time » | Adaptation VALORIA FC |
| --- | --- |
| Progression normalisée du scroll | Ligne de lecture, chapitre courant et progression locale des scènes existantes. |
| Révélations typographiques | Opacité et translation des mots, sans découpage lettre par lettre ou flou coûteux sur mobile. |
| Sensation de profondeur | Inclinaison légère de l’image du blason et variation du fond ; pas de modèle 3D revendiqué. |
| Ambiance continue | Même fond noir/bordeaux/or entre identité, collection, organisation et contact. |

Les réglages imposés de 900 vh, le cheval, le shader et les actifs propriétaires, les textes Laocoön, la palette saphir, le curseur caché, les barres de défilement masquées et l’interdiction de sélectionner du texte ne sont pas repris. Aucun import CDN ou téléchargement de modèle. Le site en ligne n’a pas été observé : cette adaptation repose sur le texte fourni et le dépôt, pas sur un audit visuel externe prétendument réalisé.

Le scroll reste natif. Les poses restent réversibles et la réduction du mouvement reste prioritaire ; les animations d’ambiance s’arrêtent hors écran. L’indicateur de lecture et le chapitre continuent de fonctionner lorsque les animations décoratives sont en pause.

### Collection

Les quatre maillots sans sponsor et la comparaison des domiciles sont conservés. Le cadrage de l’atlas enlève des marges vides en haut et en bas, en conservant les proportions des modèles. La hauteur des zones de présentation est réduite ; aucun détail du vêtement n’est reconstruit et aucun fichier image officiel n’est modifié.

### Organisation mobile

Les sept membres et tous leurs rattachements restent identiques. Les cartes deviennent des lignes compactes avec nom et fonction, indentation plus fine et même style sombre que les autres composants. Les fiches détaillées restent disponibles par toucher et clavier.

À 390 px, l’arbre mesure environ **559 px**. Sur la capture de référence à 390 × 844, la page entière passe de 5908 à 5289 px sans suppression des contenus officiels. Le gain vient des cadrages, des espaces et des cartes, pas d’une réduction du texte en caractères minuscules.

## Fichiers modifiés

- `AGENTS.md` — nouveau : règles permanentes budget, conservation et validation.
- `index.html` : titre accessible en deux groupes de mots et progression de lecture.
- `src/style.css` : système de surfaces, typographies et espacements ; continuité sombre ; navigation fixe ; organigramme compact ; cadrages ; états de liens et de focus.
- `src/motion.js` : entrée des mots, suivi de chapitre et progression de lecture ; mouvement du blason adapté sans chevaucher les textes.
- `src/kit-atlas.js` : cadrage des marges vides, avec proportions conservées.
- `tests/phase-3.spec.js` — nouveau : quatre parcours aux largeurs demandées.
- `README.md`, `PREVISUALISATION.md`, `docs/budget-zero.md`, `docs/phase-3.md`, `design-qa.md` : documentation et vérifications.

`src/organisation.js`, les 14 tests précédents, `package.json`, le verrou npm et `vercel.json` ne sont pas modifiés. Les images et notices existantes sont conservées.

## Validation

- `npm run build` : réussite. JavaScript applicatif compilé : environ 13 Ko / 5,1 Ko gzip. Aucune nouvelle image ou police à charger.
- `npm test` : **18 tests exécutés, 18 réussis, aucun désactivé**, en 21,8 secondes pour l’exécution finale. Résultat brut : `artifacts/phase-3/test-results.txt`.
- Les 14 tests existants sont inchangés. Quatre nouveaux tests vérifient 320/390/768/1440 px, navigation persistante, ancres non masquées, chapitre courant, arbre mobile compact, proportions des maillots, absence de débordement, fiches et absence de requête HTTP vers une origine externe dans le parcours testé.
- Les tests existants couvrent aussi l’organigramme au clavier, le scroll dans les deux sens, les préférences, le contact et axe sur les différents états.
- Captures et vidéo issues du résultat compilé servi localement. Aucun hébergement distant n’a été activé.

## Captures et démonstration

Dans `artifacts/phase-3/`, les fichiers JPG suivants sont disponibles chacun en suffixe `-desktop` et `-mobile` :

`introduction`, `identite`, `collection`, `organisation`, `engagements`, `contact`, `footer`, `comparaison` et `fiche`.

`vue-ensemble-avant-apres.jpg` montre la continuité globale. `scroll-valoria.mp4` enregistre l’introduction, la progression sur toute la page et une remontée, avec les animations actives. Les images fixes utilisent le mouvement réduit pour être reproductibles. Les captures de section sont extraites de captures réelles pleine page aux rectangles DOM correspondants.

## Aperçu : diagnostic et solution vérifiée

« Archive previews aren't supported yet » concerne la tentative de prévisualisation d’un ZIP, pas une exception du site. `sites-preview status` confirme que le relais partagé est indisponible. Aucun lien d’aperçu externe n’est annoncé.

Un essai de fichier HTML autonome a aussi été abandonné comme solution livrée : la navigation `file://` est bloquée par la politique du Chromium géré (`ERR_BLOCKED_BY_ADMINISTRATOR`). Cette restriction n’a pas été contournée. Le résultat validé reste l’application Vite et son serveur local, accompagnés du [guide PC](../PREVISUALISATION.md).

Le ZIP `valoria-phase3-source.zip` contient le code à extraire, pas un site déjà hébergé. Après extraction, ouvrir un terminal dans le dossier contenant package.json ; sous Windows :

```powershell
npm.cmd ci
npm.cmd run dev -- --host 127.0.0.1 --port 4173 --strictPort
```

Ouvrir dans son navigateur l’adresse **Local:** affichée par Vite. Aucun compte ni carte bancaire nécessaire pour les dépendances applicatives. Voir le guide pour les prérequis et les autres systèmes.

## Limites

Pas de vraie 3D, pas de maillots séparés haute définition et pas de licence acquise sur les actifs de Laocoön. Ces ressources ne sont pas nécessaires au résultat actuel. Si une scène 3D est demandée plus tard, privilégier une création originale avec un outil gratuit et sa validation, plutôt qu’un achat implicite.

Pas de test Safari ou iPhone physique ; le mobile est vérifié dans Chromium aux dimensions demandées. Pas de garantie chiffrée de performance sur tous les téléphones. Les conditions d’un hébergement gratuit futur restent à vérifier avant toute utilisation : aucun achat de domaine ou palier payant n’est envisagé.

La phase s’arrête après présentation et attend la validation visuelle de l’utilisateur. Aucun déploiement, aucune commande de déploiement et aucune demande de secret pendant cette phase.
