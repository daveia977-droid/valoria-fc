# Laocoön — référence de motion design

## État de l’accès

Référence demandée : https://www.getlayers.ai/layer/laocoon.

Tentative du 8 novembre 2026 depuis l’environnement cloud : la connexion HTTPS via le proxy fourni renvoie `CONNECT tunnel failed, response 403`. La politique réseau active est restreinte et n’autorise pas encore `www.getlayers.ai` ou `getlayers.ai`. Les deux domaines ont été ajoutés au **brouillon** des paramètres ; cette sauvegarde ne les active pas dans l’instance courante.

La capture et l’analyse des animations réelles sont donc bloquées. Aucune observation visuelle, durée de transition, technique WebGL, bibliothèque ou comportement mobile de Laocoön n’est revendiqué. Les erreurs d’accès ne sont pas des captures acceptées du site.

## Objectifs fournis par l’utilisateur — pas des observations de la référence

1. Analyser la progression au défilement, les transitions entre scènes, la lumière et la mise en scène 3D.
2. Adapter ces techniques autour de l’écusson officiel aux deux ailes dorées croisées ; adopter la nouvelle palette noir, bordeaux, or et crème, avec violet sur le troisième maillot.
3. Construire une présentation immersive des quatre maillots, toujours sans sponsor.
4. Conserver navigation libre, fluidité mobile, pause des animations et préférence de mouvement réduit.
5. Créer les visuels VALORIA FC sans copier les sculptures, textes ou actifs artistiques de la référence.
6. Utiliser Vercel comme cible d’hébergement, sans déploiement implicite.

## Éléments disponibles et limites

- L’écusson et les maillots existent sous forme d’images web adaptées des références de l’utilisateur. Aucun modèle 3D d’écusson n’a été fourni ou créé ; le flottement actuel de l’écusson est une animation d’image.
- Le prompt technique « Bronze and Time × VALORIA FC » est maintenant reçu. La confirmation ultérieure de l’utilisateur maintient les quatre maillots sans sponsor, malgré la mention « Victoria » dans ce prompt. L’analyse du dépôt et l’architecture proposée sont consignées dans `architecture-cinematique.md`.
- La V1 possède déjà des animations natives et des tests. Cette étape n’a pas modifié ses animations : elle n’est pas présentée comme une adaptation vérifiée de Laocoön.

## Reprise prévue après activation de l’accès

1. Vérifier la politique réseau appliquée et tester une nouvelle connexion HTTPS.
2. Capturer et inspecter le début, les scènes intermédiaires, la fin, les transitions et une vue mobile ; distinguer les séquences pilotées par le défilement des animations autonomes.
3. Écrire les observations à partir des captures acceptées. Si la page exige une connexion ou des domaines supplémentaires, signaler ce blocage précisément.
4. Adapter la mise en scène au blason et à la collection ; définir un rendu léger et une solution de repli avant d’ajouter des dépendances.
5. Vérifier les scènes sur plusieurs largeurs, au clavier et en mouvement réduit ; recapturer le résultat pour comparaison.

final result: blocked
