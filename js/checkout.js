/* Checkout page: name + email only. Fires begin_checkout on arrival
   and purchase (random transaction_id, NZD) on "Place demo order". */
document.addEventListener("DOMContentLoaded", function () {
  var root = document.querySelector("[data-checkout-root]");
  if (!root) return;

  var items = KP.cartItems();

  if (!items.length) {
    root.innerHTML =
      '<div class="empty-state" data-testid="checkout-empty">' +
        "<h2>Nothing to check out</h2>" +
        "<p>Your trolley is empty — pop a few things in first.</p>" +
        '<a class="btn btn--yellow" href="products.html" data-testid="checkout-shop-link">Browse products</a>' +
      "</div>";
    return;
  }

  var total = KP.cartTotal();
  var gst = total * 3 / 23;

  KP.gaEvent("begin_checkout", {
    currency: "NZD",
    value: +total.toFixed(2),
    items: KP.gaItems(items)
  });

  root.innerHTML =
    '<div class="checkout-grid">' +
      '<form class="form-card" data-checkout-form novalidate>' +
        "<h2>Demo checkout</h2>" +
        '<p class="demo-note"><strong>No payment here.</strong> This is a student demo — we only ask for a name and email, and no card or payment fields exist anywhere on this site.</p>' +
        '<div class="field">' +
          '<label for="checkout-name">Your name</label>' +
          '<input class="input" id="checkout-name" data-testid="checkout-name" name="name" type="text" autocomplete="name" placeholder="Aroha Ngata" required>' +
        "</div>" +
        '<div class="field">' +
          '<label for="checkout-email">Email</label>' +
          '<input class="input" id="checkout-email" data-testid="checkout-email" name="email" type="email" autocomplete="email" placeholder="you@example.ac.nz" required>' +
        "</div>" +
        '<button type="submit" class="btn btn--yellow" data-testid="place-order-button">Place demo order</button>' +
        '<p class="summary-note">Placing the order fires a GA4 <code>purchase</code> event with a random transaction ID.</p>' +
      "</form>" +
      '<aside class="summary-card" data-testid="checkout-summary">' +
        "<h2>Your order</h2>" +
        items.map(function (i) {
          return '<div class="summary-row"><span>' + i.qty + " × " + i.name + "</span><span>" + KP.nzd(i.price * i.qty) + "</span></div>";
        }).join("") +
        '<div class="summary-row"><span>Delivery</span><span>FREE (demo)</span></div>' +
        '<div class="summary-total"><span>Total</span><span data-testid="checkout-total">' + KP.nzd(total) + " NZD</span></div>" +
        '<p class="summary-note">Includes GST of ' + KP.nzd(gst) + " · prices in NZD</p>" +
      "</aside>" +
    "</div>";

  root.querySelector("[data-checkout-form]").addEventListener("submit", function (e) {
    e.preventDefault();
    var name = root.querySelector("#checkout-name").value.trim();
    var email = root.querySelector("#checkout-email").value.trim();
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      KP.toast("Please enter your name and a valid email");
      return;
    }

    var txn = "KP-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();

    KP.gaEvent("purchase", {
      transaction_id: txn,
      value: +total.toFixed(2),
      tax: +gst.toFixed(2),
      shipping: 0,
      currency: "NZD",
      items: KP.gaItems(items)
    });

    sessionStorage.setItem("kp_last_order", JSON.stringify({
      id: txn,
      name: name,
      email: email,
      placed_at: new Date().toISOString(),
      total: +total.toFixed(2),
      tax: +gst.toFixed(2),
      items: items.map(function (i) { return { name: i.name, qty: i.qty, price: i.price }; })
    }));

    KP.clearCart();
    location.href = "thankyou.html";
  });
});
