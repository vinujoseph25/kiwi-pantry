/* Home page: kinetic hero parallax + featured products list. */
document.addEventListener("DOMContentLoaded", function () {

  /* subtle scroll + mouse parallax on the hero figure */
  var figure = document.querySelector("[data-hero-figure]");
  if (figure && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var frame = figure.querySelector(".hero-frame");
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        frame.style.transform = "translateY(" + window.scrollY * 0.06 + "px)";
        ticking = false;
      });
    }, { passive: true });
    figure.addEventListener("mousemove", function (e) {
      var r = figure.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      frame.style.rotate = x * 1.5 + "deg";
      frame.style.translate = x * -8 + "px " + y * -8 + "px";
    });
    figure.addEventListener("mouseleave", function () {
      frame.style.rotate = "0deg";
      frame.style.translate = "0 0";
    });
  }

  /* featured products → view_item_list + select_item */
  var grid = document.querySelector("[data-featured-grid]");
  if (!grid) return;
  var featured = KP.PRODUCTS.filter(function (p) { return p.featured; });
  grid.innerHTML = featured.map(KP.productCardHTML).join("");
  KP.bindCardEvents(grid, "Featured products");
  KP.gaEvent("view_item_list", {
    item_list_id: "featured",
    item_list_name: "Featured products",
    items: featured.map(function (p, i) { return KP.gaItem(p, 1, i); })
  });
});
