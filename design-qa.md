# Contrôle visuel et fonctionnel — phase 3 VALORIA FC

## Référence et comparaison

Source de vérité : brief de phase 3 et budget 0 €, état de phase 2 et visuels officiels déjà présents. Le texte technique détaillé « Bronze and Time » est étudié comme référence de progression ; aucun audit visuel du site distant n’est revendiqué et aucun actif Laocoön n’est utilisé.

Références avant : `artifacts/phase-3/before-desktop-full.png` (1440 px de large) et `before-mobile-full.png` (390 × 5908 pixels). Implémentation finale : `final-desktop-full.png` (1440 × 4752 pixels) et `final-mobile-full.png` (390 × 5289 pixels). Viewports CSS 1440 × 1000 et 390 × 844, densité 1, route principale et mouvement réduit. Les images pleine page sont plus hautes que le viewport ; pas de confusion avec une capture à densité différente.

Comparaison assemblée consultée : `vue-ensemble-avant-apres.jpg`, deux colonnes réduites à 420 px. Captures de section par rectangles DOM : introduction, identité, collection, organisation, engagements, contact et footer, chacune en versions desktop et mobile. Contrôles focalisés consultés : `organisation-mobile.jpg`, `comparaison-mobile.jpg`, `identite-mobile.jpg` et `fiche-mobile.jpg` ; vues originales et page entière consultées pour la hiérarchie globale. Les formes du blason et des maillots proviennent des mêmes fichiers qu’avant.

## Résultats des cinq surfaces

- **Typographies :** familles locales conservées et centralisées. Titre monumental par mots avec nom accessible complet ; texte clair sur fond sombre, hiérarchie stable, aucune coupure constatée aux quatre largeurs. Le blason occupe une place plus dominante sans modification du logo.
- **Espacements et composition :** disparition des panneaux beige alternés. Espacements de chapitre communs ; navigation persistante, progression et chapitre courant. L’arbre mobile mesure environ 559 px au lieu d’une longue série de grandes cartes ; toutes les personnes restent accessibles. La page mobile passe de 5908 à 5289 px sans supprimer le contenu officiel. Les marges vides de l’atlas sont resserrées.
- **Couleurs et tokens :** noir/bordeaux continus, crème pour le texte, or pour accents/bordures/focus. Même style de cartes, boutons, formulaires et footer. Violet uniquement associé au troisième maillot. Axe passe sur les états déjà testés et aucune séparation claire/sombre brutale ne subsiste dans les captures finales.
- **Images :** aucun nouvel actif ou génération. Cadrage CSS de l’atlas sans déformation ; rapports naturels des images vérifiés dans les tests aux quatre largeurs. Aucune promesse de modèle 3D ou de reflets calculés : le blason est une image avec inclinaison CSS.
- **Contenus :** fonctions et rattachements conservés dans le module organisation, inchangé. Quatre maillots sans sponsor, aucune donnée sportive ou commerciale ajoutée. Formulaire local et navigation entre fiches toujours fonctionnels.

## Corrections et historique

La première revue globale a confirmé la continuité sombre et le gain de place, mais a montré une flèche noire devenue peu lisible sur le fond sombre du lien de présentation. La règle d’icône a été adaptée au nouveau fond. Les captures focalisées finales et les tests après correction sont conformes ; aucun P0/P1/P2 restant identifié. Les contrôles antérieurs sont archivés dans `docs/qa-phase-2.md`.

## Validation

Compilation finale réussie. 18 tests Playwright réussis : les 14 précédents sont inchangés et quatre parcours nouveaux couvrent 320/390/768/1440 px, navigation fixe, chapitre courant, ancre non masquée, arbre mobile compact, conservation des proportions des maillots et absence de requête HTTP vers une origine externe dans ces parcours. Sortie brute : `artifacts/phase-3/test-results.txt`.

Les vérifications de phase 2 couvrent le scroll en descente et remontée sur mobile et ordinateur, les préférences, le clavier, les fiches et la comparaison. Les images et la vidéo ont été capturées depuis le résultat compilé servi localement, sans exception JavaScript observée. Aucun déploiement ni nouvelle dépendance.

## Prévisualisation et limites

Le relais partagé est indisponible. Le ZIP n’est pas une application exécutable dans le lecteur de fichiers. La tentative additionnelle de fichier HTML autonome a rencontré `ERR_BLOCKED_BY_ADMINISTRATOR` sur le schéma file:// ; aucune restriction n’a été contournée et cette variante n’est pas livrée comme aperçu vérifié. Le serveur Vite et Chromium local sont vérifiés ; instructions PC dans PREVISUALISATION.md.

Pas de test Safari/iPhone physique, pas de nouvelle ressource 3D ni d’exports de maillots séparés. Pas de garantie universelle de fréquence d’images ou de gratuité d’offres futures d’hébergement ; aucune offre activée ici. Les licences des ressources existantes et les limites de vérification des coûts figurent dans docs/budget-zero.md.

## Checklist

- [x] Budget et conservation inscrits dans AGENTS.md.
- [x] Design sombre continu et mobile repensé, captures inspectées.
- [x] Comparaison et fiches préservées, aucune image officielle changée.
- [x] Navigation, progressions et préférences vérifiées.
- [x] Compilation et 18 tests réussis ; 14 tests précédents inchangés.
- [x] Prévisualisation locale documentée, aucune URL partagée inventée.
- [x] Aucun achat, abonnement, nouvel outil de génération ou déploiement.

final result: passed
