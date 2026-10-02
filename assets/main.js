/* ───────────────────────────────────────────────────────────
   Trackia — une seule chose à modifier ici.

   Collez ci-dessous le lien de votre page de paiement
   (Stripe Payment Link, Lemon Squeezy, Systeme.io, PayPal…).
   Tant qu'il est vide, les boutons d'achat descendent
   simplement jusqu'à la section Prix.
   ─────────────────────────────────────────────────────────── */
const CHECKOUT_URL = "";

document.addEventListener("DOMContentLoaded", () => {
  if (CHECKOUT_URL) {
    document.querySelectorAll(".js-buy").forEach((el) => {
      el.href = CHECKOUT_URL;
      el.rel = "noopener";
    });
  }

  // filet sous l'en-tête dès qu'on quitte le haut de page
  const head = document.getElementById("head");
  const mark = () => head.classList.toggle("is-stuck", window.scrollY > 8);
  mark();
  window.addEventListener("scroll", mark, { passive: true });

  // une seule question ouverte à la fois dans la FAQ
  const items = document.querySelectorAll(".faq details");
  items.forEach((d) => {
    d.addEventListener("toggle", () => {
      if (!d.open) return;
      items.forEach((o) => { if (o !== d) o.open = false; });
    });
  });
});
