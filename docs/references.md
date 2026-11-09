# Références et décisions — VALORIA FC V1

## Direction retenue

La piste C de la planche `VALORIA FC — LOGO & SITE`, corrigée par les références de l’utilisateur : écusson doré à V facetté, violet profond, ivoire et or ; collection rouge, bleu nuit, ivoire et noir/violet. Tous les lettrages de sponsor « Victoria » ont été retirés de la collection affichée.

La structure du prompt master est prise en compte : projet pédagogique, séparation des faits et concepts, organisation fournie, contraintes économiques / RH / réglementaires / RSE, mobile, réduction du mouvement, absence de faux résultats, de paiements et de publication automatique.

Le prompt technique « Bronze and Time × VALORIA FC » a maintenant été reçu. La direction demandée est noir profond, bordeaux, or métallique et crème, avec violet sur le troisième maillot. L’utilisateur a confirmé que les quatre maillots restent **sans sponsor**, ce qui remplace la mention « Victoria » du prompt collé. L’analyse de l’évolution est décrite dans [architecture-cinematique.md](architecture-cinematique.md). La [première phase](phase-1.md) intègre maintenant cette palette, un hero central et une entrée animée 2D ; la narration immersive, la refonte de la collection et la 3D restent hors de cette première phase. La [phase 2](phase-2.md) ajoute désormais le défilement réversible, la comparaison des domiciles avec l’atlas inchangé et l’organigramme interactif ; aucune vraie 3D n’est ajoutée.

L’utilisateur a fourni [Laocoön sur Layers](https://www.getlayers.ai/layer/laocoon) comme référence principale. L’accès est actuellement bloqué par la politique réseau de l’environnement ; l’analyse de ses animations reste à effectuer. Aucun actif de cette référence n’est utilisé. Voir [l’état de l’analyse](laocoon-audit.md).

Vercel est désormais la cible d’hébergement choisie par l’utilisateur. La configuration Netlify est retirée ; voir `vercel.json` et [les instructions Vercel](vercel-deploy.md).

## GitHub réellement examinés

README, licences et instructions pertinentes consultés depuis des clones de recherche dans `/tmp/valoria-research`. Aucun de ces dépôts n’est une dépendance du site. Aucun agent externe, service, outil payant ou installation globale de skill n’a été ajouté.

| Source | Révision examinée | Licence | Utilisation |
| --- | --- | --- | --- |
| [Unslop — Damir Sokolovsky](https://github.com/heydamir/unslop) | `a6f121eee5f29c2f74976b75456feae8b66afb3a` | CC BY 4.0 | Référence de méthode : hiérarchie, espacement, richesse visuelle concentrée dans le hero, interfaces sobres. La palette violette choisie par l’utilisateur est conservée. |
| [Skills — Emil Kowalski](https://github.com/emilkowalski/skills) | `5206a950b715e0cabe7043ea0b2304332b91494e` | MIT | Instructions `animate` et `mobile-native` : transformations / opacité, courbes d’entrée, pause, réduction du mouvement, survol limité aux pointeurs fins, contrôles tactiles et champs de 16 px. |
| [Logo design — kaankiziltug](https://github.com/kaankiziltug/logo-design-skill) | `bbf31e521d765eb6d53242549bbee7c2e5bbd6bc` | MIT | Référence de lisibilité et de déclinaison du logo fourni. Aucun logo tiers de sa bibliothèque n’a été copié ; aucun master SVG inédit n’est revendiqué. |
| [OpenHands](https://github.com/OpenHands/OpenHands) | `cc99322a1efd0f4be8d6934ae93a4d1d4bc33e05` | MIT | Examiné, non retenu : orchestration d’agents sans rôle dans un site vitrine statique. Non installé. |

Les recommandations de design sont utilisées comme références, pas copiées comme code d’application. Attribution Unslop : Damir Sokolovsky, [@heydamir](https://x.com/heydamir), [dépôt](https://github.com/heydamir/unslop), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

## Autres liens du brief

Rive, SVGator et Motion ne sont pas intégrés : les animations retenues fonctionnent avec les API natives du navigateur. FIFA Kit Creator et Nike Team ne fournissent aucun actif ou produit au site. Aucun compte, abonnement ou téléchargement d’actif de ces services n’a été effectué. Ces liens n’ont pas été audités comme applications.

## Visuels

- Écusson fourni visuellement par l’utilisateur, adapté par l’outil image pour retirer le fond externe. PNG source de travail : `exec-e478b133-5cc7-4f4e-87a4-6e9f360ea943.png`.
- Collection fournie visuellement par l’utilisateur, adaptée en présentation catalogue puis corrigée pour enlever « Victoria » sur les quatre tenues. Seule la version corrigée `exec-1dc3c3fb-2883-4f8f-ae95-1212b0793bd7.png` est exportée pour le site.
- Arrière-plan textile violet/or original généré pour le hero : `exec-a03d32a7-4373-4e36-8153-72c6303a22c4.png`.
- Première phase : adaptation du seul fond de hero en noir/bordeaux/or, `exec-6bac42d5-2603-46aa-82f4-486dcf7383e0.png`, exportée dans `public/assets/hero-burgundy.webp` (51 532 octets). L’ancien fond violet n’est plus référencé par la page. Écusson et atlas de maillots restent identiques.
- Les chemins Windows fournis ne sont pas des fichiers locaux accessibles au serveur cloud. Les références intégrées aux adaptations sont les images visibles dans la conversation ; une identité parfaite au pixel près avec les originaux Windows n’est pas revendiquée.
- Compression WebP, dimensions conservées et aucun média tiers distant requis pendant la visite.

## Typographies et icônes

Cormorant Garamond et Manrope via Fontsource, hébergées localement, SIL Open Font License. Icônes de navigation Phosphor, licence MIT ; aucune flèche dessinée en SVG à la main. Textes complets des licences distribués dans `public/licenses/`.

## Reste à définir

Adresse de contact, responsable réel de publication, éventuels contenus sportifs et actualités. Toute boutique, billetterie, intégration d’e-mail, mesure d’audience ou publication nécessite une décision ultérieure. Aucune donnée inventée ne remplit ces emplacements.


## Phase 3 et budget prioritaire

Le texte technique détaillé « Recreate this site as a single HTML file: Laocoön — Bronze and Time » a été reçu et examiné. Il sert uniquement de référence de principes. Ses instructions de copie exacte, page de 900 vh, cheval WebGL, curseur masqué et imports CDN ne sont pas appliquées. Les visuels du projet ne sont ni remplacés ni régénérés.

La [phase 3](phase-3.md) réalise l’unification sombre, la composition mobile et la progression de lecture. La contrainte permanente de [budget 0 €](budget-zero.md) figure dans AGENTS.md. Aucun nouveau service, package ou actif payant ; configuration Vercel préservée sans déploiement.
