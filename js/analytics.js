/* ============================================================
   GOOGLE ANALYTICS 4 — THE ONE THING YOU MUST EDIT:
   Replace "G-XXXXXXXXXX" below with your own Measurement ID
   (GA4 → Admin → Data Streams → your web stream → Measurement ID).
   Every page loads this file, so this single line covers the
   whole site.
   ============================================================ */
var GA_MEASUREMENT_ID = "G-TYKNB84W57";

/* Standard gtag.js bootstrap (async snippet, loaded from here so the
   Measurement ID lives in exactly one place). */
window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
window.gtag = gtag;

(function () {
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_MEASUREMENT_ID);
  document.head.appendChild(s);
})();

gtag("js", new Date());

/* --- Consent Mode v2 demo: ALL storage starts DENIED until the visitor
   chooses in the cookie banner (then we fire gtag consent "update"). --- */
gtag("consent", "default", {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
  wait_for_update: 500
});
var KP_CONSENT_KEY = "kp_consent";
var _storedConsent = null;
try { _storedConsent = localStorage.getItem(KP_CONSENT_KEY); } catch (e) {}
function kpConsentUpdate(state) {
  gtag("consent", "update", {
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    analytics_storage: state
  });
}
if (_storedConsent === "granted" || _storedConsent === "denied") {
  kpConsentUpdate(_storedConsent);
}

gtag("config", GA_MEASUREMENT_ID);

/* DebugView helper: open any page with ?debug_mode=true (or run
   localStorage.setItem("kp_debug","1") once) to route events into
   GA4's DebugView for the assignment screenshots. */
if (/[?&]debug_mode/.test(location.search) || localStorage.getItem("kp_debug")) {
  gtag("set", { debug_mode: true });
}

/* ---------- shared e-commerce event helpers ---------- */
window.KP = window.KP || {};
KP._gaLog = [];

/* GA4 item object with every recommended parameter. */
KP.gaItem = function (p, qty, index) {
  var item = {
    item_id: p.id,
    item_name: p.name,
    item_category: p.category,
    price: p.price,
    quantity: qty || 1
  };
  if (typeof index === "number") item.index = index;
  return item;
};

/* Fire a GA4 event AND record it for the on-page inspector. */
KP.gaEvent = function (name, params) {
  params = params || {};
  gtag("event", name, params);
  KP._gaLog.unshift({ time: new Date(), event: name, params: params });
  if (KP._gaLog.length > 40) KP._gaLog.pop();
  if (KP._renderGaLog) KP._renderGaLog();
};

/* ---------- floating GA4 event inspector (great for grading!) ---------- */
document.addEventListener("DOMContentLoaded", function () {
  var fab = document.createElement("button");
  fab.type = "button";
  fab.className = "ga-fab";
  fab.setAttribute("data-testid", "ga-inspector-toggle");
  fab.setAttribute("aria-expanded", "false");
  fab.innerHTML = 'GA4 <span class="ga-fab-count" data-ga-count>0</span>';

  var panel = document.createElement("aside");
  panel.className = "ga-panel";
  panel.setAttribute("data-testid", "ga-inspector-panel");
  panel.hidden = true;
  panel.innerHTML =
    '<div class="ga-panel-head">' +
      '<strong>GA4 event inspector</strong>' +
      '<button type="button" class="ga-clear" data-ga-clear data-testid="ga-inspector-clear">Clear</button>' +
    '</div>' +
    '<p class="ga-note">Measurement ID: <code>' + GA_MEASUREMENT_ID + '</code>' +
      (GA_MEASUREMENT_ID === "G-XXXXXXXXXX"
        ? ' <em>(placeholder — replace it in js/analytics.js)</em>'
        : "") +
      ". Same events appear in GA4 Realtime &amp; DebugView.</p>" +
    '<div class="ga-events" data-ga-events></div>';

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  var listEl = panel.querySelector("[data-ga-events]");
  var countEl = fab.querySelector("[data-ga-count]");

  KP._renderGaLog = function () {
    countEl.textContent = String(KP._gaLog.length);
    if (!KP._gaLog.length) {
      listEl.innerHTML = '<p class="ga-empty">Browse, add to cart and check out — events will stream in here live.</p>';
      return;
    }
    listEl.innerHTML = KP._gaLog.map(function (entry) {
      var t = entry.time.toLocaleTimeString("en-NZ", { hour12: false });
      return (
        '<details class="ga-entry">' +
          '<summary><span class="ga-event-name">' + entry.event + "</span><time>" + t + "</time></summary>" +
          "<pre></pre>" +
        "</details>"
      );
    }).join("");
    var pres = listEl.querySelectorAll("pre");
    KP._gaLog.forEach(function (entry, i) {
      pres[i].textContent = JSON.stringify(entry.params, null, 2);
    });
  };

  fab.addEventListener("click", function () {
    panel.hidden = !panel.hidden;
    fab.setAttribute("aria-expanded", String(!panel.hidden));
  });
  panel.querySelector("[data-ga-clear]").addEventListener("click", function () {
    KP._gaLog.length = 0;
    KP._renderGaLog();
  });

  KP._renderGaLog();
});

