# VALORIA FC V6 — boutique, panier et conditions de mise en production

**Version :** V6 (18 novembre 2026)  
**Projet Vercel :** `valoria-fc` / GitHub `daveia977-droid/valoria-fc`  
**Paiement actuel :** démonstration sans transaction (aucun prestataire configuré).

## Réalisé

- 8 produits : maillots Domicile, Extérieur, Third ; écharpe, gants, chaussettes, casquette et gourde.
- 5 photographies conceptuelles VALORIA générées, recadrées depuis une planche WebP unique (1 500 × 300 px, faible poids), servies localement. Les SVG anciens restent archivés mais ne sont plus affichés dans la boutique.
- 3 maillots affichés sur fond ivoire, avec l'atlas officiel et le masque `collection-mask.png`, sans retoucher les maillots ni le sponsor NW$.
- Filtres, prix indicatifs en euros, fiches produits, tailles, quantités, panier modifiable et suppression d'articles.
- Panier conservé uniquement dans `sessionStorage`, date de livraison souhaitée de J+7 à J+75, récapitulatif et confirmation locale. Aucun numéro de commande, adresse, compte ou paiement récolté.
- Ce ne sont **pas des commandes réelles**, aucune disponibilité ou livraison n'est garantie et aucune confirmation n'est envoyée à un vendeur.

## Barème VALORIA (prix de présentation non contractuels)

| Article | Prix affiché |
| --- | ---: |
| Maillot Domicile | 100 € |
| Maillot Extérieur | 100 € |
| Maillot Third | 100 € |
| Écharpe VALORIA | 30 € |
| Gants d'entraînement | 30 € |
| Chaussettes club | 20 € |
| Casquette VALORIA | 30 € |
| Gourde VALORIA | 30 € |

Les prix s'inspirent des fourchettes des produits accessibles sur le [Real Madrid Store](https://shop.realmadrid.com/fr-fr). Sources commerciales publiques : [maillots](https://shop.realmadrid.com/fr-fr/collections/jerseys-kits-home-mens), [écharpes](https://shop.realmadrid.com/fr-fr/collections/scarves), [gants](https://shop.realmadrid.com/fr-fr/collections/gloves), [chaussettes](https://shop.realmadrid.com/fr-fr/collections/socks), [casquettes](https://shop.realmadrid.com/fr-fr/collections/caps), [gourdes](https://shop.realmadrid.com/fr-fr/collections/drinkware-water-bottles). Ces tarifs externes ne créent ni partenariat ni licence commerciale.

## Pour activer un paiement réel dans une version ultérieure

1. Vérifier l'entité vendeuse, les mentions légales, l'immatriculation et les obligations fiscales adaptées à la situation de l'éditeur.
2. Préparer et publier des **CGV de vente** applicables (prix TTC, livraison, rétractation, délais, modalités de remboursement), un contact vendeur et une politique de confidentialité adaptés aux données de commande.
3. Disposer du stock ou d'une logistique de fabrication/expédition et d'une politique de dates de livraison réaliste. Une date demandée ne doit pas être une promesse automatique.
4. Connecter un prestataire de paiement reconnu (par exemple Stripe Checkout ou Stripe Payment Links), configuré au **nom du vendeur** avec vérification de compte (KYC). Ne jamais mettre de clé secrète dans le JavaScript frontend, ni simuler une confirmation de paiement avant confirmation serveur/PSP.
5. Valider la compatibilité de l'offre d'hébergement avec une activité commerciale réelle.
6. Tester les paiements en mode test (succès, échec, abandon et remboursement) et sécuriser les notifications de paiement. Publier en production seulement après revue.

**Niveau de certitude :** le code et le déploiement doivent être vérifiés par build, et les tests Playwright exécutés dans un navigateur pour déclarer le flux complet testé. Les CGU et mentions de simulation doivent rester visibles tant que le paiement est inactif.
