# Appendix — GA4 Measurement Plan: Kiwi Pantry

**Site:** https://vinujoseph25.github.io/kiwi-pantry/ (static HTML/CSS/vanilla JS, GitHub Pages)
**GA4 property:** G-TYKNB84W57 · **Currency:** NZD · **Tag:** gtag.js injected once from `js/analytics.js`

## Tracked events

| Event | Trigger | Key parameters | Type |
|---|---|---|---|
| `page_view` | Every page load | page_location, page_title | Automatic |
| `user_engagement`, `scroll`, `session_start` | Automatic | — | Enhanced measurement |
| `view_item_list` | Home "specials", shop listing, related products | item_list_id, item_list_name, items[] | Recommended (e-commerce) |
| `select_item` | Clicking any product card | item_list_name, items[] | Recommended |
| `view_item` | Product detail page | currency, value, items[] | Recommended |
| `add_to_cart` | Add buttons, quantity + | currency, value, items[] | Recommended |
| `remove_from_cart` | Quantity −, Remove | currency, value, items[] | Recommended |
| `view_cart` | Cart page viewed | currency, value, items[] | Recommended |
| `begin_checkout` | Checkout page with items | currency, value, items[] | Recommended |
| `purchase` | "Place demo order" submit | transaction_id (random, e.g. KP-MUWE…), value, tax (15% GST portion), shipping: 0, currency: "NZD", items[] | Recommended |
| `share` | Share button, footer UTM links | method, content_type, item_id | Recommended |
| `generate_lead` | Contact form submit (demo) | method | Recommended |
| `consent_choice` | Cookie banner accept/reject | consent_state (granted/denied) | Custom |

## Item parameters (every e-commerce event)

`item_id` · `item_name` · `item_category` · `price` · `quantity` (+ `index` in lists).
Example payload (verified in DebugView): `{ item_id: "kp-kiwifruit", item_name: "Golden Kiwifruit Punnet", item_category: "Fruit & Veg", price: 6.99, quantity: 1 }`

## Consent Mode v2

Default: `analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization` all **denied**.
Cookie banner fires `gtag("consent","update",…)`; choice persists in `localStorage` (`kp_consent`).
Proof in hits: `gcs=G100` (denied) before consent, `gcs=G111` (granted) after accept.

## Campaign tagging (UTM)

Campaign `kiwi_pantry_launch`; sources: facebook, instagram, twitter, tiktok (medium: social) and newsletter (medium: email). Links in README §5.

## Verification methods used

1. **GA4 Realtime** — live event counts while clicking through the store.
2. **DebugView** — `?debug_mode=true` URL flag; per-parameter inspection incl. `pr1=` item params.
3. **On-page event inspector** — custom floating panel logging the exact JSON payload of every event.

## Funnel (Explore → Funnel exploration)

`view_item` → `add_to_cart` → `begin_checkout` → `purchase`, closed funnel, breakdown by device category.
