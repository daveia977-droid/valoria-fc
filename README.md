# VALORIA FC

Site vitrine personnel d’un club fictif, avec un budget maximal de **0 €**. Vite, HTML, CSS et JavaScript ; polices et ressources locales, aucune API payante.

Le hero « Écrin bordeaux » se transforme au scroll en scène d’identité. La V2 présente trois maillots 2D de face : Domicile bleu nuit (ancien V2), Extérieur crème et Third violet ; sponsor conceptuel NW$ en calque. Le maillot rouge V1 et ses sources restent archivés. La structure présente Yvan, Messi et les trois pôles avec leurs rattachements, à travers sept profils interactifs. Le calendrier de Ligue des champions imaginé présente huit adversaires réels, mais des résultats fictifs et des emblèmes graphiques originaux. Chaque match à venir ouvre une billetterie de démonstration (tribunes A/B/C, quantité, specimen et confirmation sans paiement). Une section supporters affiche 10 200 comme chiffre de démonstration. Le formulaire de contact télécharge seulement un brouillon local. Aucun lien avec l'UEFA ou les clubs adverses n'est revendiqué.

## Lancer

```sh
npm ci
npm run dev
```

## Compiler et vérifier

```sh
npm test
npm run build
npm run preview -- --port 4188 --strictPort
```

Dans un autre terminal, `node tools/verify_release.mjs` contrôle la compilation servie sur 4188 et produit les captures et résultats dans `artifacts/v1-final/`.

Vercel est connecté à la branche officielle `main`, avec publication du seul dossier `dist/`. La base Vite est `/`. Le workflow historique GitHub Pages est conservé en déclenchement manuel ; pour ce cas uniquement, compiler avec `npm run build -- --base=/valoria-fc/` puis `npm run test:pages`.

## Licences et données

Les fontes Manrope / Cormorant Garamond et les icônes Phosphor conservent leurs notices dans `public/licenses/`. UI UX Pro Max, sous MIT, est installé dans `.agents/skills/ui-ux-pro-max/` et sert à la conception, pas au code exécuté dans le navigateur.

Les visuels sources restent conservés. Le masque `collection-mask.png` rend le fond de l’atlas transparent sans régénérer les tenues ; son générateur local est `tools/build_collection_mask.mjs`. Les anciennes études et sources restent archivées dans le dépôt, sans chargement par la V1.

Les pages `mentions-legales.html`, `confidentialite.html` et `cgu.html` décrivent le projet et le fonctionnement observé. La France est confirmée ; les informations de publication et le contact de l’éditeur restent à compléter, ainsi que les coordonnées détaillées de l’hébergeur. Aucun nom, adresse ou pratique de collecte n’a été inventé.

Détails de livraison : [docs/v1-publication.md](docs/v1-publication.md).

## V2 — provenance et limites

Le calendrier suit les dates générales de la phase de ligue 2026/27 publiées par l'UEFA, mais toutes les affiches VALORIA sont imaginaires. Les tarifs de simulation 35/70/110 € sont inspirés des ordres de grandeur affichés par le FC Bayern pour ses rencontres européennes (https://fcbayern.com/en/tickets/info/prices-and-concessions), sans constituer une offre de vente. Les noms des clubs servent d'exemples ; aucun blason adverse ou logo UEFA n'est reproduit. Les insignes sont des monogrammes originaux. Les détails de démonstration figurent dans les CGU. Décor de tribunes SVG dessiné dans le dépôt sans nouvelle dépendance.

## V2.5 — scène et identité visuelle (17 novembre 2026)

