/* ============================================================
   Kiwi Pantry — cart stored in localStorage, GA4 cart events.
   ============================================================ */
window.KP = window.KP || {};

KP.CART_KEY = "kiwipantry_cart";

KP.getCart = function () {
  try {
    return JSON.parse(localStorage.getItem(KP.CART_KEY)) || {};
  } catch (e) {
    return {};
  }
};

KP._saveCart = function (cart) {
  localStorage.setItem(KP.CART_KEY, JSON.stringify(cart));
  KP.updateCartBadge();
  document.dispatchEvent(new CustomEvent("kp:cart-changed"));
};

KP.cartCount = function () {
  var cart = KP.getCart();
  return Object.keys(cart).reduce(function (sum, id) { return sum + cart[id]; }, 0);
};

KP.cartItems = function () {
  var cart = KP.getCart();
  return Object.keys(cart)
    .map(function (id) {
      var p = KP.findProduct(id);
      if (!p) return null;
      var line = Object.assign({}, p);
      line.qty = cart[id];
      return line;
    })
    .filter(Boolean);
};

KP.cartTotal = function () {
  return KP.cartItems().reduce(function (sum, i) { return sum + i.price * i.qty; }, 0);
};

KP.gaItems = function (items) {
  return items.map(function (i, idx) { return KP.gaItem(i, i.qty, idx); });
};

KP.addToCart = function (id, qty) {
  qty = qty || 1;
  var p = KP.findProduct(id);
  if (!p) return;
  var cart = KP.getCart();
  cart[id] = (cart[id] || 0) + qty;
  KP._saveCart(cart);
  KP.gaEvent("add_to_cart", {
    currency: "NZD",
    value: +(p.price * qty).toFixed(2),
    items: [KP.gaItem(p, qty)]
  });
  if (KP.toast) KP.toast(p.name + " added to cart");
  KP.bumpBadge();
};

KP.setQty = function (id, qty) {
  var p = KP.findProduct(id);
  var cart = KP.getCart();
  var old = cart[id] || 0;
  if (!p || old === qty) return;
  if (qty <= 0) { KP.removeFromCart(id); return; }
  cart[id] = qty;
  KP._saveCart(cart);
  var diff = qty - old;
  if (diff > 0) {
    KP.gaEvent("add_to_cart", { currency: "NZD", value: +(p.price * diff).toFixed(2), items: [KP.gaItem(p, diff)] });
  } else {
    KP.gaEvent("remove_from_cart", { currency: "NZD", value: +(p.price * -diff).toFixed(2), items: [KP.gaItem(p, -diff)] });
  }
};

KP.removeFromCart = function (id) {
  var p = KP.findProduct(id);
  var cart = KP.getCart();
  var old = cart[id] || 0;
  if (!p || !old) return;
  delete cart[id];
  KP._saveCart(cart);
  KP.gaEvent("remove_from_cart", {
    currency: "NZD",
    value: +(p.price * old).toFixed(2),
    items: [KP.gaItem(p, old)]
  });
  if (KP.toast) KP.toast(p.name + " removed from cart");
};

KP.clearCart = function () {
  localStorage.setItem(KP.CART_KEY, "{}");
  KP.updateCartBadge();
  document.dispatchEvent(new CustomEvent("kp:cart-changed"));
};

KP.updateCartBadge = function () {
  var count = KP.cartCount();
  document.querySelectorAll("[data-cart-count]").forEach(function (el) {
    el.textContent = String(count);
    el.classList.toggle("is-empty", count === 0);
  });
};

KP.bumpBadge = function () {
  document.querySelectorAll("[data-cart-count]").forEach(function (el) {
    el.classList.remove("bump");
    void el.offsetWidth;
    el.classList.add("bump");
  });
};

document.addEventListener("DOMContentLoaded", KP.updateCartBadge);
