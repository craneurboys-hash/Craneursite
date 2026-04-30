# crâneur - Documentation projet V1

## 1. Objectif

Créer un site moderne, visuel et rapide à comprendre pour le collectif parisien crâneur.

Priorités du site :

1. Events
2. Merch
3. Photos de soirées
4. Artistes

Le site doit être simple, mobile-first, immersif, avec peu de texte et beaucoup de visuels.

## 2. Décisions validées

### Structure du site

V1 en one-page :

1. Hero / Events
2. Merch
3. Galerie photo
4. Artistes
5. Footer

Navigation simple par ancres :

- Events
- Merch
- Photos
- Artistes

### Merch

Décision V1 :

- 3 t-shirts
- Pas de base de données
- Pas de compte client
- Pas de panier complexe
- Paiement via Stripe Checkout ou Stripe Payment Links
- Commandes reçues par email
- Expédition manuelle par le collectif
- Stock pas forcément garanti
- Précommande assumée si besoin

Parcours utilisateur :

1. L'utilisateur clique sur un t-shirt.
2. Une fiche produit s'ouvre sur le site.
3. Il choisit sa taille.
4. Il clique sur commander.
5. Il est envoyé vers Stripe.
6. Il paye.
7. Le collectif reçoit la commande.
8. Le collectif expédie manuellement.

### Paiement

Solution recommandée pour aller vite :

- Stripe Payment Links au début
- Un lien Stripe par produit et par taille si nécessaire
- Argent reversé ensuite vers le compte Qonto via l'IBAN Qonto configuré dans Stripe

Exemple :

- T-shirt 1 - S -> lien Stripe
- T-shirt 1 - M -> lien Stripe
- T-shirt 1 - L -> lien Stripe
- T-shirt 1 - XL -> lien Stripe

Avec 3 t-shirts et 4 tailles, cela fait 12 liens Stripe.

Cette solution évite de créer un backend au lancement.

## 3. Architecture technique V1

### Principe

Site statique ou semi-statique, sans base de données.

Les contenus sont stockés dans des fichiers du projet :

- events
- produits merch
- photos
- artistes

Le site lit ces données localement et affiche les sections.

### Stack recommandée

Option recommandée :

- Next.js
- TypeScript
- Tailwind CSS

Pourquoi :

- propre pour un site moderne
- bon support des images
- facile à faire évoluer
- compatible avec Stripe plus tard si on ajoute un backend

### Données locales

Structure prévue :

```text
data/events.ts
data/merch.ts
data/gallery.ts
data/artists.ts
```

Chaque fichier contient les données affichées sur le site.

Exemple produit :

```ts
{
  id: "tshirt-01",
  name: "T-shirt crâneur 01",
  price: "35 €",
  status: "Précommande",
  shippingDelay: "Expédition estimée sous 10 à 15 jours",
  image: "/merch/tshirt-01.jpg",
  sizes: [
    { label: "S", stripeUrl: "" },
    { label: "M", stripeUrl: "" },
    { label: "L", stripeUrl: "" },
    { label: "XL", stripeUrl: "" }
  ]
}
```

Les liens Stripe pourront être ajoutés à la fin.

## 4. Events

Objectif :

- Montrer immédiatement les prochains events
- Utiliser les affiches comme visuels principaux
- Rendre la date, le lieu et le lien billet très lisibles

Données nécessaires par event :

- nom de l'event
- date
- lieu
- ville
- affiche
- line-up
- lien billetterie ou RSVP
- statut : à venir, sold out, passé

## 5. Galerie photo

Objectif :

- Transmettre l'énergie des soirées
- Mettre les photos au centre de l'identité du site

Structure recommandée :

- Galerie masonry
- Organisation par event
- Lightbox plein écran au clic
- Swipe sur mobile
- Navigation clavier sur desktop

Données nécessaires par photo :

- image
- event associé
- date
- crédit photo si nécessaire
- ordre d'affichage

Règle V1 :

- commencer avec une sélection éditée de 12 à 30 photos
- éviter de tout publier d'un coup
- privilégier les photos fortes

## 6. Artistes

Objectif :

- Identifier les membres du collectif sans alourdir le site

Format :

- portrait circulaire
- nom
- courte description
- lien SoundCloud

Données nécessaires par artiste :

- nom
- photo
- description courte
- lien SoundCloud
- ordre d'affichage

## 7. Direction artistique

La D.A. finale dépendra des assets fournis :

- affiches
- photos de soirées
- logo
- références visuelles

Intention provisoire :

- moderne
- nocturne
- visuelle
- immersive
- club / électro / Paris
- non corporate
- non template

### Référence validée

Référence CEO ajoutée :

- Bleu mon Jules : https://bleumonjules.com/

Ce qu'on retient de cette référence :

- un site de marque avec un univers personnel fort
- une navigation simple entre collection, boutique, galerie, histoire et contact
- une grande place donnée aux images produit et aux images d'ambiance
- des collections pensées comme des chapitres
- un ton narratif qui donne l'impression d'un monde plus que d'une simple boutique
- un e-commerce intégré naturellement à l'univers de marque
- une galerie qui participe à l'identité, pas seulement à l'archive

Adaptation pour CRANEURBOYS :

- remplacer l'esprit Méditerranée / Saint-Tropez par Paris / electro / French touch
- garder l'idée de chapitres visuels : events, drops, soirées, crew
- traiter les t-shirts comme des pièces de collectif, pas comme des produits génériques
- faire de la galerie photo une preuve d'énergie et une mémoire des soirées
- garder une interface simple, directe, avec peu de texte
- éviter de copier la palette bleue / estivale de Bleu mon Jules

