/* ───────────────────────────────────────────────────────────
   Trackia — une seule chose à modifier ici.

   Collez ci-dessous le lien de votre page de paiement
   (Stripe Payment Link, Lemon Squeezy, Systeme.io…).
   Tant qu'il est vide, les boutons d'achat descendent
   simplement jusqu'à la section Prix.
   ─────────────────────────────────────────────────────────── */
const LIEN_PAIEMENT = "";

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
      for (const e of entrees) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("vu");
        for (const c of e.target.querySelectorAll("[data-compte]")) compter(c);
        // apparition finie : on passe aux effets de survol
        const delai = parseInt(e.target.style.getPropertyValue("--d")) || 0;
        setTimeout(() => e.target.classList.add("pose"), delai + 950);
        guetteur.unobserve(e.target);
      }
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