- Fond de stade validé, issu du visuel approuvé par l’utilisateur, optimisé en WebP pour un usage décoratif léger (480 × 600, source inchangée conservée hors du dépôt). L’image possède un espace sombre central : elle accompagne le blason sans lui faire concurrence.
- La scène d’accueil n’affiche plus la mention « Projet personnel · Club fictif » ; le caractère imaginaire reste explicité dans les pages légales et dans les indications de billetterie non valable.
- Les trois tenues originales de face sont conservées ; NW$ est présenté sous forme de logotype typographique serif incliné avec filet courbe, en or sur Domicile/Third et en bordeaux sur Extérieur. Aucun pixel des tenues d’origine n’est modifié.
- Le stade revient avec des opacités et cadrages distincts dans le calendrier, les maillots, les supporters, l’organisation, les sections de contact et les pages légales, avec masques sombres pour maintenir la lisibilité.
- Références de méthode consultées, sans ajouter de dépendance : [Vercel Web Design Guidelines](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines), [Anthropic Frontend Design](https://github.com/anthropics/skills/tree/main/skills/frontend-design), [Make Interfaces Feel Better](https://github.com/jakubkrehel/make-interfaces-feel-better), en conservant Vite et le système CSS existant. Seules leurs recommandations de conception sont appliquées ; aucun code externe ni police n’a été copié.

## V3 — finition des interactions (18 novembre 2026)

- Deux portes d’entrée dans la scène d’accueil : présentation du club et accès au calendrier, y compris sur iPhone.
- Huit affiches de Ligue des champions imaginées : calendrier tactile, ordre domicile/déplacement et scores affichés dans l’ordre des équipes, labels « Victoire », « Défaite » ou « Match nul » du point de vue de VALORIA FC. Le résumé des résultats ne constitue aucune information sportive réelle.
- Billetterie de démonstration : groupes de sélection natifs, deux colonnes adaptatives, total indicatif mis à jour et ticket « SPÉCIMEN » sans réservation ni paiement.
- Sponsor NW$ conservé en lettrage doré ou bordeaux sur les trois tenues 2D existantes, avec positionnement affiné par maillot.
- Ambiance supporters sobre : Ferveur, Unité, Respect, sans témoignages inventés ; compteur de démonstration inchangé.
- Contrôles clavier et tactile renforcés, surlignage de navigation pour les sections Matchs/Supporters et motion réduite respectée.
- Zéro nouvelle dépendance payante ou externe ; fond de stade approuvé de la V2.5 et fichiers sources d’origine conservés.

## V3.2 — histoire, boutique en préparation et profondeur (18 novembre 2026)

- Le hero est épuré : les textes « Découvrir le club », « Un blason. Une même identité. » et le raccourci « Voir les matchs » ont été retirés. Le blason officiel garde sa position et gagne un relief optique CSS (ombres, perspective, éclat discret), sans altérer l’image.
- Une rubrique **Notre histoire** raconte le projet de jeunes ambitieux né en 2026, avec une écriture naturelle et sans inventer de faits sportifs, juridiques ni de palmarès.
- Une entrée de navigation **Boutique** conduit à une rubrique dédiée **Boutique officielle à venir**. Aucun paiement, commande, prix de vente, collecte ou panier n’est opérationnel avant une éventuelle ouverture future.
- L’organigramme conserve ses sept membres et leur hiérarchie ; seule la présentation gagne des surfaces, contrastes et ombres. Les décors de typographie remplacent les petites flèches non essentielles.
- Les faux écussons circulaires d’adversaires ont été remplacés par des signatures typographiques, tandis que VALORIA conserve son authentique blason. Aucun logo adverse protégé n’est repris.
- Le billet spécimen reçoit des effets de papier et des repères visuels sans fausse lecture possible comme billet réel.
- Navigation et tests mis à jour, avec respect des contraintes mobiles, du clavier, de la réduction des mouvements et du budget nul.
- La méthode éditoriale « Plume » est appliquée : phrases complètes, ton naturel, fidélité aux faits fournis. Aucun service externe ou migration de framework.

## V3.5 — Design Unslop et identités adverses (18 novembre 2026)

- Méthode de design : **[Unslop de Damir Sokolovsky](https://github.com/heydamir/unslop)**, licence [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/). Cette refonte s’appuie sur sa grille de lecture (audit, direction, espacements, couleurs, icônes, typographie, structure, détails, visuels, mouvement). Crédit : Damir Sokolovsky, @heydamir. Aucune bibliothèque d’exécution issue du skill n’est ajoutée au site.
- Référence détaillée : [docs/v35-unslop-audit.md](docs/v35-unslop-audit.md).
- Palette conservée : noir, bordeaux, or, crème, avec violet réservé au Third. Écarts de spacing réduits, rayons/hairlines cohérents, suppression de halos superflus ; la photographie de stade V2.5, le blason et la collection NW$ sont inchangés.
- Une même famille d’icônes vectorielles dans `src/ui-icons.js` pour menus, navigation, actions, résultats et fermeture des fenêtres. Pictogrammes au trait 1,7 et 18 px, avec intitulés accessibles ; la gestion de pause et de mouvement réduit est conservée.
- Huit **emblèmes vectoriels originaux non officiels**, dessinés pour VALORIA (fichiers `public/assets/opponents/*.svg`) : Bayern, Juventus, PSG, Atlético, Barcelone, Chelsea, Liverpool et Inter. Couleurs inspirées des équipes, silhouettes distinctes, monogrammes propres ; aucun blason, logo UEFA, dessin protégé ou affiliation réelle reproduit. Ils apparaissent sur le bandeau, l’affiche du prochain match et dans les fiches de rencontre.
- Les résultats, dates, scores, billets de démonstration, boutique non ouverte, organigramme et textes ne sont pas modifiés. Pas de nouveaux services, paiements ni dépendances d’exécution. Vérifier les tests et déploiements avant la livraison.
