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

## V5.5 — ESGCI CUP et collection merchandising (18 novembre 2026)

- **Compétitions** : section d’orientation entre la Ligue des champions fictive préexistante et une nouvelle **ESGCI CUP**. Les huit matchs européens, scores et billets restent inchangés.
- **ESGCI CUP** : classement automatiquement dérivé de 12 résultats terminés (quatre journées) ; cinquième journée à venir le 28 novembre 2026, 16 h, VALORIA FC / ESGCI United. Six clubs de simulation, tableau mobile et détail des cinq journées, sans données externes, affiliation sportive ou réservation réelle.
- **Logo ESGCI** : mot-symbole fourni dans le chat, détouré en SVG transparent `public/assets/esgci-wordmark-transparent.svg`, sans fond blanc. L’ESGCI n’organise ni ne valide ce championnat fictif ; mention explicite dans les CGU, les mentions légales et la confidentialité.
- **Boutique** : transformation de la simple annonce en **catalogue de huit articles** regroupés par Maillots / Écharpes / Gants / Chaussettes / Accessoires. Les trois maillots montrent l’atlas authentique avec NW$ ; les cinq autres produits utilisent des illustrations SVG originales réalisées pour le concept, préservant le vrai blason du club.
- Filtres accessibles `aria-pressed`, descriptions de produits en dialogue natif et lien vers les tenues existantes. Les prix, les stocks et le paiement restent **à venir** : aucune vente ni vraie commande pour cette version.
- Maquette de boutique inspirée des structures des boutiques officielles du FC Barcelone et du Real Madrid (catégories, cartes produit, contenus éditoriaux), sans reprise de leurs images ou textes. Univers visuel et couleurs VALORIA préservés ; fond de stade approuvé repris avec retenue.
- Budget logiciel = 0 €, HTML/CSS/JavaScript/Vite sans dépendance supplémentaire. Vérifier le déploiement Vercel et les tests.

## V6 — Boutique premium, photographies conceptuelles et panier (18 novembre 2026)

