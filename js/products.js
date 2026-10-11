/* Shop page: category filter, search, sort + view_item_list / select_item. */
document.addEventListener("DOMContentLoaded", function () {
  var grid = document.querySelector("[data-product-grid]");
  if (!grid) return;

  var params = new URLSearchParams(location.search);
  var state = {
    cat: params.get("cat") || "All",
    q: "",
    sort: "featured"
  };
  if (state.cat !== "All" && KP.CATEGORIES.indexOf(state.cat) === -1) state.cat = "All";

  var pillsEl = document.querySelector("[data-filter-pills]");
  var searchEl = document.querySelector("[data-product-search]");
  var sortEl = document.querySelector("[data-product-sort]");
  var countEl = document.querySelector("[data-shop-count]");

  function renderPills() {
    var cats = ["All"].concat(KP.CATEGORIES);
    pillsEl.innerHTML = cats.map(function (c) {
      var href = c === "All" ? "products.html" : "products.html?cat=" + encodeURIComponent(c);
      var slug = c.toLowerCase().replace(/[^a-z]+/g, "-");
      return '<a class="pill" href="' + href + '" aria-current="' + (state.cat === c) + '" data-testid="filter-' + slug + '">' + c + "</a>";
    }).join("");
  }

  function visibleProducts() {
    var list = KP.PRODUCTS.filter(function (p) {
      var inCat = state.cat === "All" || p.category === state.cat;
      var inSearch = !state.q || (p.name + " " + p.category).toLowerCase().indexOf(state.q) !== -1;
      return inCat && inSearch;
    });
    if (state.sort === "price-asc") list.sort(function (a, b) { return a.price - b.price; });
    else if (state.sort === "price-desc") list.sort(function (a, b) { return b.price - a.price; });
    else if (state.sort === "name") list.sort(function (a, b) { return a.name.localeCompare(b.name); });
    else list.sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); });
    return list;
  }

  function listName() {
    var base = state.cat === "All" ? "All products" : state.cat;
    if (state.q) base += ' (search: "' + state.q + '")';
    return base;
  }

  function render() {
    renderPills();
    var list = visibleProducts();
    if (!list.length) {
      grid.innerHTML = "";
      countEl.textContent = "";
      document.querySelector("[data-shop-empty]").hidden = false;
      return;
    }
    document.querySelector("[data-shop-empty]").hidden = true;
    countEl.textContent = list.length + " products · prices in NZD";
    grid.innerHTML = list.map(KP.productCardHTML).join("");
    KP.bindCardEvents(grid, listName());
    KP.gaEvent("view_item_list", {
      item_list_id: state.cat.toLowerCase().replace(/[^a-z]+/g, "_"),
      item_list_name: listName(),
      items: list.map(function (p, i) { return KP.gaItem(p, 1, i); })
    });
  }

  var debounce;
  searchEl.addEventListener("input", function () {
    state.q = searchEl.value.trim().toLowerCase();
    clearTimeout(debounce);
    debounce = setTimeout(render, 500);
  });

  sortEl.addEventListener("change", function () {
    state.sort = sortEl.value;
    render();
  });

  render();
});
