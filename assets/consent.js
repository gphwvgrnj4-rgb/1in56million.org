/* Crypto-Jews.org — GDPR consent-gated GA4 (Consent Mode v2, strict load).
   The Google tag does NOT load until the visitor explicitly accepts. */
(function () {
  var GA_ID = "G-P1SJVF5E9C";
  var KEY = "am-consent";

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  // Consent Mode v2 — everything denied by default
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied"
  });

  function loadGA() {
    if (window.__ga_loaded) return;
    window.__ga_loaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true });
  }

  function grant() {
    gtag("consent", "update", { analytics_storage: "granted" });
    loadGA();
  }

  var choice = null;
  try { choice = localStorage.getItem(KEY); } catch (e) {}
  if (choice === "granted") { grant(); return; }
  if (choice === "denied") { return; }

  // No stored choice → show banner
  var TXT = {
    en: { msg: "We use analytics cookies to understand site traffic. They load only if you accept.", policy: "Cookie Policy", accept: "Accept", decline: "Decline", href: "/cookies" },
    es: { msg: "Usamos cookies de analítica para entender el tráfico del sitio. Solo se cargan si aceptas.", policy: "Política de Cookies", accept: "Aceptar", decline: "Rechazar", href: "/cookies" },
    pt: { msg: "Usamos cookies de análise para entender o tráfego do site. Só são carregados se você aceitar.", policy: "Política de Cookies", accept: "Aceitar", decline: "Recusar", href: "/cookies" }
  };

  function build() {
    var lang = (document.documentElement.lang || "en").slice(0, 2);
    var t = TXT[lang] || TXT.en;
    var b = document.createElement("div");
    b.className = "cookie-banner";
    b.setAttribute("role", "dialog");
    b.setAttribute("aria-label", t.policy);
    b.innerHTML =
      '<div class="cb-in">' +
        '<p>' + t.msg + ' <a href="' + t.href + '">' + t.policy + '</a>.</p>' +
        '<div class="cb-btns">' +
          '<button class="cb-btn cb-decline" type="button">' + t.decline + '</button>' +
          '<button class="cb-btn cb-accept" type="button">' + t.accept + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(b);
    requestAnimationFrame(function () { b.classList.add("show"); });
    function close() { b.classList.remove("show"); setTimeout(function () { b.remove(); }, 300); }
    b.querySelector(".cb-accept").addEventListener("click", function () {
      try { localStorage.setItem(KEY, "granted"); } catch (e) {}
      grant(); close();
    });
    b.querySelector(".cb-decline").addEventListener("click", function () {
      try { localStorage.setItem(KEY, "denied"); } catch (e) {}
      close();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else { build(); }
})();
