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

  // Signaux envoyés à Google Tag Manager, qui les transmet à GA4
  // (rien n'est mesuré avant que le visiteur accepte les cookies).
  window.dataLayer = window.dataLayer || [];
  const signaler = (donnees) => window.dataLayer.push(donnees);
  const PRODUIT = { currency: "EUR", value: 397,
    items: [{ item_id: "trackia", item_name: "Formation Trackia", price: 397, quantity: 1 }] };

  // clic sur un bouton d'achat → begin_checkout, avec l'endroit du bouton
  for (const el of document.querySelectorAll(".js-acheter")) {
    el.addEventListener("click", () => {
      const zone = el.closest("header, section");
      signaler({ ecommerce: null });
      signaler({ event: "clic_paiement", emplacement: zone ? (zone.id || zone.className.split(" ")[0]) : "page", ecommerce: PRODUIT });
    });
  }

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

  // formulaire de contact : chaque question part directement par e-mail
  // à contact@trackia.fr, via le service FormSubmit (sans compte).
  // Le script Trackia (GTM), s'il est installé, l'envoie en plus à Make.
  const ADRESSE_CONTACT = "contact@trackia.fr";
  const formulaire = document.getElementById("formulaire-contact");
  if (formulaire) {
    formulaire.addEventListener("submit", async (e) => {
      e.preventDefault();
      const bouton = formulaire.querySelector('button[type="submit"]');
      bouton.disabled = true;
      bouton.textContent = "Envoi…";

      const d = new FormData(formulaire);
      let source = {};
      try { source = JSON.parse(localStorage.getItem("trackia_source") || "{}"); } catch (err) {}
      const donnees = {
        Nom: d.get("nom"), "E-mail": d.get("email"), "Téléphone": d.get("telephone") || "—",
        Question: d.get("message"),
        Source: [source.utm_source, source.utm_campaign, source.gclid ? "gclid " + source.gclid : ""].filter(Boolean).join(" · ") || "—",
        _subject: "Question sur la formation Trackia — " + d.get("nom"),
        _replyto: d.get("email"), _template: "table", _honey: d.get("_honey") || "",
      };

      const message = (texte) => {
        const p = document.createElement("p");
        p.className = "contact__merci";
        p.setAttribute("role", "status");
        p.innerHTML = texte;
        formulaire.replaceChildren(p);
      };

      try {
        const reponse = await fetch("https://formsubmit.co/ajax/" + ADRESSE_CONTACT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(donnees),
        });
        const resultat = await reponse.json().catch(() => ({}));
        if (!reponse.ok || String(resultat.success) !== "true") throw new Error(resultat.message || "envoi refusé");
        message("Merci, votre question est bien partie. Réponse sous 24&nbsp;h ouvrées, à l'adresse indiquée.");
        signaler({ event: "formulaire_envoye", formulaire: "contact" });
      } catch (err) {
        const corps = `Nom : ${d.get("nom")}
E-mail : ${d.get("email")}
Téléphone : ${d.get("telephone") || "—"}

${d.get("message")}`;
        const lien = "mailto:" + ADRESSE_CONTACT + "?subject=" + encodeURIComponent("Question sur la formation Trackia") + "&body=" + encodeURIComponent(corps);
        message(`L'envoi n'a pas abouti. <a href="${lien}">Cliquez ici pour envoyer votre question par e-mail</a>, elle est déjà rédigée.`);
      }
    });
  }

  // vidéo de démonstration : chargée seulement quand elle arrive à l'écran,
  // lue sans le son et en boucle, mise en pause quand elle sort de l'écran.
  // Si le visiteur demande moins d'animations : pas de lecture automatique.
  const video = document.querySelector(".demo__video");
  if (video) {
    const calme = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const charger = () => {
      if (video.dataset.charge) return;
      for (const s of video.querySelectorAll("source[data-src]")) s.src = s.dataset.src;
      video.load();
      video.dataset.charge = "1";
    };
    if (calme || !("IntersectionObserver" in window)) {
      video.controls = true;
      charger();
    } else {
      new IntersectionObserver((entrees) => {
        for (const e of entrees) {
          if (e.isIntersecting) { charger(); video.play().catch(() => { video.controls = true; }); }
          else if (!video.paused) video.pause();
        }
      }, { threshold: 0.4 }).observe(video);
    }
  }

  // une seule question ouverte à la fois
  const questions = document.querySelectorAll(".faq details");
  for (const d of questions) {
    d.addEventListener("toggle", () => {
      if (!d.open) return;
      signaler({ event: "faq_ouverte", question: d.querySelector("summary").textContent.trim() });
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
