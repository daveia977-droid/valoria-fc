# Voir le vrai site sur son PC — sans hébergement

## Pourquoi « Archive previews aren't supported yet » ?

Un fichier ZIP contient les sources. Le lecteur de fichiers de Codex ne l’exécute pas comme une application web ; ouvrir l’archive n’ouvre donc pas le site. Il faut télécharger, extraire et lancer le serveur Vite.

Dans l’environnement cloud, `sites-preview status` signale `preview relay unavailable: No such file or directory`. Il n’y a donc pas d’URL d’aperçu partagé vérifiée. Le serveur local et le navigateur Chromium fonctionnent : les tests, captures et vidéos proviennent de l’application réellement exécutée.

## Windows — étapes exactes

1. Télécharger la dernière archive `valoria-3d-source.zip` comme fichier, puis utiliser **Extraire tout**. Ne pas essayer de la consulter comme un aperçu interactif.
2. Ouvrir le dossier extrait qui contient **package.json**, **index.html** et le dossier **src**.
3. Dans la barre d’adresse de l’Explorateur Windows, saisir `powershell` puis Entrée : le terminal s’ouvre dans ce dossier.
4. Vérifier les prérequis :

```powershell
node --version
npm.cmd --version
```

Node.js 24 est recommandé. Si Node est absent, son installation officielle depuis https://nodejs.org/ est gratuite et ne nécessite pas de carte bancaire. Ne pas acheter un outil de serveur web.

5. Dans le même terminal :

```powershell
npm.cmd ci
npm.cmd run dev -- --host 127.0.0.1 --port 4173 --strictPort
```

6. Ouvrir dans son navigateur l’adresse affichée à la ligne **Local:** par Vite. Garder le terminal ouvert pendant la consultation. Le site est exécuté sur le PC ; aucune publication n’est effectuée.
7. Pour arrêter le serveur : **Ctrl+C** dans le terminal.

Pour la tenue 3D : ouvrir **Collection**, puis **Explorer le domicile V1 en 3D**. Souris ou doigt pour tourner, boutons pour la face et le dos, curseur de rotation et commandes de zoom. Le fichier GLB est déjà fourni ; Blender n’est pas nécessaire pour consulter le site. WebGL 2 est nécessaire uniquement pour cette vue. La collection 2D reste accessible si la 3D est indisponible.

`npm.cmd` évite le blocage éventuel du script PowerShell `npm.ps1` ; aucune modification de la politique d’exécution n’est nécessaire. Si le port est déjà occupé, arrêter le serveur Vite de son autre fenêtre ou choisir `--port 4175`.

## macOS / Linux

Depuis le dossier contenant package.json :

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 4173 --strictPort
```

Ouvrir l’adresse **Local:** affichée par Vite. Ne pas ouvrir directement index.html par double-clic : ses modules et ses chemins de ressources sont servis par Vite.

## Contrôler le résultat compilé et les tests

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4174 --strictPort
```

Ces commandes sont locales et ne constituent pas un déploiement. Pour les tests : `npm test` ; si le navigateur de Playwright n’est pas installé sur ce PC, `npx playwright install chromium` le prépare. Les commandes correspondantes sous PowerShell peuvent utiliser `npm.cmd` / `npx.cmd`.

Le site utilise des polices et visuels locaux, sans API, clé, essai payant ou compte d’hébergement. L’installation initiale des dépendances nécessite une connexion au registre npm, sans abonnement à un service applicatif.
