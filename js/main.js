/* ============================================================
   Kiwi Pantry — shared UI: smooth scroll, nav, reveals,
   toasts, product cards, share links (with UTM + share event).
   ============================================================ */
window.KP = window.KP || {};

document.addEventListener("DOMContentLoaded", function () {

  /* Lenis smooth momentum scrolling (CDN, optional enhancement) */
  if (window.Lenis) {
    var lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    var raf = function (time) { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  /* Sticky header shadow */
  var header = document.querySelector("[data-header]");
  var onScroll = function () {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  var toggle = document.querySelector("[data-nav-toggle]");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.querySelectorAll(".site-nav a").forEach(function (a) {
      a.addEventListener("click", function () { document.body.classList.remove("nav-open"); });
    });
  }

  /* Current page in nav */
  var page = document.body.getAttribute("data-page");
  document.querySelectorAll(".site-nav a").forEach(function (a) {
    if (a.getAttribute("data-nav") === page) a.setAttribute("aria-current", "page");
  });

  /* Scroll reveals */
  KP.observeReveals = function (root) {
    var els = (root || document).querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  };
  KP.observeReveals(document);

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* UTM-tagged social share links (footer + anywhere else) */
  var channels = [
    { name: "Facebook",  source: "facebook",  medium: "social" },
    { name: "Instagram", source: "instagram", medium: "social" },
    { name: "X / Twitter", source: "twitter", medium: "social" },
    { name: "TikTok",    source: "tiktok",    medium: "social" },
    { name: "Email newsletter", source: "newsletter", medium: "email" }
  ];
  KP.utmUrl = function (channel, path) {
    var url = new URL(path || "index.html", location.href);
    url.searchParams.set("utm_source", channel.source);
    url.searchParams.set("utm_medium", channel.medium);
    url.searchParams.set("utm_campaign", "kiwi_pantry_launch");
    return url.href;
  };
  document.querySelectorAll("[data-share-list]").forEach(function (list) {
    list.innerHTML = channels.map(function (c) {
      return '<li><button type="button" class="share-link" data-channel="' + c.source + '" data-testid="share-link-' + c.source + '">' + c.name + "</button></li>";
    }).join("");
    list.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-channel]");
      if (!btn) return;
      var channel = channels.find(function (c) { return c.source === btn.getAttribute("data-channel"); });
      var url = KP.utmUrl(channel);
      var done = function () { KP.toast("UTM link for " + channel.name + " copied — paste it in your post"); };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, done);
      else done();
      KP.gaEvent("share", { method: channel.source, content_type: "store", item_id: "kiwi-pantry-home" });
    });
  });
});

/* ---------- toast notifications ---------- */
KP.toast = function (msg) {
  var region = document.querySelector("[data-toast-region]");
  if (!region) {
    region = document.createElement("div");
    region.className = "toast-region";
    region.setAttribute("data-toast-region", "");
    region.setAttribute("role", "status");
    region.setAttribute("aria-live", "polite");
    document.body.appendChild(region);
  }
  var t = document.createElement("div");
  t.className = "toast";
  t.setAttribute("data-testid", "toast");
  t.textContent = msg;
  region.appendChild(t);
  setTimeout(function () { t.classList.add("out"); }, 2400);
  setTimeout(function () { t.remove(); }, 2900);
};

/* ---------- product card builder (shared by home / shop / related) ---------- */
KP.productCardHTML = function (p, index) {
  var delay = (index % 4) * 70;
  return (
    '<article class="product-card reveal" style="--d:' + delay + 'ms">' +
      '<a class="product-card-media" href="product.html?id=' + p.id + '" data-select-item="' + p.id + '" data-testid="product-card-' + p.id + '">' +
        '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
        '<span class="badge">' + p.badge + "</span>" +
      "</a>" +
      '<div class="product-card-body">' +
        '<span class="product-cat">' + p.category + "</span>" +
        '<h3 class="product-name"><a href="product.html?id=' + p.id + '" data-select-item="' + p.id + '">' + p.name + "</a></h3>" +
        '<div class="product-foot">' +
          '<span class="price" data-testid="price-' + p.id + '">' + KP.nzd(p.price) + " <small>" + p.unit + "</small></span>" +
          '<button type="button" class="btn btn-add" data-add-to-cart="' + p.id + '" data-testid="add-to-cart-' + p.id + '">Add</button>' +
        "</div>" +
      "</div>" +
    "</article>"
  );
};

KP.bindCardEvents = function (root, listName) {
  root.querySelectorAll("[data-add-to-cart]").forEach(function (btn) {
    btn.addEventListener("click", function () { KP.addToCart(btn.getAttribute("data-add-to-cart"), 1); });
  });
  root.querySelectorAll("[data-select-item]").forEach(function (a) {
    a.addEventListener("click", function () {
      var p = KP.findProduct(a.getAttribute("data-select-item"));
      if (p) KP.gaEvent("select_item", { item_list_name: listName, items: [KP.gaItem(p)] });
    });
  });
  if (KP.observeReveals) KP.observeReveals(root);
};

/* ---------- share a product (Web Share API + clipboard fallback) ---------- */
KP.shareProduct = function (p) {
  var url = new URL("product.html?id=" + p.id, location.href).href;
  var fire = function (method) {
    KP.gaEvent("share", { method: method, content_type: "product", item_id: p.id });
  };
  if (navigator.share) {
    navigator.share({ title: p.name + " — Kiwi Pantry", text: "Check out " + p.name + " at Kiwi Pantry (demo store)", url: url })
      .then(function () { fire("web_share"); })
      .catch(function () { /* user cancelled */ });
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(function () {
      KP.toast("Product link copied — share it anywhere");
      fire("clipboard");
    }).catch(function () {
      KP.toast("Share this link: " + url);
      fire("clipboard_unavailable");
    });
  } else {
    fire("unsupported");
  }
};
