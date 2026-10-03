# Trackia — landing page

Page de vente de la formation Trackia (397 €). Site statique : aucun build, aucune
dépendance, aucun framework. Trois fichiers portent tout le site.

```
index.html              la page de vente
assets/styles.css       toute la mise en forme
assets/main.js          le lien de paiement + les détails d'interface
assets/og-397.png           l'image de partage (réseaux sociaux, messageries)
assets/brand/           le kit logo (piste 3a radar) : SVG, PNG, icônes
favicon.ico, apple-touch-icon.png, site.webmanifest   icônes d'onglet et d'écran d'accueil
mentions-legales.html   modèles à compléter avant mise en ligne
cgv.html
confidentialite.html
_headers                en-têtes de sécurité et de cache (lus par Cloudflare Pages)
```

## À faire avant la mise en ligne

1. **Brancher le paiement.** Ouvrez `assets/main.js`, collez votre lien de paiement
   (lien de paiement Mollie) dans `LIEN_PAIEMENT`. Tant qu'il
   est vide, les boutons descendent simplement jusqu'à la section Prix.
2. **Pages légales.** Mentions légales, CGV et confidentialité sont remplies (EI Rémi Vinel,
   SIREN 902 709 807, franchise de TVA, paiement Mollie, vente réservée aux professionnels).
3. **Arbitrer la garantie 14 jours.** Elle apparaît sous le bouton d'achat dans
   `index.html` (bloc `price__guarantee`, signalé par un commentaire) et à l'article 5
   des CGV. Supprimez les deux si vous ne voulez pas vous y engager.
4. **Remplacer le domaine.** Le site est actuellement publié sur GitHub Pages, et
   les URL absolues pointent donc vers `https://remivinel-netizen.github.io/trackia`.
   Le jour où vous branchez votre domaine, remplacez-les aux quatre endroits suivants
   — et nulle part ailleurs, les adresses e-mail `@trackia.fr` ne changent pas :

   | Fichier       | Ligne                                      |
   | ------------- | ------------------------------------------ |
   | `index.html`  | `<link rel="canonical" …>`                 |
   | `index.html`  | `<meta property="og:url" …>`               |
   | `index.html`  | `<meta property="og:image" …>`             |
   | `robots.txt`  | la ligne `Sitemap:`                        |
   | `sitemap.xml` | la balise `<loc>`                           |

   En une commande, depuis la racine du dépôt :

   ```
   grep -rl "remivinel-netizen.github.io/trackia" --include=*.html --include=*.txt --include=*.xml . \
     | xargs sed -i '' 's|https://remivinel-netizen.github.io/trackia|https://VOTRE-DOMAINE.fr|g'
   ```
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

## Photos

Les photos de personnes (`assets/img/pq-*`, `claude-pro*`, `resultat*`) viennent
d'Unsplash, licence gratuite avec usage commercial autorisé et sans attribution
obligatoire. Identifiants Unsplash : artisan `lQIUbkn6jj4`, commerce `0e2eYxBiP6A`,
cabinet `5RQnUp_-5OU`, PME `UikYLDQj9_I`, claude-pro `vaWgZAE9HFw`,
résultat `s3hlZ-gdfdQ` (page : `https://unsplash.com/photos/<identifiant>`).

## Logo

Le logo est le radar 3a (cercle ouvert, faisceau, cible détectée). L'en-tête des quatre
pages affiche `assets/brand/trackia-logo-animated-white.svg` : le faisceau tourne et la
cible clignote, sauf si le visiteur a demandé moins d'animations dans ses réglages.

Autres fichiers utiles dans `assets/brand/` :

- `trackia-logo.svg` et `trackia-logo-white.svg` : logo fixe, fond clair ou sombre
- `trackia-logo-1200.png` et `trackia-logo-white-1200.png` : pour les mails et les PDF
- `trackia-avatar-400.png` : photo de profil (LinkedIn, Mollie, Google Business)

Couleurs du logo : encre `#0d1a32`, bleu `#1874ed`, bleu sur fond sombre `#5b9eff`.
