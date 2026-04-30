# Merch Stock + Paiement

Le site utilise Google Sheets comme source de stock, Stripe Checkout pour le paiement, et Resend pour envoyer un mail admin apres achat.

## Google Sheet

Créer deux onglets :

### `Stock`

Ligne 1 :

```text
productId | nom | taille | stock | prix | stripePriceId
```

Exemple :

```text
tshirt-03 | T-shirt 03 | S  | 10 | 30 EUR | price_...
tshirt-03 | T-shirt 03 | M  | 8  | 30 EUR | price_...
tshirt-03 | T-shirt 03 | L  | 0  | 30 EUR | price_...
tshirt-03 | T-shirt 03 | XL | 3  | 30 EUR | price_...
```

Si `stock` vaut `0`, le site affiche la taille en rupture.

### `Orders`

Ligne 1 :

```text
orderId | date | email | items | status | nom | adresse | complement | codePostal | ville | pays | livraison
```

Le webhook Stripe écrit ici pour éviter de décrémenter deux fois le stock si Stripe renvoie le même événement.

## Import rapide

Deux modèles CSV sont fournis :

```text
docs/google-sheet-template/Stock.csv
docs/google-sheet-template/Orders.csv
```

Dans Google Sheets :

1. Créer un nouveau fichier Google Sheet.
2. Renommer le premier onglet `Stock`.
3. Importer `Stock.csv` dans cet onglet.
4. Créer un deuxième onglet nommé `Orders`.
5. Importer `Orders.csv` dans cet onglet.
6. Remplacer les stocks `0` par les vrais nombres.
7. Ajouter le prix affiché dans `prix`.
8. Ajouter les `price_...` Stripe dans la colonne `stripePriceId`.

## Google Cloud

1. Créer un projet Google Cloud.
2. Activer `Google Sheets API`.
3. Créer un `Service Account`.
4. Générer une clé JSON.
5. Partager le Google Sheet avec l'email du service account en `Editeur`.
6. Copier `client_email` dans `GOOGLE_SERVICE_ACCOUNT_EMAIL`.
7. Copier `private_key` dans `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`.

## Stripe

1. Créer les produits/prix Stripe pour chaque taille.
2. Copier chaque `price_...` dans la colonne `stripePriceId`.
3. Ajouter `STRIPE_SECRET_KEY` dans `.env.local`.
4. Créer un webhook Stripe vers :

```text
https://ton-domaine.com/api/stripe/webhook
```

Evénement requis :

```text
checkout.session.completed
```

5. Copier le secret `whsec_...` dans `STRIPE_WEBHOOK_SECRET`.

## Mail

Les mails partent via Resend si `RESEND_API_KEY` est configuré.

Deux mails sont envoyés après paiement confirmé par webhook Stripe :

```text
1. Mail admin vers ORDER_NOTIFICATION_EMAIL
2. Mail client vers l'email saisi au checkout
```

Par défaut, le mail admin va vers :

```text
craneurboys@gmail.com
```

## Local

Copier `.env.example` vers `.env.local`, remplir les valeurs, puis relancer :

```bash
npm run dev
```

Tester le stock :

```text
http://localhost:3000/api/stock
```
