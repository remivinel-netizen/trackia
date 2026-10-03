/* ───────────────────────────────────────────────────────────
   Trackia — une seule chose à modifier ici.

   Collez ci-dessous le lien de votre page de paiement
   (lien de paiement Stripe, « Payment Link »).
   Tant qu'il est vide, les boutons d'achat descendent
   simplement jusqu'à la section Prix.
   ─────────────────────────────────────────────────────────── */
const LIEN_PAIEMENT = "https://buy.stripe.com/fZu5kv54j3sH29V9g04ZG00";

(() => {
  "use strict";

  if (LIEN_PAIEMENT) {
    for (const el of document.querySelectorAll(".js-acheter")) {
      el.href = LIEN_PAIEMENT;
      el.rel = "noopener";
    }
  }

  // filet sous l'en-tête dès qu'on quitte le haut de page
  const entete = document.getElementById("entete");
  if (entete) {
    const marquer = () => entete.classList.toggle("colle", scrollY > 8);
    marquer();
    addEventListener("scroll", marquer, { passive: true });
  }

  // formulaire de contact : la page ne se recharge pas. L'envoi vers Make
  // est fait par le script Trackia (GTM), qui écoute l'envoi avant ce code.
  const formulaire = document.getElementById("formulaire-contact");
  if (formulaire) {
    formulaire.addEventListener("submit", (e) => {
      e.preventDefault();
      const merci = document.createElement("p");
      merci.className = "contact__merci";
      merci.setAttribute("role", "status");
      merci.textContent = "Merci, votre question est bien partie. Réponse sous 24 h ouvrées, à l'adresse indiquée.";
      formulaire.replaceChildren(merci);
    });
  }

  // une seule question ouverte à la fois
  const questions = document.querySelectorAll(".faq details");
  for (const d of questions) {
    d.addEventListener("toggle", () => {
      if (!d.open) return;
      for (const autre of questions) if (autre !== d) autre.open = false;
    });
  }

  // apparition au défilement, une seule fois par élément
  const cibles = document.querySelectorAll(".anim");
  const doux = matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (doux || !("IntersectionObserver" in window)) {
    for (const el of cibles) el.classList.add("vu");
    return;
  }

  // cascade : dans une grille ou une liste, chaque élément
  // apparaît un peu après le précédent
  const cascades = ".cartes,.profils,.etapes,.modules,.acquis,.chiffres__liste,.colonnes,.panneau";
  for (const groupe of document.querySelectorAll(cascades)) {
    [...groupe.children].filter((el) => el.classList.contains("anim"))
      .forEach((el, i) => { if (!el.style.getPropertyValue("--d")) el.style.setProperty("--d", i * 90 + "ms"); });
  }

  // compteurs : le chiffre défile de 0 à sa valeur
  const compter = (el) => {
    const fin = Number(el.dataset.compte), debut = performance.now(), duree = fin > 10 ? 1300 : 700;
    const pas = (t) => {
      const p = Math.min(1, (t - debut) / duree);
      el.textContent = Math.round(fin * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(pas);
    };
    requestAnimationFrame(pas);
  };

  // barre de progression de lecture
  const barre = document.createElement("div");
  barre.className = "progression";
  barre.setAttribute("aria-hidden", "true");
  document.body.prepend(barre);
  let attente = false;
  const avancer = () => {
    attente = false;
    const total = document.documentElement.scrollHeight - innerHeight;
    barre.style.transform = `scaleX(${total > 0 ? scrollY / total : 0})`;
  };
  addEventListener("scroll", () => { if (!attente) { attente = true; requestAnimationFrame(avancer); } }, { passive: true });
  avancer();

  const montrerTout = () => { for (const el of cibles) el.classList.add("vu"); };

  let repond = false;
  const guetteur = new IntersectionObserver(
    (entrees) => {
      repond = true;
      const lot = [];
      let delaiMax = 0;
      for (const e of entrees) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("vu");
        for (const c of e.target.querySelectorAll("[data-compte]")) compter(c);
        delaiMax = Math.max(delaiMax, parseInt(e.target.style.getPropertyValue("--d")) || 0);
        lot.push(e.target);
        guetteur.unobserve(e.target);
      }
      // apparition finie : on passe aux effets de survol, en une seule
      // fois pour tout le lot (un recalcul de styles au lieu d'un par élément)
      if (lot.length) setTimeout(() => { for (const el of lot) el.classList.add("pose"); }, delaiMax + 950);
    },
    // marge en pixels et non en pourcentage : sur un très grand
    // écran, -8 % aurait exclu toute la fin de la page.
    { rootMargin: "0px 0px -40px 0px", threshold: 0.05 }
  );

  for (const el of cibles) guetteur.observe(el);

  // Filet : si l'observateur ne répond pas — page jamais peinte,
  // navigateur exotique — rien ne doit rester invisible.
  setTimeout(() => { if (!repond) montrerTout(); }, 1200);
})();
