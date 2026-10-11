/* Product detail page: one template driven by ?id= + view_item,
   add_to_cart, share and a related-products list. */
document.addEventListener("DOMContentLoaded", function () {
  var root = document.querySelector("[data-product-root]");
  if (!root) return;

  var id = new URLSearchParams(location.search).get("id");
  var p = KP.findProduct(id);

  if (!p) {
    document.title = "Product not found — Kiwi Pantry";
    root.innerHTML =
      '<div class="empty-state" data-testid="product-not-found">' +
        "<h2>Whoops, no such product</h2>" +
        "<p>That item has wandered off the shelf. Try the full range instead.</p>" +
        '<a class="btn btn--yellow" href="products.html" data-testid="back-to-shop">Back to the shop</a>' +
      "</div>";
    return;
  }

  document.title = p.name + " — Kiwi Pantry";

  root.innerHTML =
    '<div class="detail-grid">' +
      '<div class="detail-media reveal in">' +
        '<img src="' + p.img + '" alt="' + p.name + '" data-testid="product-image">' +
      "</div>" +
      "<div>" +
        '<p class="detail-cat">' + p.category + "</p>" +
        '<h1 class="detail-title" data-testid="product-title">' + p.name + "</h1>" +
        '<span class="detail-badge">' + p.badge + "</span>" +
        '<p class="detail-price" data-testid="product-price">' + KP.nzd(p.price) + " <small>/ " + p.unit + " · NZD</small></p>" +
        '<p class="detail-desc">' + p.desc + "</p>" +
        '<ul class="detail-meta">' +
          "<li><span>Category</span><span>" + p.category + "</span></li>" +
          "<li><span>Pack size</span><span>" + p.unit + "</span></li>" +
          "<li><span>Product code</span><span>" + p.id.toUpperCase() + "</span></li>" +
        "</ul>" +
        '<div class="detail-actions">' +
          '<div class="qty-stepper">' +
            '<button type="button" data-qty-dec data-testid="qty-decrease" aria-label="Decrease quantity">−</button>' +
            '<output data-qty-value data-testid="qty-value">1</output>' +
            '<button type="button" data-qty-inc data-testid="qty-increase" aria-label="Increase quantity">+</button>' +
          "</div>" +
          '<button type="button" class="btn" data-detail-add data-testid="add-to-cart-detail">Add to cart</button>' +
          '<button type="button" class="btn btn--ghost" data-detail-share data-testid="share-product-button">Share</button>' +
        "</div>" +
      "</div>" +
    "</div>" +
    '<section class="section">' +
      '<div class="section-head"><h2>You might also like</h2><a class="link-more" href="products.html">Shop everything</a></div>' +
      '<div class="product-grid" data-related-grid></div>' +
    "</section>";

  KP.gaEvent("view_item", {
    currency: "NZD",
    value: p.price,
    items: [KP.gaItem(p, 1)]
  });

  var qtyOut = root.querySelector("[data-qty-value]");
  var qty = 1;
  function setQty(n) {
    qty = Math.min(99, Math.max(1, n));
    qtyOut.textContent = String(qty);
  }
  root.querySelector("[data-qty-dec]").addEventListener("click", function () { setQty(qty - 1); });
  root.querySelector("[data-qty-inc]").addEventListener("click", function () { setQty(qty + 1); });
  root.querySelector("[data-detail-add]").addEventListener("click", function () { KP.addToCart(p.id, qty); });
  root.querySelector("[data-detail-share]").addEventListener("click", function () { KP.shareProduct(p); });

  var related = KP.PRODUCTS.filter(function (x) { return x.category === p.category && x.id !== p.id; }).slice(0, 4);
  if (related.length < 4) {
    KP.PRODUCTS.forEach(function (x) {
      if (related.length < 4 && x.id !== p.id && related.indexOf(x) === -1) related.push(x);
    });
  }
  var relGrid = root.querySelector("[data-related-grid]");
  relGrid.innerHTML = related.map(KP.productCardHTML).join("");
  KP.bindCardEvents(relGrid, "Related products");
  KP.gaEvent("view_item_list", {
    item_list_id: "related",
    item_list_name: "Related products",
    items: related.map(function (x, i) { return KP.gaItem(x, 1, i); })
  });
});
