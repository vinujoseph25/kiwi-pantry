# Kiwi Pantry — static demo e-commerce store (GA4 assignment)

**Kiwi Pantry** is a fictional New Zealand online grocery store built with **plain HTML, CSS and vanilla JavaScript** — no build step, no backend, nothing to install. It exists to demonstrate the **Google Analytics 4 recommended e-commerce events** for a university web-analytics assignment.

> **Student demo store.** Kiwi Pantry is fictional. No real products are sold, no orders are fulfilled, and no payments are taken.

---

## 1. Folder structure

```
site/
├── index.html          # Home — hero, marquee, category bento, featured products
├── products.html       # Product listing — 25 products, category filter, search, sort
├── product.html        # Product detail template (driven by ?id= from js/data.js)
├── cart.html           # Cart — stored in localStorage
├── checkout.html       # Demo checkout — name + email ONLY, no payment fields
├── thankyou.html       # Order confirmation page with printable receipt
├── about.html          # About page
├── contact.html        # Contact page (demo form, sends nothing)
├── css/
│   └── style.css       # Full design system
├── js/
│   ├── analytics.js    # ★ GA4 setup + event helpers + on-page event inspector
│   ├── data.js         # The product catalogue (single source of truth)
│   ├── cart.js         # localStorage cart + add/remove GA4 events
│   ├── main.js         # Shared UI: nav, smooth scroll, reveals, share links
│   ├── home.js         # Home page logic
│   ├── products.js     # Listing page logic
│   ├── product.js      # Detail page logic
│   ├── cart-page.js    # Cart page logic
│   ├── checkout.js     # Checkout logic (fires purchase)
│   └── thankyou.js     # Confirmation page logic
└── assets/
    ├── logo.svg        # Logo + favicon
    └── img/            # Product & hero photography (local, self-hosted)
```

## 2. Replace the GA4 Measurement ID (one place only)

