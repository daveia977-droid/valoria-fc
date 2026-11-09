# Contrôle visuel et fonctionnel — VALORIA FC V1

## Références et état

- Source visuelle : `/workspace/generated_images/exec-d8afba4b-819e-4c3e-952b-6198445f0419.png`, planche 1536 × 1024, piste C. Accueil extrait : 470 × 498 pixels. Le viewport CSS de cette maquette n’est pas spécifié : comparaison de direction, pas revendication d’identité pixel par pixel.
- Nouvelle référence d’écusson fournie par l’utilisateur : adaptation de travail `/workspace/generated_images/exec-e478b133-5cc7-4f4e-87a4-6e9f360ea943.png`.
- État comparé : accueil et sections par défaut, animations mises en pause, tenue rouge ; contrôle séparé des quatre tenues et des dialogues.
- Implémentation de production : `artifacts/site-desktop.png` à 1440 × 1000 CSS, capture pleine page ; `artifacts/site-mobile.png` à 390 × 844 CSS, pleine page. Densité 1 : pixels de capture = pixels CSS. Contrôles de débordement supplémentaires : 320 et 768 pixels.
- Comparaison assemblée : `/tmp/valoria-qa/comparison-final.png`. À gauche, source extraite redimensionnée à 564 × 598 ; à droite, les 1527 premiers pixels de la capture desktop réduits au même cadre. L’échelle différente de la maquette conceptuelle est explicite, les différences de taille apparente ne constituent pas une comparaison métrique 1:1.
- Contrôles focalisés : `artifacts/accueil.png`, `artifacts/collection.png`, `artifacts/contact.png`, `/tmp/valoria-qa/kits-final.png`. Ces vues permettent de lire les boutons et de vérifier les bords des quatre produits.

## Résultats et corrections

1. **P2 corrigé : flèche absente dans le bouton principal.** Première capture `/tmp/valoria-qa/hero.png` : glyphe carré. Remplacement des glyphes par les icônes Phosphor ; capture finale `artifacts/accueil.png` : flèche visible. Icône du bouton violet également éclaircie ; contrôle focalisé dans `artifacts/contact.png`.
2. **P2 corrigé : fragments du maillot voisin sur les bords.** `/tmp/valoria-qa/kits-comparison.png` montrait des liserés adjacents. Correction des fenêtres de l’atlas et des centres par tenue. Nouvelle comparaison `/tmp/valoria-qa/kits-final.png` : les quatre maillots sont séparés et sans lettrage de sponsor.
3. **Typographie :** Cormorant Garamond pour les titres, Manrope pour la navigation et le texte ; fichiers locaux. Hiérarchie éditoriale de C conservée, tailles adaptées à un vrai viewport desktop et à 390 pixels. Aucun texte essentiel tronqué.
4. **Espacement :** alternance de sections sombres et ivoire, grille desktop puis colonne mobile. Aucun débordement horizontal aux quatre largeurs testées. Le hero mobile empile texte puis écusson ; pas de chevauchement des commandes.
5. **Couleurs :** violet profond, or et ivoire conservés ; états sélectionnés visibles. Contrastes automatisés axe sans violation sur la page et le dialogue de contact.
6. **Images :** textile violet/or cohérent avec C ; écusson doré du brief corrigé, décliné en WebP ; quatre tenues adaptées des références et corrigées sans « Victoria ». Les modifications de logo et l’ajout de la collection sont des adaptations explicitement demandées après le choix C, et non des écarts accidentels.
7. **Contenus :** projet fictif identifié, organisation officielle reproduite, fonctions sportives non attribuées signalées. Aucune histoire, victoire, adresse, transaction ou relation sponsor inventée.

## Interactions et limites

- Sept tests Playwright réussis : navigation, tabs au clavier, menu mobile, téléchargement de brouillon, animation réelle et pause, préférence de mouvement réduit, responsive et règles WCAG A/AA automatisées.
- Test de production séparé : changement de tenue, dialogue, fermeture Échap, captures desktop/mobile ; aucune exception de page. Compilation et installation `npm ci` réussies.
- Aperçu animé : `artifacts/valoria-motion.mp4`, capturé depuis Chromium. Aucun montage simulant des fonctionnalités absentes.
- Pas de test sur iPhone physique, d’audit humain complet ou de moteur Safari. Ces points restent à une revue ultérieure.
- Relais `sites-preview` indisponible ; vérification effectuée directement dans Chromium sur le serveur local, et non par le relais. Aucun site publié.
- Le contact télécharge un brouillon local ; aucune messagerie n’est configurée. Ce comportement est annoncé dans l’interface.

## Checklist

- [x] Comparaison de la piste C et de l’implémentation assemblée et consultée.
- [x] Contrôle des typographies, espacements, couleurs, visuels et contenus.
- [x] Correctifs P2 recapturés et inspectés ; aucun P0/P1/P2 restant identifié.
- [x] Interactions et mode de mouvement réduit vérifiés.
- [x] Instructions de lancement enregistrées ; cible d’hébergement désormais Vercel (`vercel.json`), compilation vérifiée ; aucune publication.

final result: passed
