# VALORIA FC — QA du prototype HERO → IDENTITÉ

final result: passed

Périmètre : prototype local `prototypes/hero-cinematique/` uniquement. Aucune refonte de la collection ou de l’organisation, aucune modification de la production.

## Références et comparaison

Source visuelle : six images jointes au dernier brief utilisateur. Référence principale : planche 2 « Concept site officiel — Direction UI/UX », cadrages 01, 02 et 04. Les variantes 3/5 et 6 fixent la matière et la composition mobile. La consigne écrite « titre jamais masqué par le blason » prime sur le chevauchement des anciennes variantes.

Les maquettes sont visibles dans la conversation, mais leurs fichiers originaux ne sont pas montés sur disque. Comparaison visuelle de la composition et des états, sans différence pixel à pixel ni identification certaine de leur fonte. La planche générale est un montage de plusieurs cadres ; elle ne représente pas un viewport unique à reproduire en entier.

Implémentation : Chromium local, prototype **compilé**, desktop 1440×900 et mobile 390×844, densité 1. Captures PNG à ces dimensions exactes. Les planches de restitution redimensionnent seulement les captures et ne retouchent pas le site ou ses assets.

Preuves :

- `artifacts/motion-prototype/desktop-deux-cadrages.png` : deux états desktop.
- `artifacts/motion-prototype/mobile-deux-cadrages.png` : deux états mobile.
- `artifacts/motion-prototype/comparaison-avant-apres.png` : ancien prototype local (`artifacts/art-direction-audit/hero-prototype-1440.jpg`, également repris dans les références) et nouveau cadrage sans chevauchement. L’ancien viewport 1440×1000 et le nouveau 1440×900 sont signalés : cette planche n’est pas une comparaison pixel à pixel à viewport identique.
- Détails titre/blason : captures individuelles `hero-initial-1440x900.png` et `hero-initial-390x844.png`, inspectées en pleine définition ; ancien cadrage visible dans la comparaison précédente. Contrôle géométrique de leurs boîtes pendant l’entrée et à douze positions de scroll.
- `hero-reduced-motion-390x844.png` : deux chapitres statiques lisibles.
- `scroll-mobile.mp4` et `scroll-desktop.mp4` : huit secondes chacun, descente puis remontée. Séquences de 96 captures réelles du navigateur encodées à 12 images/s ; ce n’est pas une mesure du framerate du site. Images intermédiaires `frames-mobile/f024.jpg` et `frames-desktop/f024.jpg` inspectées en plus des poses finales.

## Surfaces de fidélité

| Surface | Constat après correction |
| --- | --- |
| Typographie | Cormorant Garamond et Manrope locales conservées. VALORIA FC entièrement lisible au-dessus du blason ; titre d’identité en deux lignes, italique dorée, petites capitales et navigation discrète. Fonte exacte des maquettes non identifiée. |
| Composition et espacements | Titre et blason séparés ; CTA sous le blason ; cadrage final texte à gauche / blason à droite. Mobile recomposé verticalement, avec un cadrage spécifique sur écran court et paysage. |
| Palette | Noir profond, bordeaux du textile original, or et crème. Aucun violet ni nouvelle palette. Contrôle axe AA sans violation détectée dans les six états audités. |
| Assets | `crest.webp` et `hero-burgundy.webp` inchangés. Pas de grande image de maquette utilisée comme interface. Décor textile authentique, léger éclairage CSS, icônes Phosphor déjà installées. Aucun actif Laocoön. |
| Contenu | Textes du prototype et des références conservés. Aucun sponsor, numéro, stade ou département illustratif ajouté ; aucun nom de personne modifié. |

## Historique des corrections

- P1 — Titre et blason superposés dans l’ancien cadrage : zones verticales séparées et taille du blason adaptée à la hauteur disponible. Vérification des images et des états intermédiaires ; aucune intersection détectée.
- P1 — Identité masquée en mouvement réduit/pause : deux chapitres désormais présents dans le flux, également sans JavaScript. Capture statique inspectée et navigation testée.
- P2 — Animation d’entrée en concurrence avec le scroll : enfants séparés pour l’entrée, parents réservés au scroll ; entrée annulée si le défilement commence.
- P2 — Focus différé pouvant voler celui d’un contrôle : temporisateur annulé au changement de mode et focus conditionné au lien initiateur encore actif.
- P2 — Focus perdu lorsqu’une branche devient inerte : retour à « Le club » uniquement si l’élément actif appartient à la branche qui disparaît ; contrôle dans les deux sens.
- P2 — Décalage de lecture à la pause : compensation du scroll et hauteur de lecture suffisante. Écart du titre mesuré inférieur à 0,5 px sur les cinq formats.
- P2 — Légende déplacée après l’identité dans la lecture statique : ordre HTML corrigé, légende désormais après l’introduction.

Aucun problème P0/P1/P2 restant observé dans ce périmètre. La revue visuelle confirme les deux cadrages et la continuité du décor ; elle ne remplace pas la validation artistique de l’utilisateur.

## Validation technique

- Compilation du site et compilation indépendante du prototype : réussies.
- Tests Playwright existants du site : **29 réussis** (43,8 s). Ils préservent le comportement existant ; les tests du prototype sont exécutés séparément.
- Prototype : 320×568, 390×844, 768×1024, 1440×900 et 844×390.
- Entrée, douze positions du scroll, retour exact à la pose initiale, cadrage final, absence de débordement, navigation clavier, restauration du focus, pause et réduction des animations : contrôlés.
- Geste tactile réel envoyé à Chromium émulé en 390×844 : scroll naturel vérifié.
- Axe WCAG A/AA : six audits, aucune violation détectée. Cela ne constitue pas une certification exhaustive d’accessibilité.
- Aucune erreur JavaScript non interceptée, réponse HTTP en erreur ou requête réseau extérieure au serveur local détectée.
- Rapport détaillé : `artifacts/motion-prototype/prototype-verification.json`.

Limites : aucun iPhone physique/Safari iOS connecté ; pas de garantie universelle de fréquence d’images. Le relais de navigateur partagé n’est pas disponible : vérification réalisée dans Chromium/Playwright local, avec captures du rendu effectif. Les liens vers les sections existantes de production sont conservés mais n’ont pas fait l’objet d’un nouvel audit distant.

## Suite

Attendre la validation visuelle. Ne pas intégrer à main ni étendre aux autres sections ou publier avant cette validation. Aucune dépendance ajoutée et aucun service activé. Coût supplémentaire : **0 €**.