1. In [Google Analytics](https://analytics.google.com/), go to **Admin → Data Streams → your web stream** and copy your **Measurement ID** (looks like `G-ABC123DEF4`).
2. Open **`js/analytics.js`** — the ID currently set is `G-TYKNB84W57`:

```js
var GA_MEASUREMENT_ID = "G-TYKNB84W57";   // ← already wired in; swap here if it ever changes
```

That's it — every page loads this one file, so the whole site reports to that property. If you ever rotate properties, this single line is the only edit needed.

## 3. Events that are tracked

| Event | Fires when | Key parameters |
|---|---|---|
| `page_view` | Every page load (automatic) | page_location, page_title |
| `view_item_list` | Home "specials", shop listing, related products | item_list_id, item_list_name, items[] |
| `select_item` | Clicking any product card | item_list_name, items[] |
| `view_item` | Product detail page loads | currency, value, items[] |
| `add_to_cart` | Any "Add" button, quantity + | currency, value, items[] |
| `remove_from_cart` | Quantity −, "Remove" | currency, value, items[] |
| `view_cart` | Cart page viewed | currency, value, items[] |
| `begin_checkout` | Checkout page viewed with items | currency, value, items[] |
| `purchase` | "Place demo order" submitted | transaction_id (random), value, tax, shipping: 0, currency: "NZD", items[] |
| `share` | Share button / footer social links | method, content_type, item_id |
| `generate_lead` | Contact form submitted (bonus) | method |
| `consent_choice` | Cookie banner accepted / rejected | consent_state |

## 4b. Cookie consent (Consent Mode v2 demo)

Every visitor starts with **all storage denied** (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`) — see `js/analytics.js`. The cookie banner fires `gtag("consent", "update", …)` with `granted` or `denied`, records a `consent_choice` event, and remembers the choice in `localStorage` (`kp_consent`). The GA4 inspector shows the live consent state, and the footer's **"Reset cookie consent (demo)"** link lets you run the demo again in class. With a real Measurement ID connected, watch the consent parameters on each hit in **Admin → DebugView** to prove Consent Mode is behaving.

## 4c. Printable receipt

The thank-you page renders the order as a receipt (mono type, dashed separators, fake barcode). Use the **Print receipt** button or Ctrl/Cmd-P — a print stylesheet strips the header, footer, banner and buttons so only the receipt prints.

Every item includes `item_id`, `item_name`, `item_category`, `price` and `quantity`, and money events use **currency "NZD"**.

## 4. Check events in GA4 (Realtime & DebugView)

1. Deploy the site (below) and open it in a browser.
2. In GA4 go to **Reports → Realtime** — you'll see yourself within seconds, and every event under **Event count by Event name**.
3. For **DebugView** (best for screenshots):
   - Add `?debug_mode=true` to any page URL, e.g. `https://<you>.github.io/kiwi-pantry/products.html?debug_mode=true`, or
   - run `localStorage.setItem("kp_debug","1")` in DevTools once, or
   - install the *Google Analytics Debugger* Chrome extension.
   - Then open **Admin → DebugView** and click through the store: view a product, add to cart, check out.
4. The built-in **GA4 event inspector** (yellow `GA4` pill, bottom-left of every page) mirrors the exact JSON payloads being sent — handy for grading or debugging offline.

## 5. UTM-friendly links for social traffic

GA4 attributes traffic automatically when URLs carry UTM parameters. Post these (replace the domain with yours):

| Channel | URL to post |
|---|---|
| Facebook | `https://vinujoseph25.github.io/kiwi-pantry/index.html?utm_source=facebook&utm_medium=social&utm_campaign=kiwi_pantry_launch` |
| Instagram | `https://vinujoseph25.github.io/kiwi-pantry/index.html?utm_source=instagram&utm_medium=social&utm_campaign=kiwi_pantry_launch` |
| X / Twitter | `https://vinujoseph25.github.io/kiwi-pantry/index.html?utm_source=twitter&utm_medium=social&utm_campaign=kiwi_pantry_launch` |
| TikTok | `https://vinujoseph25.github.io/kiwi-pantry/index.html?utm_source=tiktok&utm_medium=social&utm_campaign=kiwi_pantry_launch` |
| Email newsletter | `https://vinujoseph25.github.io/kiwi-pantry/index.html?utm_source=newsletter&utm_medium=email&utm_campaign=kiwi_pantry_launch` |

The footer's **"Share the demo"** list copies these for you (and fires a `share` event). Check results in **Reports → Acquisition → Traffic acquisition** (Session source/medium).

## 6. Deploy to GitHub Pages (step by step)

1. Create a **new repository** on GitHub (e.g. `kiwi-pantry`). Public is fine.
2. Upload everything inside this `site/` folder so `index.html` sits at the repo root:
   ```bash
   git init && git add . && git commit -m "Kiwi Pantry demo store"
   git branch -M main
   git remote add origin https://github.com/<you>/kiwi-pantry.git
   git push -u origin main
   ```
   (or drag the files into the repo via GitHub's **Add file → Upload files**)
3. In the repo: **Settings → Pages → Build and deployment → Source: "Deploy from a branch"**, choose **main / (root)** and **Save**.
4. Wait ~1 minute. Your store is live at `https://<you>.github.io/kiwi-pantry/`.
5. Replace the Measurement ID first (section 2), or edit `js/analytics.js` directly on GitHub and commit — Pages redeploys automatically.

## 7. Deploy to Netlify (alternative)

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the `site/` folder onto the page. Done — you get a `https://random-name.netlify.app` URL.
3. Optional: **Site settings → Change site name** for a nicer URL.

## 8. Run locally

Just open `index.html` in a browser, or serve the folder properly:

```bash
npx serve .          # or: python3 -m http.server 8000
```

## 9. Customise
- **Products** — edit `js/data.js` (id, name, category, NZD price, unit, badge, image, description). The listing, detail, cart and checkout all update automatically.
- **Categories** — edit `KP.CATEGORIES` and `KP.CATEGORY_META` in `js/data.js`.
- **Colours / fonts** — CSS custom properties at the top of `css/style.css`.
- **Cart** — lives in `localStorage` under the key `kiwipantry_cart`; clear it from DevTools → Application → Local Storage.

## 10. GA4 funnel exploration (for the report screenshots)

1. Generate data first: complete 3–4 full demo orders across desktop + mobile (add `?debug_mode=true` while testing). Standard reports can take a few hours to process — don't leave this until the night before.
2. In GA4: **Explore → Funnel exploration**.
3. Under **Steps**, add four steps in order: `view_item` → `add_to_cart` → `begin_checkout` → `purchase`.
4. Settings worth showing off: **Breakdown → Device category** (proves responsive traffic), toggle between **open/closed funnel**, and enable **Show elapsed time**.
5. Screenshot the bar chart with the step drop-offs — that plus a DebugView capture of `purchase` is the heart of the assignment.
6. Optional flex: add a second funnel starting at `view_item_list`, or segment by `Session source/medium` to compare your UTM social links.