Piste D.A. actuelle :

- CRANEURBOYS comme univers culturel complet : events, merch, photos, artistes
- site clair, blanc dominant, avec accents bleu et rouge
- vibe electro / French touch
- landing page en actus plein écran qui défilent, inspirée de la logique Bleu mon Jules
- merchandising présenté comme un drop éditorial
- photos de soirée utilisées comme matière principale
- ton court, assumé, non corporate

Décision CEO ajoutée :

- garder un univers clair
- background blanc
- couleurs principales : bleu + rouge
- beaucoup d'images et de vidéos
- landing page type actus comme Bleu mon Jules
- les actus passent les unes après les autres
- chaque actu affiche une image plein écran + un gros titre blanc
- pas de texte explicatif inutile

Implémentation actuelle :

- header blanc fixe
- landing actus dans `components/landing-news.tsx`
- slide 1 : futur event avec `public/da/r-and-b.jpeg`, titre `R&B`
- slide 2 : nouvelle collection avec `public/da/IMG_0624.JPG`, titre `T-shirts`
- slide 3 : galerie photo avec `public/da/photo-gallery-cover.jpeg`, titre `Retrouvez vous en photo`
- les images de la landing doivent être affichées en entier, sans crop
- fond de landing blanc derrière les images
- dégradé landing harmonisé avec `#1E2040` et intensité réduite
- `Vector1.png` est utilisé comme décor fixe de landing
- seules les images des actus défilent dans la zone vide du mockup
- overlay responsive actif : `public/da/vector1-frame-overlay.png`
- zone intérieure du cadre détectée : `x=909`, `y=211`, `w=1186`, `h=905`
- mockup affiché en cover plein écran pour éviter les bandes blanches sur les côtés
- la zone actus reste liée au même référentiel que le mockup
- images des actus affichées en cover dans le cadre pour ne jamais dépasser
- texte contraint dans le cadre avec taille responsive mobile
- images du dossier `DA` copiées dans `public/da`
- placeholders génériques progressivement remplacés par assets locaux
- rotation automatique toutes les 4,2 secondes
- indicateurs manuels en bas à droite

## 8. Questions CEO restantes

### Identité

Décision :

- le logo SVG remplace le texte `CRANEURBOYS` dans le header
- source originale : `DA/Export - logo copie.svg`
- copie publique : `public/da/logo-craneurboys.svg`
- nouveau logo actif : `DA/EXP - BleuCOULEURS.png`
- copie publique active : `public/da/logo-craneurboys-new.png`
- version recadrée active dans le header : `public/da/logo-craneurboys-new-cropped.png`
- ombre supprimée
- vide interne du PNG supprimé pour que le texte du logo prenne toute la hauteur du header
- mini padding vertical ajouté autour du logo
- liens du header harmonisés avec la teinte bleue du logo
- teinte officielle logo/header : `#1E2040`

1. Nom exact à afficher : crâneur, Crâneur, CRÂNEUR ?
2. Avez-vous un logo existant ?
3. Quels sont les 3 mots qui définissent le collectif ?
4. Couleurs interdites ou obligatoires ?

### Events

1. Combien d'events pour la V1 ?
2. Pour chaque event : date, lieu, line-up, affiche, lien billet ?
3. Le CTA principal doit dire quoi : Billetterie, RSVP, Infos, Réserver ?

### Merch

1. Prix des 3 t-shirts ?
2. Tailles disponibles ?
3. Frais de port fixes ou gratuits ?
4. Pays livrés : France seulement ou Europe ?
5. Délai de production / expédition annoncé ?
6. Email qui reçoit les commandes ?
7. Photos ou mockups des t-shirts ?

### Stripe

1. Le compte Stripe est-il créé ?
2. L'IBAN Qonto est-il ajouté dans Stripe ?
3. Stripe collecte-t-il l'adresse de livraison ?
4. Faut-il créer un lien par taille ou un paiement plus avancé plus tard ?

### Photos

1. Combien de photos disponibles ?
2. Organisation par event ou galerie globale ?
3. Y a-t-il des crédits photo à afficher ?
4. Toutes les personnes visibles sont-elles publiables ?

### Artistes

1. Combien d'artistes ?
2. Photos disponibles ?
3. Liens SoundCloud ?
4. Bio courte pour chaque artiste ?

## 9. Ce qu'on ne fait pas en V1

Pour garder le projet rapide et propre :

- pas de base de données
- pas de compte client
- pas de panier complexe
- pas de CMS au début
- pas d'interface admin
- pas de marketplace
- pas d'embeds SoundCloud lourds partout
- pas de galerie exhaustive non triée

Ces éléments pourront être ajoutés après validation de la V1.

## 10. Ordre de build recommandé

1. Créer la base Next.js
2. Poser la structure one-page
3. Intégrer des données placeholder
4. Créer la section Events
5. Créer la section Merch avec fiche produit et choix taille
6. Brancher les liens Stripe quand ils seront prêts
7. Créer la galerie photo
8. Créer la section Artistes
9. Ajuster la D.A. avec les vrais assets
10. Tester mobile, desktop et performance images

## 11. Assets à fournir

Priorité 1 :

- logo ou nom exact
- affiches events
- photos des 3 t-shirts ou mockups
- infos des 3 t-shirts
- email de commande

Priorité 2 :

- photos de soirées
- photos artistes
- liens SoundCloud
- références visuelles

Priorité 3 :

- textes courts
- crédits photo
- mentions légales
