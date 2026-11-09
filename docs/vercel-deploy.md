# Déployer VALORIA FC sur Vercel

Vercel est la cible d’hébergement choisie. Cette configuration prépare le déploiement ; elle ne crée ni compte, ni projet distant, ni URL publique.

## Configuration du projet

Le fichier `vercel.json` déclare :

- Framework : Vite.
- Commande de compilation : `npm run build`.
- Dossier publié : `dist`.
- En-têtes : `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`.

Vercel installe les dépendances à partir de `package.json` et du verrou npm. Choisir Node.js 24.x dans les paramètres du projet. Aucune variable secrète n’est nécessaire pour ce site statique.

## Avant l’import

Le code actuel se trouve sur la branche locale `feat/valoria-v1`, avec des modifications non commitées. Un import GitHub ne peut récupérer que les fichiers enregistrés et poussés sur GitHub. Après revue des changements, enregistrer et pousser cette branche selon le workflow du dépôt. Ne pas modifier `main` uniquement pour obtenir une prévisualisation.

Vérifier depuis la racine du projet :

```sh
npm ci
npm run build
npm test
```

Pour ouvrir localement la compilation de production :

```sh
npm run preview -- --port 4174 --strictPort
```

## Import GitHub et prévisualisation

1. Se connecter à [Vercel](https://vercel.com/) avec le compte qui hébergera le site.
2. Créer un projet et importer `daveia977-droid/valoria-fc` après avoir autorisé l’accès à ce dépôt.
3. Utiliser la racine du dépôt comme dossier du projet. Conserver les réglages Vite, `npm run build` et `dist` définis dans `vercel.json`.
4. Choisir la branche publiée souhaitée. Pour tester la branche de travail, créer un déploiement de prévisualisation de `feat/valoria-v1` après son push ; réserver la branche de production à la version validée.
5. Lancer le déploiement depuis Vercel. L’URL n’existe qu’après la réussite effective de cette opération. Les liens de prévisualisation peuvent demander une connexion selon les paramètres de protection du compte.
6. Vérifier sur l’URL générée : chargement des images et polices, mouvement et pause, navigation mobile, choix des quatre tenues sans sponsor, téléchargement du brouillon et fermeture des dialogues.

Le formulaire continue à télécharger un brouillon local : l’hébergement sur Vercel ne configure pas un envoi d’e-mail.

## Publication et retour arrière

Après validation du contenu et des visuels, utiliser le déploiement de production et éventuellement connecter un nom de domaine dans Vercel. Avant cette publication, fournir les coordonnées et mentions légales adaptées au responsable réel du site.

Conserver le déploiement précédent. Si la nouvelle version pose problème, sélectionner le précédent déploiement fonctionnel et utiliser l’action de restauration ou de promotion disponible dans Vercel. Une modification locale ou un changement de configuration dans ce dépôt ne restaure pas automatiquement un site distant.

## État actuel

- Configuration Vercel enregistrée dans le code.
- Ancienne configuration Netlify retirée.
- Aucun identifiant ou token stocké dans le front-end.
- Aucun commit, push GitHub, projet Vercel, déploiement ou lien public créé par cette préparation.
