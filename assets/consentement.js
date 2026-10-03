/* ───────────────────────────────────────────────────────────
   Trackia — bandeau cookies et mode consentement Google (v2)

   Chargé dans le <head> de chaque page, AVANT Google Tag Manager :
   tout est refusé par défaut, et rien n'est mesuré tant que le
   visiteur n'a pas cliqué sur « Accepter ». Le choix est retenu
   6 mois ; le lien « Gérer les cookies » du pied de page le rouvre.
   ─────────────────────────────────────────────────────────── */
(() => {
  "use strict";

  const CLE = "trackia_consentement";
  const DUREE = 182 * 24 * 60 * 60 * 1000; // 6 mois

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  const tout = (etat) => ({
    ad_storage: etat, ad_user_data: etat, ad_personalization: etat, analytics_storage: etat,
  });
  gtag("consent", "default", { ...tout("denied"), wait_for_update: 500 });

  let choix = null;
  try {
    const memo = JSON.parse(localStorage.getItem(CLE) || "null");
    if (memo && memo.date + DUREE > Date.now()) choix = memo.choix;
  } catch (e) { /* stockage indisponible : le bandeau s'affichera */ }

  if (choix === "accepte") gtag("consent", "update", tout("granted"));
  // lu par le script Trackia (GTM) : la source du clic n'est retenue qu'après « Accepter »
  window.trackiaConsentement = choix;

  const enregistrer = (valeur) => {
    try { localStorage.setItem(CLE, JSON.stringify({ choix: valeur, date: Date.now() })); } catch (e) {}
    gtag("consent", "update", tout(valeur === "accepte" ? "granted" : "denied"));
    window.trackiaConsentement = valeur;
    if (valeur === "accepte" && typeof window.trackiaApresConsentement === "function") window.trackiaApresConsentement();
    if (valeur === "refuse") { try { localStorage.removeItem("trackia_source"); } catch (e) {} }
    window.dataLayer.push({ event: "trackia_consentement", consentement: valeur });
  };

  const afficher = () => {
    if (document.getElementById("bandeau-cookies")) return;
    const lienConfidentialite = document.querySelector('a[href$="confidentialite.html"]');
    const bandeau = document.createElement("div");
    bandeau.id = "bandeau-cookies";
    bandeau.className = "cookies";
    bandeau.setAttribute("role", "dialog");
    bandeau.setAttribute("aria-label", "Cookies");
    bandeau.innerHTML =
      `<p>Nous utilisons des cookies pour mesurer l'audience du site et l'efficacité de nos publicités. ` +
      `Rien n'est déposé sans votre accord. ` +
      `<a href="${lienConfidentialite ? lienConfidentialite.getAttribute("href") : "/confidentialite.html"}">En savoir plus</a></p>` +
      `<div class="cookies__boutons">` +
      `<button type="button" class="bouton bouton--clair bouton--petit" data-choix="refuse">Refuser</button>` +
      `<button type="button" class="bouton bouton--petit" data-choix="accepte">Accepter</button></div>`;
    bandeau.addEventListener("click", (e) => {
      const bouton = e.target.closest("[data-choix]");
      if (!bouton) return;
      enregistrer(bouton.dataset.choix);
      bandeau.remove();
    });
    document.body.appendChild(bandeau);
  };

  // le lien « Gérer les cookies » du pied de page rouvre le bandeau
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-cookies]")) { e.preventDefault(); afficher(); }
  });

  if (!choix) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", afficher);
    else afficher();
  }
})();