/* ---------- cookie consent banner (drives GA4 Consent Mode) ---------- */
document.addEventListener("DOMContentLoaded", function () {
  function stateLabel() {
    var s = null;
    try { s = localStorage.getItem(KP_CONSENT_KEY); } catch (e) {}
    return s || "not set (default: denied)";
  }
  function paintState() {
    document.querySelectorAll("[data-ga-consent-state]").forEach(function (el) {
      el.textContent = stateLabel();
    });
  }

  /* show the live consent state inside the GA4 inspector panel */
  var note = document.querySelector(".ga-panel .ga-note");
  if (note) {
    note.insertAdjacentHTML(
      "afterend",
      '<p class="ga-note">Consent: <code data-ga-consent-state></code> — set via the cookie banner (Consent Mode v2).</p>'
    );
  }
  paintState();

  var banner = document.createElement("div");
  banner.className = "consent-banner";
  banner.setAttribute("data-testid", "consent-banner");
  banner.setAttribute("role", "region");
  banner.setAttribute("aria-label", "Cookie consent");
  banner.innerHTML =
    "<p><strong>Fresh cookies, anyone?</strong> This demo store starts with all GA4 storage <code>denied</code>. " +
    "Accept to grant <code>analytics_storage</code> and watch full events flow, or reject to see Consent Mode's cookieless pings.</p>" +
    '<div class="consent-actions">' +
      '<button type="button" class="btn btn--sm" data-consent="granted" data-testid="consent-accept">Accept all</button>' +
      '<button type="button" class="btn btn--sm btn--ghost" data-consent="denied" data-testid="consent-reject">Reject</button>' +
    "</div>";

  function choose(state) {
    try { localStorage.setItem(KP_CONSENT_KEY, state); } catch (e) {}
    kpConsentUpdate(state);
    KP.gaEvent("consent_choice", { consent_state: state });
    banner.remove();
    paintState();
    KP.toast(state === "granted"
      ? "Consent granted — analytics_storage is on"
      : "Consent denied — GA4 stays cookieless");
  }

  if (_storedConsent !== "granted" && _storedConsent !== "denied") {
    document.body.appendChild(banner);
    banner.querySelectorAll("[data-consent]").forEach(function (btn) {
      btn.addEventListener("click", function () { choose(btn.getAttribute("data-consent")); });
    });
  }

  /* footer reset link so the demo can be re-run in class */
  var disc = document.querySelector(".footer-disclaimer");
  if (disc) {
    var p = document.createElement("p");
    var reset = document.createElement("button");
    reset.type = "button";
    reset.className = "consent-reset";
    reset.setAttribute("data-testid", "consent-reset");
    reset.textContent = "Reset cookie consent (demo)";
    reset.addEventListener("click", function () {
      try { localStorage.removeItem(KP_CONSENT_KEY); } catch (e) {}
      location.reload();
    });
    p.appendChild(reset);
    disc.appendChild(p);
  }
});
