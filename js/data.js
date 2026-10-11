/* ============================================================
   Kiwi Pantry — product catalogue (the single source of truth)
   Every page reads from this list. Add/edit products here.
   ============================================================ */
window.KP = window.KP || {};

KP.CATEGORIES = ["Snacks", "Dairy", "Drinks", "Household", "Fruit & Veg"];

KP.CATEGORY_META = {
  "Snacks":      { img: "assets/img/kumara-crisps.jpeg",    blurb: "Crisps, popcorn & lunchbox heroes" },
  "Dairy":       { img: "assets/img/cheddar.jpeg",          blurb: "Butter, cheese & thick yoghurt" },
  "Drinks":      { img: "assets/img/sparkling-feijoa.jpeg", blurb: "Juices, fizz & cold brew" },
  "Household":   { img: "assets/img/dish-liquid.jpeg",      blurb: "Eco cleaners & gentle soaps" },
  "Fruit & Veg": { img: "assets/img/kiwifruit.jpeg",        blurb: "Fresh from Kiwi growers" }
};

KP.PRODUCTS = [
  { id: "kp-kiwifruit", name: "Golden Kiwifruit Punnet", category: "Fruit & Veg", price: 6.99, unit: "1kg punnet", badge: "NZ GROWN", featured: true,  img: "assets/img/kiwifruit.jpeg",        desc: "Sun-sweet golden kiwifruit from Te Puke orchards — smooth skin, tropical flesh, and more vitamin C than an orange. Spoon them straight from the skin." },
  { id: "kp-apples", name: "Royal Gala Apples", category: "Fruit & Veg", price: 5.49, unit: "1.5kg bag", badge: "SUPER VALUE", featured: false, img: "assets/img/apples.jpeg",             desc: "Crunchy, honey-sweet Royal Galas picked at peak ripeness in Hawke's Bay. The lunchbox classic, at an everyday low price." },
  { id: "kp-kumara", name: "Orange Kūmara", category: "Fruit & Veg", price: 4.29, unit: "1kg bag", badge: "FARM DIRECT", featured: false, img: "assets/img/kumara.jpeg",               desc: "Sweet, earthy orange kūmara from Northland's red clay soils. Roast them, mash them, or chunk them into a hangi-style tray bake." },
  { id: "kp-avocados", name: "Hass Avocados", category: "Fruit & Veg", price: 7.80, unit: "4 pack", badge: "RIPE & READY", featured: true,  img: "assets/img/avocados.jpeg",           desc: "Creamy Bay of Plenty Hass avocados, graded ripe-and-ready so tonight's guacamole is actually possible." },
  { id: "kp-butter", name: "Golden Farmhouse Butter", category: "Dairy", price: 6.20, unit: "250g block", badge: "GRASS FED", featured: true,  img: "assets/img/butter.jpeg",             desc: "Slow-churned butter from grass-fed West Coast herds. Deep golden colour, proper farmhouse flavour." },
  { id: "kp-cheddar", name: "Hokitika Vintage Cheddar", category: "Dairy", price: 11.90, unit: "500g block", badge: "AGED 24 MO", featured: true,  img: "assets/img/cheddar.jpeg",          desc: "A bold, crumbly vintage cheddar aged a full 24 months. Sharp bite, long savoury finish — cheeseboard royalty." },
  { id: "kp-yoghurt", name: "Aoraki Greek Yoghurt", category: "Dairy", price: 7.60, unit: "1kg tub", badge: "THICK & CREAMY", featured: false, img: "assets/img/yoghurt.jpeg",          desc: "Spoon-standing thick Greek-style yoghurt made with fresh Canterbury milk. No gelatine, no nonsense." },
  { id: "kp-kumara-crisps", name: "Kūmara Crisps", category: "Snacks", price: 3.79, unit: "150g bag", badge: "EVERYDAY LOW", featured: true,  img: "assets/img/kumara-crisps.jpeg",    desc: "Hand-cooked kūmara crisps with flaky sea salt. Golden, crackly and dangerously moreish — a Kiwi twist on the classic chippie." },
  { id: "kp-popcorn", name: "Mānuka Honey Popcorn", category: "Snacks", price: 4.49, unit: "120g bag", badge: "KIWIANA FAVE", featured: false, img: "assets/img/popcorn.jpeg",           desc: "Air-popped corn tumbled in real mānuka honey caramel. Sweet, crunchy and just a little bit sticky." },
  { id: "kp-fruit-bars", name: "Feijoa Fruit Bars", category: "Snacks", price: 5.29, unit: "6 pack", badge: "LUNCHBOX HERO", featured: false, img: "assets/img/fruit-bars.jpeg",        desc: "Chewy fruit bars packed with tangy feijoa and apple. Six to a box — if they last that long." },
  { id: "kp-sparkling-feijoa", name: "Sparkling Feijoa", category: "Drinks", price: 4.80, unit: "750ml bottle", badge: "SMALL BATCH", featured: true,  img: "assets/img/sparkling-feijoa.jpeg", desc: "Small-batch sparkling feijoa juice — aromatic, tart-sweet and quietly fizzy. Serve chilled, pretend it's fancy." },
  { id: "kp-apple-juice", name: "Hawke's Bay Apple Juice", category: "Drinks", price: 3.95, unit: "1L bottle", badge: "100% PRESSED", featured: false, img: "assets/img/apple-juice.jpeg",   desc: "Nothing but pressed Hawke's Bay apples — no concentrate, no added sugar. Crisp orchard sunshine in a bottle." },
  { id: "kp-cold-brew", name: "Cold Brew Flat White", category: "Drinks", price: 5.50, unit: "300ml bottle", badge: "FAIRTRADE", featured: false, img: "assets/img/cold-brew.jpeg",        desc: "Slow-steeped Fairtrade cold brew blended with creamy NZ milk. Your flat white, straight from the fridge." },
  { id: "kp-dish-liquid", name: "Eco Lemon Dish Liquid", category: "Household", price: 4.20, unit: "500ml bottle", badge: "ECO CHOICE", featured: false, img: "assets/img/dish-liquid.jpeg",   desc: "Plant-based dish liquid with real lemon oil. Tough on grease, gentle on hands, kind to waterways." },
  { id: "kp-hand-soap", name: "Mānuka & Flax Hand Soap", category: "Household", price: 6.40, unit: "300ml pump", badge: "GENTLE", featured: false, img: "assets/img/hand-soap.jpeg",         desc: "A silky hand wash with mānuka honey and harakeke flax extract. Soft hands, subtle native-botanical scent." },
  { id: "kp-peanuts", name: "Honey Roasted Peanuts", category: "Snacks", price: 4.99, unit: "250g pouch", badge: "ROASTED DAILY", featured: false, img: "assets/img/peanuts.jpeg", desc: "Crunchy peanuts kettle-roasted in wildflower honey with a whisper of sea salt. The bowl empties itself." },
  { id: "kp-hokey-pokey", name: "Hokey Pokey Choc Slab", category: "Snacks", price: 5.49, unit: "200g slab", badge: "KIWI CLASSIC", featured: false, img: "assets/img/hokey-pokey.jpeg", desc: "Dark chocolate slab studded with crunchy golden hokey pokey honeycomb. Snap a square, share it (or don't)." },
  { id: "kp-milk", name: "Farm Fresh Whole Milk", category: "Dairy", price: 4.80, unit: "1.5L bottle", badge: "PASTURE RAISED", featured: false, img: "assets/img/milk.jpeg", desc: "Creamy non-homogenised whole milk from happy Waikato cows — the cream really does rise to the top." },
  { id: "kp-halloumi", name: "Canterbury Halloumi", category: "Dairy", price: 8.90, unit: "180g pack", badge: "GRILL ME", featured: false, img: "assets/img/halloumi.jpeg", desc: "Firm, squeaky halloumi that goes golden and crisp in the pan without melting away. A salad's best mate." },
  { id: "kp-ginger-beer", name: "Sparkling Ginger Beer", category: "Drinks", price: 9.49, unit: "4 × 330ml pack", badge: "FIERY", featured: false, img: "assets/img/ginger-beer.jpeg", desc: "Proper fiery ginger beer brewed with real crushed ginger root. Bites back, politely." },
  { id: "kp-kombucha", name: "Kawakawa Kombucha", category: "Drinks", price: 5.20, unit: "330ml bottle", badge: "LIVE CULTURES", featured: false, img: "assets/img/kombucha.jpeg", desc: "Gently fizzy raw kombucha infused with native kawakawa leaf. Tangy, herbal and very Wellington." },
  { id: "kp-laundry", name: "Lemon Laundry Liquid", category: "Household", price: 11.29, unit: "2L bottle", badge: "BULK SAVER", featured: false, img: "assets/img/laundry.jpeg", desc: "Concentrated plant-based laundry liquid with lemon eucalyptus oil. Fifty washes of fresh." },
  { id: "kp-beeswax-wraps", name: "Beeswax Food Wraps", category: "Household", price: 12.50, unit: "3 pack", badge: "REUSABLE", featured: false, img: "assets/img/beeswax-wraps.jpeg", desc: "Organic cotton wraps infused with NZ beeswax — the cheerful end of cling film." },
  { id: "kp-carrots", name: "Pukekohe Carrots", category: "Fruit & Veg", price: 2.99, unit: "1.5kg bag", badge: "FARM DIRECT", featured: false, img: "assets/img/carrots.jpeg", desc: "Sweet, snappy carrots from Pukekohe's volcanic soils. Roast whole with honey and thyme." },
  { id: "kp-dish-cloths", name: "Compostable Dish Cloths", category: "Household", price: 6.90, unit: "4 pack", badge: "PLASTIC FREE", featured: false, img: "assets/img/dish-cloths.jpeg", desc: "Super-absorbent cellulose cloths that compost at end of life. One cloth outlasts 17 rolls of paper towels." }
];

KP.findProduct = function (id) {
  return KP.PRODUCTS.find(function (p) { return p.id === id; }) || null;
};

KP.nzd = function (n) {
  return "$" + Number(n).toFixed(2);
};
