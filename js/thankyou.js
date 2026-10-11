/* Thank-you page: replays the demo order snapshot as a printable receipt. */
document.addEventListener("DOMContentLoaded", function () {
  var root = document.querySelector("[data-thankyou-root]");
  if (!root) return;

  var order = null;
  try { order = JSON.parse(sessionStorage.getItem("kp_last_order")); } catch (e) { /* no order */ }

  var body;
  if (order) {
    var when = order.placed_at ? new Date(order.placed_at) : new Date();
    var whenStr = when.toLocaleString("en-NZ", { dateStyle: "medium", timeStyle: "short" });
    body =
      '<p class="no-print">Choice, ' + order.name.split(" ")[0] + "! Your demo order is confirmed. " +
      "A real store would email <strong>" + order.email + "</strong> — this one won't, because it's a student demo and nothing is fulfilled.</p>" +
      '<div class="receipt" data-testid="receipt">' +
        '<div class="receipt-head">' +
          '<img src="assets/logo.svg" alt="" width="44" height="44">' +
          "<strong>KIWI PANTRY</strong>" +
          "<span>Fresh kai · fair prices · zero fuss</span>" +
          "<span>Auckland · Wellington · Christchurch (imaginary)</span>" +
        "</div>" +
        '<div class="receipt-row"><span>' + whenStr + "</span><span>SELF-SERVE DEMO</span></div>" +
        '<div class="receipt-row"><span>Order</span><span data-testid="order-number">' + order.id + "</span></div>" +
        '<div class="receipt-sep"></div>' +
        order.items.map(function (i) {
          return '<div class="receipt-row"><span>' + i.qty + " × " + i.name + "</span><span>" + KP.nzd(i.price * i.qty) + "</span></div>";
        }).join("") +
        '<div class="receipt-sep"></div>' +
        '<div class="receipt-row"><span>Subtotal</span><span>' + KP.nzd(order.total) + "</span></div>" +
        '<div class="receipt-row"><span>Includes GST (15%)</span><span>' + KP.nzd(order.tax) + "</span></div>" +
        '<div class="receipt-row receipt-total"><span>TOTAL NZD</span><span>' + KP.nzd(order.total) + "</span></div>" +
        '<div class="receipt-sep"></div>' +
        '<div class="receipt-barcode" aria-hidden="true"></div>' +
        '<p class="receipt-code">' + order.id + "</p>" +
        '<p class="receipt-note">*** STUDENT DEMO — NOT A REAL ORDER ***<br>No payment taken · Nothing delivered<br>Ngā mihi — thanks for shopping (fictionally)!</p>' +
      "</div>" +
      '<div class="receipt-edge" aria-hidden="true"></div>' +
      '<div class="hero-ctas no-print" style="justify-content:center">' +
        '<button type="button" class="btn btn--yellow" data-print data-testid="print-receipt">Print receipt</button>' +
        '<a class="btn" href="products.html" data-testid="thankyou-shop-link">Back to the shop</a>' +
        '<a class="btn btn--ghost" href="https://analytics.google.com/" target="_blank" rel="noopener" data-testid="thankyou-ga-link">Check it in GA4 Realtime</a>' +
      "</div>";
  } else {
    body =
      "<p>No recent demo order found in this browser session — place one from the checkout to see the confirmation flow.</p>" +
      '<div class="hero-ctas" style="justify-content:center">' +
        '<a class="btn" href="products.html" data-testid="thankyou-shop-link">Back to the shop</a>' +
      "</div>";
  }

  root.innerHTML =
    '<div class="thankyou">' +
      '<svg class="check-mark no-print" viewBox="0 0 96 96" aria-hidden="true"><circle cx="48" cy="48" r="45"/><path d="M30 49 L43 62 L67 36"/></svg>' +
      '<h1 class="display no-print" style="font-size:clamp(2rem,5vw,3rem)">Sweet as — order placed!</h1>' +
      body +
    "</div>";

  var printBtn = root.querySelector("[data-print]");
  if (printBtn) printBtn.addEventListener("click", function () { window.print(); });
});
