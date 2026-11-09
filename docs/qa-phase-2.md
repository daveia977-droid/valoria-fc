# Contrôle de conception — phase 2 VALORIA FC

## Source et preuves comparées

Source de vérité : site de phase 1 et brief explicite de phase 2, avec organigramme aux sept noms et rattachements fournis. Aucun audit de Laocoön n’est revendiqué.

Sources capturées au début : `artifacts/phase-2/before-desktop.png`, `before-mobile.png`, `before-org-desktop.png`, `before-org-mobile.png`. Implémentation : `hero-desktop.jpg`, `hero-mobile.jpg`, `organisation-desktop.jpg`, `organisation-mobile.jpg`, `fiche-desktop.jpg`, `fiche-mobile.jpg`, `comparison-desktop.jpg` et `comparison-mobile.jpg` dans le même dossier. Les vues et recadrages originaux PNG restent disponibles.

Viewports : desktop 1440 × 1000 CSS et mobile 390 × 844 CSS, densité 1, pixels de capture égaux aux pixels CSS. État : mouvement réduit, route principale, puis comparaison ouverte et fiche Charel ouverte. Les sections longues sont extraites de captures pleine page avec les rectangles DOM ; pas de capture acceptée avec le lien fixe parasite apparu lors d’une première capture d’élément Chromium. Ce lien est bien hors écran dans le navigateur normal.

Comparaison assemblée avant/après consultée : `org-before-after.jpg`, chaque colonne redimensionnée à 720 pixels de large. Les proportions différentes sont attendues : la hiérarchie est désormais représentée en arbre plutôt qu’en trois colonnes de fiches statiques. Les captures originales de l’arbre et des fiches ont été inspectées en complément pour les détails lisibles. Les deux maillots ont été inspectés côte à côte aux deux viewports.

## Constatations visuelles

- **Typographies :** Manrope et Cormorant Garamond locales préservées. Noms bien identifiés, rôle distinct, boutons et textes complets dans les fiches. Les noms longs et descriptions restent dans le cadre mobile ; aucun titre tronqué observé.
- **Espacements et structure :** chaîne Yvan → Messi centrée, puis trois branches Charel/Mamady/Émilie et rattachements Marco/Dylan. Mobile en arbre vertical indenté. Pas de débordement horizontal, y compris après ouverture de la comparaison à 320 pixels. Le trait parasite avant la racine mobile a été supprimé ; la capture finale montre Yvan sans parent ajouté.
- **Couleurs :** noir/bordeaux/or/crème conservés, sélection bordeaux et chemin hiérarchique souligné. Violet réservé au troisième maillot. Axe ne détecte pas de violation WCAG A/AA sur la page, la comparaison et les dialogues contrôlés.
- **Images :** écusson et maillots inchangés. Comparaison par cadrage de l’atlas, sans génération, sponsor ou détail inventé. Les deux images restent bien distinguées, aux mêmes niveaux de présentation. Aucun modèle 3D ni illustration de personne ajouté.
- **Contenus :** sept personnes exactes et relations directes testées. Fonctions, responsable et collaborateurs sont accessibles dans les fiches ; les absences se réfèrent explicitement à l’organigramme fourni. Les textes de club, les engagements et le formulaire existant sont préservés.

## Mouvement et interactions vérifiés

Entrée conservée. Le blason change de position et d’inclinaison avec le défilement ; il reste une image 2D avec perspective CSS. Les textes et cartes utilisent une progression réversible. Le calcul retire leur translation animée de la position de référence, afin que descendre puis remonter retrouve le même état.

Les fiches s’ouvrent et changent avec une transition brève ; les liens de responsable et de collaborateurs sont navigables. Échap et Fermer fonctionnent et le focus revient au déclencheur. La comparaison native fonctionne par clic et par clavier. Les préférences de mouvement réduit coupent les animations, y compris lors d’un changement après chargement. Aucun blocage ou détournement du scroll.

## Historique et corrections

1. Le premier test de retour au même état a échoué : la position transformée alimentait son propre calcul. Correction dans `src/motion.js` ; contrôle de retour à la même pose réussi sur mobile et desktop.
2. Une branche de bordure indésirable devant la racine mobile a été retirée. Nouvelle capture de l’arbre inspectée dans `organisation-mobile.jpg`.
3. Le test de préférence système attend désormais l’application de l’événement asynchrone avant de fermer le dialogue. Il vérifie l’état du bouton et l’arrêt des animations ; aucun contrôle n’a été désactivé.

Captures finales consultées : arbre desktop/mobile, détails Charel desktop/mobile, comparaison desktop/mobile et planche avant/après. Aucun P0/P1/P2 restant identifié. La petite taille des libellés de rôle dans l’arbre peut être ajustée en finition ultérieure ; les fonctions détaillées restent accessibles dans les fiches.

## Résultats et limites

- Compilation réussie, aucune dépendance ajoutée.
- 14 tests Playwright réussis : sept existants inchangés, sept nouveaux. Détail dans `artifacts/phase-2/test-results.txt`.
- Version compilée vérifiée localement à 320/390/768/1440 pixels : aucune exception de page ni réponse HTTP en erreur. Voir `production-smoke.json`.
- Vidéo réelle du scroll et des fiches : `organigramme-motion.mp4`.
- Aucune vraie 3D, pas d’exports de maillots séparés, pas de test Safari ou iPhone physique, pas de garantie universelle de fréquence d’images. Aucun déploiement.

## Checklist

- [x] Site existant amélioré sans changement de pile.
- [x] Arbre fidèle, fiches et liens hiérarchiques testés.
- [x] Comparaison fidèle aux ressources fournies.
- [x] Mouvement réversible et préférences vérifiés.
- [x] Captures desktop/mobile et détails consultés.
- [x] Compilation et 14 tests réussis.
- [x] Travail exclusivement local ; arrêt après présentation.

final result: passed
