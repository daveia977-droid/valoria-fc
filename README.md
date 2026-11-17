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
