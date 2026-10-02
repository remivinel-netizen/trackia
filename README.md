# Trackia — landing page

Page de vente de la formation Trackia (297 €). Site statique : aucun build, aucune
dépendance, aucun framework. Trois fichiers portent tout le site.

```
index.html              la page de vente
assets/styles.css       toute la mise en forme
assets/main.js          le lien de paiement + les détails d'interface
assets/og.png           l'image de partage (réseaux sociaux, messageries)
assets/brand/           le kit logo (piste 3a radar) : SVG, PNG, icônes
favicon.ico, apple-touch-icon.png, site.webmanifest   icônes d'onglet et d'écran d'accueil
mentions-legales.html   modèles à compléter avant mise en ligne
cgv.html
confidentialite.html
_headers                en-têtes de sécurité et de cache (lus par Cloudflare Pages)
```

## À faire avant la mise en ligne

1. **Brancher le paiement.** Ouvrez `assets/main.js`, collez votre lien de paiement
   (Stripe Payment Link, Lemon Squeezy, Systeme.io…) dans `CHECKOUT_URL`. Tant qu'il
   est vide, les boutons descendent simplement jusqu'à la section Prix.
2. **Compléter les trois pages légales.** Les passages à remplir sont surlignés en
   bleu, repérables par la mention « À compléter ».
3. **Arbitrer la garantie 14 jours.** Elle apparaît sous le bouton d'achat dans
   `index.html` (bloc `price__guarantee`, signalé par un commentaire) et à l'article 5
   des CGV. Supprimez les deux si vous ne voulez pas vous y engager.
4. **Remplacer le domaine.** `trackia.fr` apparaît dans les balises `og:`, la balise
   `canonical`, `robots.txt` et `sitemap.xml`.
5. **Adresse de contact.** `contact@trackia.fr` apparaît dans les pieds de page.

## Aperçu en local

```
python3 -m http.server 4321
```

Puis ouvrir http://localhost:4321

## Mise en ligne sur Cloudflare Pages

1. Dash Cloudflare → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Choisir ce dépôt.
3. Build command : *laisser vide*. Build output directory : `/`
4. **Save and Deploy**. Chaque `git push` sur `main` redéploie la page.
5. Domaine : onglet **Custom domains** du projet Pages.

Le fichier `_headers` est pris en compte automatiquement par Cloudflare Pages.

## Logo

Le logo est le radar 3a (cercle ouvert, faisceau, cible détectée). L'en-tête des quatre
pages affiche `assets/brand/trackia-logo-animated-white.svg` : le faisceau tourne et la
cible clignote, sauf si le visiteur a demandé moins d'animations dans ses réglages.

Autres fichiers utiles dans `assets/brand/` :

- `trackia-logo.svg` et `trackia-logo-white.svg` : logo fixe, fond clair ou sombre
- `trackia-logo-1200.png` et `trackia-logo-white-1200.png` : pour les mails et les PDF
- `trackia-avatar-400.png` : photo de profil (LinkedIn, Stripe, Google Business)

Couleurs du logo : encre `#0d1a32`, bleu `#1874ed`, bleu sur fond sombre `#5b9eff`.
