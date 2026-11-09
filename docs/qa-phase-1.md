# Contrôle de conception — première phase VALORIA FC

## Source et méthode

Source de vérité : le brief explicite « première phase de refonte », l’écusson existant et l’état avant modification. La piste C antérieure est adaptée suivant les nouvelles exigences ; son ancienne palette et sa disposition latérale ne sont pas des objectifs de fidélité pour cette phase. Aucun audit de Laocoön n’est revendiqué.

Captures de référence : `artifacts/phase-1/before-desktop.png` (1440 × 1000) et `before-mobile.png` (390 × 844). Implémentation : `after-desktop.png` et `after-mobile.png` dans le même dossier. Dimensions pixels = viewport CSS, densité 1, mouvement réduit, même route et même état de navigation. Aucune normalisation de densité nécessaire.

Comparaisons assemblées et inspectées : `comparison-desktop.png` et `comparison-mobile.png`. Le desktop est présenté à 50 % dans la planche, avec consultation complémentaire de la capture originale à pleine taille. Le mobile est présenté à 100 %. Les captures originales servent au contrôle focalisé de la typographie, du blason, des textes et des boutons ; les captures `*-full.png` et `full-review.png` servent au contrôle des sections suivantes.

## Constatations

Aucun P0, P1 ou P2 restant identifié après comparaison. Les changements de titre, de proportions et de palette sont ceux demandés par le brief.

- **Typographies :** Cormorant Garamond et Manrope locales conservées. VALORIA FC devient le H1 principal, sans troncature sur les vues inspectées. Signature en italique, petits textes et boutons lisibles à taille réelle.
- **Espacement et mise en page :** blason centré à moins d’un pixel près dans les cinq largeurs/orientations contrôlées. Hero de 1000 px sur le viewport desktop de référence et 844 px sur le mobile de référence ; aucun contrôle caché. Sur les fenêtres très courtes, extension naturelle du contenu plutôt qu’un recouvrement.
- **Couleurs :** noir, bordeaux, or et crème appliqués aux cinq familles de surfaces : hero, navigation, sections, dialogues et états de focus. Violet réservé au sélecteur et au visuel du troisième maillot. Contrastes automatisés testés par axe sur la page et le dialogue.
- **Images :** l’écusson et la collection sont inchangés (empreintes comparées au début de phase). Fond généré adapté en bordeaux/noir/or, export WebP ; aucun remplacement du blason par une approximation SVG ou CSS. Aucun rendu 3D ajouté.
- **Contenus :** comparaison du HTML après le hero réussie, hors renommage de classe du bouton de contact. Tous les rôles et textes officiels sont conservés, aucun sponsor ajouté.

## Vérifications fonctionnelles

Compilation réussie. Les sept tests Playwright passent ; seule l’attente du H1 a été actualisée pour correspondre au titre demandé. Couverture conservée : liens, collection au clavier, menu mobile, téléchargement du brouillon, animation réelle, pause, réduction des animations, responsive et règles WCAG A/AA automatisées.

Contrôle additionnel sur 320 × 568, 390 × 844, 768 × 1024, 1440 × 1000 et 844 × 390 : aucun débordement horizontal ou titre tronqué. Basculement de la préférence système après chargement vérifié. Aucune exception de page ni requête HTTP en erreur. Détails dans `artifacts/phase-1/browser-validation.json`.

## Historique de comparaison

Première comparaison de cette phase : captures avant/après assemblées, captures originales et page complète inspectées. Pas de correction P0/P1/P2 requise après cette comparaison. Les corrections de la V1 antérieure sont archivées dans `docs/qa-v1.md`.

## Limites et checklist

- [x] Palette et nouvelle composition conformes au périmètre demandé.
- [x] Comparaisons desktop/mobile et vues focalisées inspectées.
- [x] Fonctionnalités, contenus, ressources de maillots et dépendances préservés.
- [x] Entrée 2D, pause et mode de mouvement réduit vérifiés.
- [x] Sept tests conservés et réussis ; compilation réussie.
- [x] Aucun déploiement, aucune intégration 3D et aucune nouvelle présentation de maillots.

Pas de mesure garantissant 60 images/s sur téléphone physique, ni de test Safari. Le relais d’aperçu partagé reste indisponible ; les vérifications ont été faites directement dans Chromium sur le serveur local. La comparaison avec Laocoön reste bloquée par l’accès réseau et n’est pas un critère prétendument vérifié de cette première phase.

final result: passed
