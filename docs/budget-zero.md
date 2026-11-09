# Règle permanente : budget du projet 0 €

## Mission d’hébergement suivante : GitHub Pages

L’utilisateur a choisi GitHub Pages et autorisé sa configuration et sa publication après tests. Voir `docs/github-pages.md`. Cette autorisation ne concerne ni Vercel ni un autre hébergeur. Le workflow utilise des actions officielles épinglées, un runner Ubuntu standard, aucun cache supplémentaire et un artefact `dist/` conservé un jour. Les builds de dépôt privé sont bloqués tant que l’offre gratuite n’est pas vérifiée. Aucun abonnement, achat, domaine ou jeton personnel n’est ajouté. La visibilité du dépôt et l’offre du compte ne sont pas modifiées.

Le budget est prioritaire et inscrit dans `AGENTS.md` pour les prochaines phases. Projet personnel fictif, sans activité commerciale réelle.

## Décisions de la phase 3 initiale

- Aucune souscription, aucun achat, aucun essai, aucune carte bancaire et aucune activation de service externe.
- Aucune génération d’image, acquisition de modèle 3D ou nouvelle ressource facturée à l’utilisation.
- Aucune dépendance ajoutée : `package.json` et `package-lock.json` sont inchangés.
- Images, écusson et maillots réutilisés sans modification de fichier ; effets réalisés en CSS et JavaScript natifs. Le recadrage enlève uniquement des marges vides d’affichage, sans créer de détails.
- Polices locales existantes ; aucune police achetée ou chargée depuis un CDN.
- Serveur Vite, tests Chromium/Playwright et encodage local de la vidéo avec les outils déjà présents.
- Aucun déploiement ni demande de secret ; `vercel.json` n’est pas modifié.
- Les nouveaux tests vérifient qu’aucune requête HTTP de l’application ne cible une origine externe pendant le parcours testé.

## Licences inspectées dans les paquets présents

| Ressource | Version installée | Licence | Usage dans le projet |
| --- | --- | --- | --- |
| Vite | 7.3.7 | MIT | Développement et compilation locaux. |
| Playwright Test | 1.65.0 | Apache-2.0 | Tests locaux, pas de service de tests payant. |
| axe-core | 4.14.0 | MPL-2.0 | Contrôle d’accessibilité local ; aucun code de la bibliothèque modifié. |
| Phosphor Icons | 2.1.1 | MIT | Icônes existantes ; licence déjà distribuée. |
| Manrope via Fontsource | 5.3.0 | OFL-1.1 | Police locale existante. |
| Cormorant Garamond via Fontsource | 5.3.0 | OFL-1.1 | Police locale existante. |

Ces licences permettent l’utilisation personnelle sans achat. Leurs obligations de conservation des notices restent applicables ; les notices des polices et icônes sont dans `public/licenses/`. Les autres notices restent présentes dans les paquets installés. Aucun SDK ou actif propriétaire de la référence Laocoön n’est intégré.

## Ajout ultérieur : tenue V1 réellement en 3D

- Three.js 0.187.0 : licence MIT vérifiée dans le paquet installé ; copie distribuée dans `public/licenses/Three.txt`. Seule dépendance ajoutée, nécessaire au véritable rendu interactif d’un GLB. Chargement à la demande, pas de plateforme de visualisation distante.
- Blender 4.3.2 : outil local déjà installé, licence GPL-2+ vérifiée dans `/usr/share/doc/blender/copyright`. Géométrie originale procédurale, aucun modèle téléchargé ou acheté.
- Pillow 13.0.0 : préparation locale de la texture depuis les pixels du visuel existant ; licence MIT-CMU vérifiée dans la distribution installée. Aucun service de génération d’image.
- Aucun abonnement, carte bancaire, essai, compte de modèle ou service facturé activé. Les images officielles ne sont pas modifiées.
- L’utilisateur a ensuite autorisé le déploiement. À cette date, l’API Vercel est bloquée par la politique réseau (403) et aucune connexion Vercel n’est configurée : aucune publication ni activation d’hébergement n’a eu lieu. Les conditions actuelles de Hobby et les quotas du compte doivent être vérifiés avant publication ; ne pas sélectionner Pro, un essai ou un service payant.

## Avant toute intégration future

Vérifier la licence de la version choisie, l’existence d’un véritable palier gratuit, ses quotas, la carte bancaire éventuelle, le dépassement facturé et les conditions d’usage personnel. Un essai temporaire ne suffit pas. Préférer l’outil local ou l’actif déjà disponible lorsque le coût ne peut pas être confirmé.

L’hébergement n’est pas utilisé pendant cette phase. Aucune promesse de gratuité permanente de Vercel ou d’un autre fournisseur n’est faite : leurs offres et limites doivent être vérifiées avant un éventuel choix futur, en restant dans 0 €. Un domaine personnalisé n’est pas nécessaire et ne doit pas être acheté.

## Limite de vérification financière

L’absence d’achat et de nouvelle activation facturable dans cette phase est vérifiable par les opérations réalisées. La facturation du compte Codex/ChatGPT, les frais historiques de générations antérieures, les équipements et la connexion de l’utilisateur ne sont pas visibles ici ; ils ne sont pas certifiés à 0 €. Aucun nouvel outil de génération potentiellement facturable n’a été utilisé.
