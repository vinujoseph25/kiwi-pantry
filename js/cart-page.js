/* Cart page: renders the localStorage cart, fires view_cart,
   and add_to_cart / remove_from_cart on quantity changes. */
document.addEventListener("DOMContentLoaded", function () {
  var root = document.querySelector("[data-cart-root]");
  if (!root) return;

  function render() {
    var items = KP.cartItems();

    KP.gaEvent("view_cart", {
      currency: "NZD",
      value: +KP.cartTotal().toFixed(2),
      items: KP.gaItems(items)
    });

    if (!items.length) {
      root.innerHTML =
        '<div class="empty-state" data-testid="cart-empty">' +
          "<h2>Your trolley's empty</h2>" +
          "<p>Fill it with fresh kai — everything is pretend, so go wild.</p>" +
          '<a class="btn btn--yellow" href="products.html" data-testid="cart-shop-link">Start shopping</a>' +
        "</div>";
      return;
    }

    var total = KP.cartTotal();
    var gst = total * 3 / 23;

    root.innerHTML =
      '<div class="cart-layout">' +
        '<div class="cart-lines" data-testid="cart-lines">' +
          items.map(function (i) {
            return (
              '<div class="cart-line" data-testid="cart-line-' + i.id + '">' +
                '<a href="product.html?id=' + i.id + '"><img src="' + i.img + '" alt="' + i.name + '"></a>' +
                "<div>" +
                  '<p class="cart-line-name"><a href="product.html?id=' + i.id + '">' + i.name + "</a></p>" +
                  '<p class="cart-line-meta">' + i.category + " · " + KP.nzd(i.price) + " / " + i.unit + "</p>" +
                  '<div class="cart-line-controls">' +
                    '<div class="qty-stepper">' +
                      '<button type="button" data-dec="' + i.id + '" data-testid="cart-decrease-' + i.id + '" aria-label="Decrease quantity">−</button>' +
                      "<output>" + i.qty + "</output>" +
                      '<button type="button" data-inc="' + i.id + '" data-testid="cart-increase-' + i.id + '" aria-label="Increase quantity">+</button>' +
                    "</div>" +
                    '<button type="button" class="link-remove" data-remove="' + i.id + '" data-testid="cart-remove-' + i.id + '">Remove</button>' +
                  "</div>" +
                "</div>" +
                '<div class="cart-line-total">' + KP.nzd(i.price * i.qty) + "</div>" +
              "</div>"
            );
          }).join("") +
        "</div>" +
        '<aside class="summary-card" data-testid="cart-summary">' +
          "<h2>Order summary</h2>" +
          '<div class="summary-row"><span>Subtotal (' + KP.cartCount() + ' items)</span><span>' + KP.nzd(total) + "</span></div>" +
          '<div class="summary-row"><span>Delivery</span><span>FREE (demo)</span></div>' +
          '<div class="summary-row"><span>Includes GST (15%)</span><span>' + KP.nzd(gst) + "</span></div>" +
          '<div class="summary-total"><span>Total</span><span data-testid="cart-total">' + KP.nzd(total) + " NZD</span></div>" +
          '<a class="btn btn--yellow" href="checkout.html" data-testid="checkout-cta">Proceed to demo checkout</a>' +
          '<p class="summary-note">Demo store — nothing is ever charged or delivered.</p>' +
        "</aside>" +
      "</div>";

    root.querySelectorAll("[data-inc]").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-inc");
        KP.setQty(id, (KP.getCart()[id] || 0) + 1);
      });
    });
    root.querySelectorAll("[data-dec]").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-dec");
        KP.setQty(id, (KP.getCart()[id] || 0) - 1);
      });
    });
    root.querySelectorAll("[data-remove]").forEach(function (b) {
      b.addEventListener("click", function () { KP.removeFromCart(b.getAttribute("data-remove")); });
    });
  }

  render();
  document.addEventListener("kp:cart-changed", render);
});
