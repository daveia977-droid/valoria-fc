# VALORIA FC V1 — livraison et publication

Version officielle Vite / HTML / CSS / JavaScript. Hero et transition A/B « Écrin bordeaux » repris du prototype validé ; adaptation des liens et du menu mobile uniquement. Les prototypes et anciennes ressources restent conservés.

## Modifications

- Quatre maillots authentiques de face, sélection au clavier/tactile, comparaison facultative des deux domiciles. Aucune vue de dos, aucun placeholder, aucun modèle chargé.
- Fond retiré par un masque alpha dérivé localement de l’atlas. Le fichier `collection.webp` reste inchangé. `tools/build_collection_mask.mjs` reconstruit ce masque avec Canvas local ; aucun outil génératif ni service externe. Les recadrages sont recentrés et isolent les voisins.
- Présentation éditoriale : direction Yvan → Messi, trois pôles Charel / Mamady / Émilie, avec Marco et Dylan rattachés respectivement à Charel et Mamady. Sept profils et leurs descriptions conservés. Fiches natives interactives, retour du focus, aucune longue carte d’organigramme.
- Mentions légales, confidentialité et CGU accessibles par de vrais fichiers HTML. France confirmée par l’utilisateur. Contact et informations d’identification de l’éditeur non communiqués ; coordonnées détaillées de l’hébergeur à confirmer. Les textes signalent ces lacunes et ne prétendent pas constituer des mentions complètes.
- Aucun traitement de formulaire ajouté : le brouillon reste généré dans le navigateur et téléchargé, jamais envoyé par le code.

UI UX Pro Max 2.15.0, MIT : recherches locales et recommandations sur la hiérarchie des titres, la sélection explicite, le clavier, le focus non masqué, le reflow mobile et les transitions interrompables. Ni nouvelle fonte, ni palette, ni dépendance imposée.

## Vérification

```sh
npm test
npm run build
npm run preview -- --port 4188 --strictPort
# dans un autre terminal
node tools/verify_release.mjs
```

Mobile d’abord : 320 et 390 px ; puis 768 et 1440 px. Contrôles de compilation, quatre tenues, masque, navigation, fiches, mouvement réduit, défilement tactile, brouillon, accessibilité et pages légales. Les anciens tests exigeant une manipulation GLB ont été remplacés par les exigences 2D validées. Les contrôles des images différées les chargent explicitement pour distinguer une URL cassée d’un chargement volontairement différé.

Captures et rapports : `artifacts/v1-final/`. Émulation Chromium ; pas d’iPhone physique connecté. La vérification de la production doit rester distincte des résultats locaux.

## Publication

Vercel reste relié à main ; `vercel.json` compile `dist/` à la racine. Aucun token, service ou option payante à créer. L’ancien workflow GitHub Pages est conservé en déclenchement manuel uniquement pour éviter une seconde publication automatique. Son build explicite `/valoria-fc/` reste possible.

Pour vérifier l’URL publiée avec le même outil :

```sh
VALORIA_SITE_URL=https://valoria-fc.vercel.app/ VALORIA_REPORT_DIR=artifacts/v1-public node tools/verify_release.mjs
```

Le réseau de cet environnement doit autoriser `valoria-fc.vercel.app` et `api.github.com` pour contrôler la production et le statut de l’intégration Vercel. Une réponse HTTP du site ne remplace pas le statut de déploiement ; un contrôle Vercel associé au commit doit aussi être vérifié.

Budget supplémentaire : **0 €**. L’offre Hobby existante n’est pas modifiée et aucune fonctionnalité facturable n’est activée.

## Résultats locaux de la V1

- 30 tests Playwright réussis : collection, masque de fond, clavier/tactile, profils, navigation, mouvement réduit, brouillon local et pages légales.
- Compilation de production réussie ; contrôle de la compilation sur 320, 390, 768 et 1440 px, sans ressource manquante ou erreur JavaScript.
- Captures du hero, de l’identité, des quatre tenues, de l’organisation et des mentions légales dans `artifacts/v1-final/`.
- `version.json` expose uniquement le SHA public du commit compilé pour distinguer la version réellement servie.

Le statut de production reste à vérifier séparément ; aucun résultat local ne constitue une preuve de statut READY.