- Références métier : [Real Madrid Boutique FR](https://shop.realmadrid.com/fr-fr/), structure éditoriale des boutiques de grands clubs (sans reproduction de marques ni de photos protégées). Tarifs observés : maillot standard ~100 €, écharpe 30 €, gants ~30 €, chaussettes ~20 €, casquette ~30 €, gourde métallique ~30 €. **VALORIA affiche des prix indicatifs de simulation**, et non les prix officiels du Real Madrid.
- Produits : trois maillots originaux (Domicile, Extérieur, Third), cinq photos studio originales générées en une planche WebP légère (écharpe, gants, chaussettes, casquette, gourde). Les photos illustrent des *concepts*, non des produits manufacturés ou un stock existant. La planche `public/assets/shop/merch-photography-v6.webp` est recadrée en CSS pour chaque fiche produit. Les SVG d'étude restent archivés.
- Maillots boutique : l'atlas WebP approuvé et NW$ restent intacts ; affichage sur un fond ivoire avec `collection-mask.png` (masque alphabétique existant) pour soustraire le fond sombre sans toucher à l'atlas.
- Catalogue à huit produits, prix formatés en euros, filtres conservés, taille et quantité dans la fiche, panier accessible, mise à jour/suppression, sous-total, choix d'une **date de livraison souhaitée non garantie** (de J+7 à J+75), beau message de confirmation.
- **Paiement réel non disponible** : au 18 novembre 2026, le projet Vercel ne contient aucune variable d'environnement de prestataire de paiement. La validation est explicitement une simulation, sans achat, encaissement, envoi, collecte d'adresse ni commande côté serveur. Un prestataire comme Stripe, une entreprise identifiée et des CGV e-commerce complètes seront nécessaires pour proposer de vraies ventes.
- Données : le panier est mémorisé temporairement dans `sessionStorage` et effacé à la confirmation ; la date est traitée localement. Mentions légales, CGU et confidentialité mises à jour.
- Guidage artistique consulté : [Impeccable](https://github.com/pbakaus/impeccable) (audit/finition), [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (design system), [Unslop](https://github.com/heydamir/unslop) (cohérence), [Taste Skill](https://github.com/Leonxlnx/taste-skill) (photo et sobriété), [Frontend Design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) (typographie et caractère). Ces guides n'introduisent aucune dépendance JavaScript dans le projet.

## V7 — Maillots détourés, ESGCI or, panier de club (18 novembre 2026)

- La collection 2D approuvée reste inchangée. Le catalogue fabrique localement trois **images détourées à fond transparent** à partir de l'atlas `collection.webp` et de son masque de transparence `collection-mask.png`, avec repli sur la méthode V6 si Canvas n’est pas disponible. Le sponsor NW$ reste un calque sur la poitrine. Toutes les cartes et fiches utilisent un fond ivoire.
- Le **Third** reçoit le badge « Meilleure vente » sur ses visuels. Il s'agit d'une **mise en avant fictive** sans données de ventes réelles : précision donnée dans les CGU et la note du catalogue.
- Le mot-symbole ESGCI fourni reste sans fond et ses chemins SVG passent en **or #E8C990**, sans changement de son lettrage ni revendication d'affiliation avec l'établissement.
- Le panier est refondu sur le principe des captures de référence : panneau latéral pleine hauteur, lignes article claires, taille, prix unitaire et prix de ligne, contrôles +/- accessibles, retrait, sous-total et zone récapitulative fixe en bas sur mobile, en couleurs VALORIA (pas de violet Real Madrid).
- **Livraison estimée = date du jour + 7 jours calendaires**, automatiquement recalculée à l'ouverture et lors de la confirmation, sans calendrier manuel ni choix de dates impossibles. Estimation non garantie, aucune véritable expédition.
- Confirmation graphique avec récapitulatif, total indicatif, date J+7, bouton « OK ». Le panier temporaire est vidé ensuite. Aucune commande ou paiement réel, aucune donnée bancaire.
- Corrections de lisibilité, focus clavier, cibles tactiles, mouvement réduit ; CSS indépendant `src/v7.css` ajouté après les styles V6.
- Les 5 référentiels approuvés restent des guides de conception : Impeccable, UI UX Pro Max, Unslop, Taste Skill et Frontend Design. Aucun SDK ni service payant ajouté.

## V8 — Porter nos couleurs. Partout. (23 novembre 2026)

- Quatre photographies validées, publiées entre Collection et Boutique : Studio homme (Domicile), Studio femme (Domicile), Street femme (Extérieur), Street duo (Third et Extérieur). Duo avec sac vide ; studio femme avec écusson corrigé sans couronne/lauriers.
- Les 4 fichiers JPEG fournis (1 486 690 octets cumulés) sont optimisés en WebP (qualité 81, sans changement de cadrage source). Ensemble environ 327 Ko. Assets locaux dans public/assets/campaign, pas de CDN ni de génération à la visite. Images lazy-loaded, async-decoded, dimensions intrinsèques et alt text.
- Galerie éditoriale asymétrique sur desktop (deux photos studio hautes, deux street empilées) ; sur iPhone, défilement horizontal manuel et scroll-snap avec boutons, compteur, clavier, sans autoplay. CTA lisible vers la boutique.
- Profondeur mesurée via perspective et transitions CSS, hover discret de la collection et des photos, sans nouvelle scène WebGL. Le blason reste en 2.5D. Sur mobile, les effets de filtre lourds sont atténués.
- Boucle d'animation d'accueil optimisée : une progression inchangée n'impose pas de réécrire les variables CSS ou les attributs aria/inert. Navigation active mise à jour uniquement lorsque la section change.
- Accessibilité : role=img valide sur la représentation des maillots, meilleur contraste des catégories. Test phase-3 adapté au vrai breakpoint menu 1180px.
- QA : Vite build, Playwright 320, 390, 430, 768, 1440 ; galerie, navigation, clavier, réduction de mouvement, autres sections.
- Transparence : photos et modèles conceptuels générés par IA, aucun produit fabriqué ni encaissement réel, boutique/billetterie en démonstration.
- Guides d'inspiration conservés : Impeccable, UI UX Pro Max, Unslop, Taste Skill, Frontend Design. Zéro dépendance de production ajoutée.

## V8.1 — Galerie photo harmonisée et correctif Safari iPhone (23 novembre 2026)

- Problème constaté sur capture mobile : titre, compteur et boutons visibles mais galerie photo vide. La grille mobile initiale utilisait une rangée 1fr dans une grille à hauteur automatique, et les seules images étaient positionnées en absolu. Cela peut rendre la rangée nulle dans certains navigateurs WebKit.
- Correction structurelle : galerie mobile en flex horizontal avec largeur ET hauteur explicites sur chaque figure ; les images absolues ne contrôlent plus la taille. Aucun JS de mesure ni carrousel automatique. CSS actif même si JavaScript est désactivé.
- Ordre validé : Studio femme, Street duo, Studio homme, Street femme. Les quatre visuels validés sont conservés, blasons et sponsors inclus.
- Harmonie photographique via CSS uniquement : cadrages cohérents, saturation légèrement atténuée, contraste doux et reflet bordeaux-or subtil. Flèches ↗ des liens inchangées.
- Tests V8.1 : tailles mobiles 320/375/390/430, hauteur des cartes, galerie sans JavaScript, navigation, boutique, réduction des mouvements.

## VALORIA V8.2 — Film d’accueil, navigation, supporters (23 novembre 2026)

- Compteur affiché : 13 542, avec hiérarchie visuelle renforcée. C'est une donnée éditoriale de démonstration, et non un chiffre de vrais comptes vérifié. La limite est expliquée dans la page Confidentialité, sans faux compteur temps réel.
- Remplacement de toutes les flèches diagonales par des icônes horizontales sobres (SVG accessible, translation de survol légère), y compris les liens de campagne, les matchs et la boutique.
- Performance du héros : variables CSS d'animation appliquées à la seule scène et non à tout le document HTML. Les préférences de mouvement réduit et la pause manuelle sont conservées.
- Écusson historique intact : contours et profondeur rendus en CSS avec moins de couches de filtres GPU, ombre directionnelle plus réaliste et fond de stade plus lisible.
- Téléphone : réduction des flous/filtres coûteux, vignettage naturel sur le vrai fond du stade. Aucun moteur 3D supplémentaire.
- Tests : Playwright pour flèches, confidentialité, animation locale, responsive 320 à 1440 pixels, galerie, boutique, accessibilité.

## VALORIA V8.3 — Entraînement nocturne (23 novembre 2026)

- Galerie limitée à quatre visuels : entraînement nocturne, studio femme, studio homme, duo streetwear. La photo streetwear solo reste disponible parmi les assets.
- Première photo : vraie personne sur le terrain, avec maillot Domicile ajouté numériquement. Recadrage optimisé 832 x 1105, environ 109 Ko, conservé dans public/assets/campaign/training-night-v83.webp.
- Sur ordinateur, composition éditoriale asymétrique ; sur mobile, carrousel horizontal manuel sans lecture automatique. Un simple réglage CSS harmonise la teinte et la lumière du Training.
- Les textes de la galerie et les documents légaux distinguent la photo de personne réelle des trois scènes fictives générées avec IA.
