# VALORIA FC — Revue Unslop V3.5

**Date :** 18 novembre 2026  
**Référence :** [heydamir/unslop](https://github.com/heydamir/unslop), Damir Sokolovsky, licence CC BY 4.0 (attribution obligatoire)  
**Cible :** https://valoria-fc.vercel.app/  
**Méthode :** revue des fichiers et du site servi par Vercel, sans capture visuelle initiale du navigateur dans cette session. Les conclusions concernant les styles sont donc fondées sur le code CSS/HTML.

## Direction retenue

- **Produit :** vitrine VALORIA FC, projet de football né en 2026, avec maillots 2D, calendrier fictif, organisation, supporters et boutique à venir.
- **Caractère :** retenu, déterminé, chaleureux.
- **Univers :** stade nocturne, tissu des maillots, billetterie sur papier, encre bordeaux et accents or.
- **Moments :** blason officiel dans le hero, et couleurs des huit adversaires sur les affiches de rencontre.
- **Signature :** un trait d’or discret, unique et constant dans les séparations et les états actifs.

## Audit technique initial

| Emplacement | Constat vérifié dans les styles/source | Traitement V3.5 |
| --- | --- | --- |
| Hero, histoire, boutique | Multiplication de halos et d’ombres colorées sur des surfaces secondaires | Intensité diminuée ; le blason reste le moment principal |
| Boutons de navigation et liens | Symboles typographiques flèche/chevrons, croix et coche de formes et tailles différentes | Une seule grammaire SVG au trait 1,7 et 18 px dans `src/ui-icons.js` |
| Calendrier | Adversaires représentés par des monogrammes sans forme distinctive ; valeurs de scores plus fortes que les logos | Huit blasons graphiques indépendants en SVG, formes et couleurs propres, dans les cartes, l’affiche et le détail |
| Cartes des rencontres | Découpe irrégulière et ombres fortes, contrastes de surfaces variables | Cartes crème lisibles, rayons alignés, ombres neutres et bordures fines |
| Billetterie, organigramme | Ombres et bordures de style mélangé | Surfaces plus calmes sans supprimer les interactions |
| Mobile | Composants très serrés à petites largeurs | Icônes 18 px, boutons 44 px, cartes et écussons adaptés, mouvement réduit conservé |

## Ne pas changer

- **VALORIA FC**, identité bordeaux/or/noir/crème et Third violet.
- Blason VALORIA original et décor de stade approuvé, 3 maillots 2D officiels avec NW$.
- Sept membres, rôles et rattachements, histoire du club née en 2026.
- Huit adversaires, résultats et dates de simulation ; billetterie de démonstration, boutique non ouverte.
- CSS/HTML/Vite/JavaScript, budget 0 € et absence de nouveaux services.

## Logos d’adversaires

Les fichiers `public/assets/opponents/*.svg` sont des illustrations éditoriales originales, par exemple un disque rouge/blanc pour Bayern, un écu rayé pour Juventus, un disque bleu profond pour Paris, un écu rayé rouge pour Atlético, une composition bordeaux/bleu pour Barcelone, un disque bleu pour Chelsea, un écu rouge pour Liverpool et un disque bleu/noir pour l’Inter. Les monogrammes sont originaux ; aucune affiliation aux clubs cités et aucun blason officiel.

## Vérifications nécessaires

- Compilation Vercel « READY » et mise à jour du commit sur le domaine.
- Vérifier la présence des huit SVG, la fiabilité du calendrier et de la billetterie.
- Tester idéalement les interactions et débordements visuels à 320 / 390 / 768 / 1440 px sur navigateur : si pas exécutés, l’indiquer dans la livraison.
- Préférence `prefers-reduced-motion`, clavier, dialogues et navigation au doigt conservés.

**Attribution :** Méthode d’audit et de finition inspirée de *Unslop* par Damir Sokolovsky, licence CC BY 4.0 : https://github.com/heydamir/unslop. Les fichiers SVG et CSS V3.5 sont des créations du projet VALORIA FC ; aucune ressource graphique du skill n’a été copiée.
