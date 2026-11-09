# Publication GitHub Pages — VALORIA FC

## Configuration prête et contrôlée localement

Adresse attendue : `https://daveia977-droid.github.io/valoria-fc/`.

**Cette adresse n’est pas annoncée comme fonctionnelle.** L’API `api.github.com` et le domaine public `daveia977-droid.github.io` sont refusés par le proxy de cet environnement (HTTP 403). Le Git authentifié fonctionne, mais ne donne pas accès aux paramètres Pages, aux droits administrateur ou au statut distant des workflows. L’activation et le résultat du déploiement ne sont donc pas confirmés depuis cet environnement.

Le site complet est déjà dans `main`, qui inclut `feat/valoria-v1`. Les derniers travaux locaux de maillots sont sauvegardés avant cette intervention, avec les fichiers non enregistrés et les captures : `/workspace/valoria-sauvegardes/2026-11-09-github-pages/etat-avant.tar.gz`, manifeste SHA-256 et historique Git. Archive vérifiée : 486 fichiers. Les projets et exports des deux études V1 sont aussi conservés dans `design/maillots/etudes-v1/`, avec leurs sources dans `tools/` et le rapport `docs/prototype-v1-tissu.md`.

Les études V1 attendent toujours le PNG du nouveau dos et restent séparées du site. Cette mission d’hébergement ne remplace aucun modèle ou visuel validé par une étude incomplète. Les autres tenues, le hero, l’organigramme, les contenus et les interactions sont conservés.

## Fichiers techniques

- `vite.config.js` : base `/valoria-fc/` pour la compilation et sa prévisualisation. Le serveur de développement conserve `/`, compatible avec les 29 tests existants. Vite réécrit les URL HTML et CSS des images, scripts, icônes et polices.
- Le chargement GLB utilise déjà `import.meta.env.BASE_URL` ; aucune modification du moteur 3D n’est nécessaire. Son import JavaScript reste différé, au moment où le V1 devient visible.
- `.github/workflows/pages.yml` : Actions officielles GitHub, épinglées par SHA ; publication uniquement à partir de `main` ou sur lancement manuel de cette branche.
- `package.json` et `tools/check_pages_preview.mjs` : commande `npm run test:pages`, testant le vrai dossier compilé sous le sous-chemin de production.

Le workflow installe Node.js 24, exécute `npm ci`, installe Chromium pour les tests, compile avec `npm run build`, exécute `npm test` puis `npm run test:pages`. Seul `dist/` est transmis à `actions/upload-pages-artifact`, puis publié par `actions/deploy-pages`.

Permissions : lecture du contenu pour le build ; `pages: write` et `id-token: write` uniquement pour la publication. Aucun jeton personnel ou secret supplémentaire n’est demandé. `actions/configure-pages` lit la configuration existante ; son option d’activation automatique est volontairement laissée désactivée, car [elle exige un autre jeton que le `GITHUB_TOKEN` automatique](https://github.com/actions/configure-pages/blob/v5/action.yml).

Les sources Blender, études GLB, documents, scripts, rapports locaux et dépendances ne sont pas copiés dans `dist/`. Aucun workflow Vercel, Netlify ou autre hébergeur n’est ajouté. L’ancienne configuration Vercel est conservée comme fichier historique, sans utilisation.

## Vérifications avant envoi

- `npm ci` : réussite, dépendances du lockfile installées sans changement de versions.
- `npm run build` : réussite. L’avertissement de taille du module Three.js différé était déjà présent ; aucun module lourd n’est ajouté.
- `npm test` : **29 tests réussis**, sans modifier les tests existants.
- `npm run test:pages` : réussite sur une prévisualisation HTTP du résultat compilé, montée sous `/valoria-fc/`.
- Quatre largeurs contrôlées : 320, 390, 768 et 1440 px. Aucun débordement horizontal, écran blanc, image manquante ou erreur JavaScript bloquante détecté.
- Dix ressources publiques vérifiées par HTTP avec contrôle de la taille des réponses, dont le vrai GLB à `/valoria-fc/models/domicile-v1.glb`.
- Polices, scripts et images chargés sous le préfixe ; import Three.js et chargement GLB différés vérifiés. Modèle rendu réellement avec WebGL, rotation clavier et tactile fonctionnelles, défilement vertical natif conservé.
- Ancres de navigation, comparaison des domiciles, sélection des quatre maillots, fiches de l’organigramme et téléchargement du brouillon contrôlés dans la version compilée.
- Hero animé et pause testés en production locale ; préférences de réduction des mouvements conservées.

Rapport machine et captures locales : `artifacts/github-pages/preview-report.json` et `preview-320.jpg`, `preview-390.jpg`, `preview-768.jpg`, `preview-1440.jpg`. Les tests mobiles utilisent Chromium émulé, pas un iPhone physique. Le résultat local ne prouve pas un déploiement distant.

## Étape manuelle si Pages n’est pas activé

1. Ouvrir [Settings → Pages du dépôt VALORIA FC](https://github.com/daveia977-droid/valoria-fc/settings/pages).
2. Dans **Build and deployment**, choisir **Source → GitHub Actions**. Le workflow est déjà fourni : ne pas créer un second workflow de site.
3. Ouvrir [Actions → Publier VALORIA FC sur GitHub Pages](https://github.com/daveia977-droid/valoria-fc/actions/workflows/pages.yml).
4. Choisir **Run workflow**, branche **main**, puis **Run workflow**. Si GitHub demande d’activer Actions sur ce dépôt, utiliser l’activation proposée pour ce dépôt uniquement.
5. Attendre la réussite des jobs **build** et **deploy**. Le job de publication fournit l’URL dans l’environnement **github-pages**. Ouvrir cette URL sur PC et iPhone pour confirmer le fonctionnement réel.

Ne pas modifier les permissions globales de tous les dépôts, acheter d’offre, fournir un jeton dans la conversation ou configurer un domaine payant. Si une règle du dépôt exige une Pull Request, utiliser la branche `feat/github-pages`, dont le contenu est préparé et testé, puis intégrer la PR via les contrôles GitHub habituels.

## Budget obligatoire : 0 €

Les [conditions GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) prévoient Pages sur les dépôts publics avec GitHub Free. Un dépôt privé exige une offre compatible ; ni l’offre du compte ni sa visibilité ne sont vérifiables ici. **La visibilité du dépôt n’est pas modifiée automatiquement.** Si GitHub propose une offre payante pour Pages, arrêter cette étape : choisir explicitement si le code peut devenir public, sans souscrire à un abonnement.

Les [runners standard des dépôts publics sont gratuits](https://docs.github.com/en/billing/concepts/product-billing/github-actions). Par précaution pour le budget, le workflow ne lance pas de build sur un dépôt privé dont l’éligibilité n’a pas été vérifiée. Dans ce cas, les jobs seront marqués **skipped**, pas publiés. Aucun runner payant, service externe, cache applicatif ou achat n’est configuré. L’artefact Pages est limité à `dist/` et conservé un jour.

Aucun coût supplémentaire n’a été engagé dans l’environnement local. La publication doit rester dans les conditions et limites gratuites de GitHub ; aucun forfait payant n’est activé par cette configuration.

## Prévisualisation reproductible

```sh
npm ci
npm run build
npm test
npm run test:pages
```

Pour consulter le résultat compilé manuellement :

```sh
npm run preview -- --host 127.0.0.1 --port 4174 --strictPort
```

Ouvrir `http://127.0.0.1:4174/valoria-fc/`. Cette adresse est locale. La publication publique n’est confirmée qu’après réussite du workflow distant et ouverture réelle de l’URL GitHub Pages.
