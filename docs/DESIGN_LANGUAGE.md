# ONYX EVOLUTION — Design Language

The single source of truth for the site's visual system. Every page follows it. When adding a page, take components from here rather than inventing new ones — if something genuinely new is needed, add it to this file in the same format.

The brand is a distributor of PPF (paint protection film) and ceramic coatings in Serbia. The mark is a faceted onyx stone with a cyan gleam. The site should feel like precision equipment: dark, quiet, engineered. Not luxury-glossy, not sporty.

---

## 1. Colour

Define these once as theme tokens. Never hardcode a hex in a component.

| Token | Value | Use |
| --- | --- | --- |
| `onyx-900` | `#040506` | Deep bands — utility bar, hero base, warranty block, CTA band, footer |
| `onyx-850` | `#07080A` | Page background |
| `onyx-800` | `#0D1013` | Cards, inputs, tiles, table rows |
| `onyx-700` | `#12181D` | Hover state for tiles and rows |
| `text` | `#EAEEF1` | Primary text |
| `text-60` | `rgba(234,238,241,.62)` | Body copy |
| `text-40` | `rgba(234,238,241,.40)` | Meta, mono labels, counts |
| `text-34` | `rgba(234,238,241,.34)` | Decorative second lines, copyright. **Never** for information the user needs |
| `accent` | `#2AB3E6` | The logo cyan — accents, prices, primary buttons, active states |
| `accent-hi` | `#7FD6F5` | Accent hover |
| `accent-deep` | `#0E3547` | Dark teal, for pattern and gradient bases only |
| `hairline` | `rgba(255,255,255,.08)` | Default 1px borders |
| `hairline-strong` | `rgba(255,255,255,.22)` | Secondary button border |
| `accent-line` | `rgba(42,179,230,.30)` | Cyan hairline separating major bands |
| `success` | `#3ED598` | Confirmations, in stock |
| `warning` | `#E8B44A` | Low stock, pending warranty |
| `danger` | `#E5484D` | Errors, out of stock |

Rules

- Two surface colours per screen, maximum. Depth comes from hairlines, not from a ramp of greys.
- Cyan is punctuation. If more than roughly a tenth of a screen is cyan, cut it back.
- No colour outside this table. Semantic colours appear only on status, never as decoration.
- No white surfaces anywhere. The site is dark-only; do not build a light theme.

Gradients — only these three exist:

```
promo-panel  linear-gradient(145deg, #0F1418 0%, #040506 100%)
cta-band     linear-gradient(120deg, #040506 0%, #0B1216 52%, #040506 100%)
hero-scrim   linear-gradient(96deg, rgba(4,5,6,.96) 0%, rgba(4,5,6,.86) 38%, rgba(4,5,6,.25) 66%, rgba(4,5,6,.55) 100%)
```

No other gradient. No gradient text, no gradient borders, no glow behind cards.

## 2. Typography

Two families, from Google Fonts, Latin Extended subset so Serbian diacritics (Ć Č Š Ž Đ) are in the first paint. `display: swap`, preconnect.

- **Questrial 400** — display and body. One weight only. Hierarchy comes from size, tracking and colour, never from weight. All headings uppercase.
- **Space Mono 400** — every label, eyebrow, nav item, price, badge, button label, numeral, breadcrumb, table header.

The mono/geometric split is the core signal of the brand. If a piece of text is data or a label, it is mono. If it is language, it is Questrial.

| Role | Family | Size | Tracking | Line height |
| --- | --- | --- | --- | --- |
| Hero h1 | Questrial | 104 | .02em | .92 |
| Page h1 | Questrial | 72 | .03em | .98 |
| Section h2 | Questrial | 44 | .04em | 1.1 |
| Block h2 (warranty) | Questrial | 58 | .03em | .98 |
| Panel h3 | Questrial | 52 | .03em | 1 |
| Card h3 | Questrial | 26 | .04em | 1.2 |
| Kit card name | Questrial | 19 | .02em | 1.4 |
| Product name | Questrial | 15 | .02em | 1.4 |
| Body large | Questrial | 16 | 0 | 1.75 |
| Body | Questrial | 15 | 0 | 1.75 |
| Body small | Questrial | 13.5 | 0 | 1.8 |
| Eyebrow | Space Mono | 10 | .30em | 1 |
| Nav / button label | Space Mono | 10–11 | .20em | 1 |
| Column header | Space Mono | 9 | .28em | 1 |
| Price | Space Mono | 13–14 | 0 | 1 |
| Badge / meta | Space Mono | 8–9 | .24em | 1 |
| Step numeral | Space Mono | 22 | 0 | 1 |

Rules

- Every section is introduced by an eyebrow in accent mono above the h2. This is non-negotiable — it is the site's rhythm.
- Two-line headlines are the house style: line one in `text`, line two in `accent` (for a claim) or `text-34` (for a qualifier). Never both in one headline.
- Body copy is capped at 470–520px regardless of container width.
- Mono labels never go below 12px on mobile. If space is tight, reduce tracking to `.16em`; do not shrink the type.
- No italics. No bold. No underlines except the active-nav rule and inline links in body copy.
- `text-wrap: pretty` on paragraphs, `text-wrap: balance` on headlines.

## 3. Geometry and space

No rounded corners anywhere. `border-radius: 0` globally.

**The notch** is the one recurring motif — the top-right corner cut at 45°, echoing the faceted mark.

```css
clip-path: polygon(0 0, calc(100% - var(--notch)) 0, 100% var(--notch), 100% 100%, 0 100%);
```

| Element | Notch |
| --- | --- |
| Kit card | 22px |
| Product card | 18px |
| Button, input, newsletter field | 12px |
| Cart chip, small pill | 9px |

Expose the notch as a CSS variable so the whole motif can be switched off in one place. Never notch a different corner, never notch two corners, never notch a section or an image.

Layout

- Content container `max-width: 1440px`, padding `0 72px`, centred. Backgrounds are always full-bleed; only content is constrained.
- Vertical rhythm: `96px` above a section on page background, `104px` above a dark band. Tablet 64px, mobile 48px.
- Spacing scale: 4 / 8 / 12 / 14 / 20 / 24 / 26 / 34 / 40 / 60 / 72 / 90px. Stay on it.
- Minimum supported width 1200px before the tablet breakpoint takes over.

**The hairline lattice** — the house way to group cells (steps, categories, spec tables, feature grids). A wrapper with `background: hairline` and `gap: 1px`; each cell gets the surface colour. This produces exact 1px dividers with no border maths.

```css
.lattice { display: grid; gap: 1px; background: var(--hairline); border: 1px solid var(--hairline); }
.lattice > * { background: var(--onyx-800); }
```

Use it in preference to bordered cards whenever cells are adjacent.

## 4. Components

Every one of these already exists in the reference prototype. Reuse, don't re-derive.

**Buttons** — height 54px (48px in compact contexts), padding `0 30px`, Space Mono 11px `.2em`, notch 12.
- *Primary*: `accent` fill, `#040506` label. Hover `accent-hi`.
- *Secondary*: transparent, `1px solid hairline-strong`, `text` label. Hover border and label to `accent`.
- *Outline accent*: transparent, `1px solid accent`, `accent` label. Hover inverts to accent fill with `#040506` label.
- Trailing `→` on any button that navigates. No icons otherwise.

**Inputs** — height 44–48px, `onyx-800`, `1px solid hairline`, notch 12, Space Mono 10.5px `.18em`, placeholder `text-34`. Focus: border `rgba(42,179,230,.55)` plus a visible keyboard ring. Never remove the focus ring.

**Product card** — `onyx-800`, hairline border, notch 18. Image area with a hairline bottom border, then 20px padding: name (Questrial 15px), price (accent mono 13px). Hover: border to `rgba(42,179,230,.4)`, 200ms. Badges sit flush in the image's top-left corner: accent fill, `#040506`, Space Mono 8px `.2em`, 6px/10px padding.

**Kit / feature card** — as above at 424px wide, notch 22, 300px image, 26px padding, with a mono category label above the name.

**Category tile** — lattice cell, 40px/34px padding, min-height 208px, `justify-content: space-between`. Top: count in mono 9px `text-40`. Bottom: uppercase Questrial 26px title, then a 22px accent rule + `POGLEDAJ` in accent mono 9px. Hover `onyx-700`.

**Eyebrow** — accent mono 10px `.3em`. Optionally preceded by a 40px accent rule (hero and hero-like contexts only).

**Spec ticker** — 62px band on `onyx-900`, top border `accent-line`, bottom hairline. Mono 10px `.24em` items justified across the container, separated by `◆` in `rgba(42,179,230,.5)`. Static — never a marquee.

**Step row** — a lattice of numbered cells: accent mono 22px numeral, then 13.5px copy. Used for any process (warranty registration, installation, returns).

**Numbered / boxed eyebrow** — accent mono 9px inside `1px solid rgba(42,179,230,.35)`, 8px/14px padding. Marks a named programme (`ONYX WARRANTY`).

**Diamond image** — `clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%)` on a square. The brand's one shaped image. Use it once per page at most, for a hero-adjacent portrait or product detail. Keep the subject centred.

**Prism pattern** — the faceted triangle field in `onyx-prism.svg` (already recoloured to the palette: onyx facets rising through `#207FA6` to `#2AB3E6` and `#7FD6F5`). House usage:

```css
position: absolute; top: 0; bottom: 0; left: 52%; right: 0;
background: url(/patterns/onyx-prism.svg) right top / cover no-repeat;
mix-blend-mode: screen; opacity: .82;
mask-image: radial-gradient(128% 132% at 100% 4%, #000 0%, #000 38%, transparent 82%);
```

Constrained to one corner of a dark band, screen-blended, masked so it dissolves before reaching any text, with `radial-gradient(72% 78% at 92% 18%, rgba(42,179,230,.2), transparent 70%)` behind it as a glow and a hairline `linear-gradient(90deg, transparent, rgba(42,179,230,.55))` catching the band's bottom edge. **Never** tile it across a full section, never put text on top of it, never use it on a light or mid surface. One instance per page.

## 5. Motion

Restrained by design. The energy is typographic.

- Hover transitions: 200ms, `border-color` / `background-color` / `color` only.
- Carousel: transform only, `.55s cubic-bezier(.22,.61,.36,1)`.
- No entrance animations, no scroll reveals, no parallax, no counters, no marquees, no hover lift or scale.
- Respect `prefers-reduced-motion: reduce` — drop to no transition.

## 6. Page architecture

Every page: utility bar → sticky header (two rows) → `main` → CTA band → footer. Header and footer are identical everywhere.

**Utility bar** — 38px, `onyx-900`, bottom hairline, mono 10px `.2em`. Left: `OVLAŠĆENI DISTRIBUTER ZA SRBIJU` (accent) + `BESPLATNA DOSTAVA PREKO 15.000 RSD`. Right: `PODRŠKA +381 11 4067 200` · `|` · `SR / EN`.

**Header** — sticky at `top: 0`, `z-index: 40`, `rgba(7,8,10,.92)` with `backdrop-filter: blur(14px)`, bottom hairline.
- Row 1 (84px): logo lockup — `ONYX` Questrial 25px `.3em` with the **Y in accent**, beneath it a centred row of 10px accent rule + `EVOLUTION` mono 8px `.42em` accent + 10px accent rule. Then search (flex, max 520px, accent `↵` glyph pinned right). Then, pushed right: `GARANCIJA`, `NALOG`, and a cart chip (accent text, `1px solid rgba(42,179,230,.4)`, notch 9, count dimmed, hover fills `rgba(42,179,230,.1)`).
- Row 2 (48px, top hairline): `PPF FOLIJE` · `MAT PPF` · `FAROVI I SVETLA` · `KERAMIČKI PREMAZI` · `ALAT I MONTAŽA` · `SETOVI`, 34px gaps, and pushed right in accent `POSTANI INSTALATER →`. Active item: full-white with a 1px accent underline 3px below the text, plus `aria-current`.

**Page header (non-home)** — 260px band on `onyx-900`, bottom border `accent-line`. Breadcrumb in mono 9px `.24em` `text-40` with `/` separators, then the h1 at 72px, then optional one-line body in `text-60`. This replaces the hero on every interior page.

**Footer** — `onyx-900`, top hairline, 76px top padding, columns `1.3fr 1fr 1fr 1.4fr`, 60px gap: brand lockup + description + `IG` `FB` `YT` hairline chips; `PRODAVNICA`; `PODRŠKA`; `BILTEN` (copy, email field, full-width outline accent button `PRIJAVI SE`). Column headers mono 9px `.28em` `text-40`; links Questrial 13.5px, hover accent. Bottom bar: hairline top, `© 2026 ONYX EVOLUTION · SVA PRAVA ZADRŽANA` left, five hairline payment chips right.

## 7. Copy

Serbian, informal-professional (`ti` form on CTAs: `Istraži`, `Registruj`, `Postani`). Technical claims carry a number. No exclamation marks, no marketing superlatives, no emoji.

- Labels and nav: uppercase, in mono.
- Headlines: uppercase.
- Body: sentence case.
- Prices: `142.900,00 RSD` — dot thousands, comma decimals, currency after a space.
- Measurements: `8 MIL / 200 µm`, `152cm`, `99%`.
- Product names stay in English (`ONYX Shield 8.0`), descriptions in Serbian.

## 8. Responsive

Three breakpoints. The reference is desktop at 1440.

**≥1200px** — as specified above.

**768–1199px** — container padding 40px. Product grids 4→3 columns, category lattice 3→2. Kit cards 360px (recompute the carousel translate step as card width + gap). Split panels stack, image 16:9 on top. Warranty block stacks, diamond 240px, steps stay 3 across. Hero 520px, h1 64px; page h1 56px. Header collapses to logo + search icon + burger; nav row becomes a drawer. Rhythm 64px.

**<768px** — single column. Product grids 2 columns. Hero 460px, h1 40px `.02em`; page h1 40px. Carousels become horizontal scroll-snap strips, arrows hidden. Spec ticker becomes a two-column list. Footer columns stack, newsletter first. Body 14px minimum, tap targets 44px minimum. Prism pattern hidden below 768px. Rhythm 48px.

## 9. Quality bar

- Semantic HTML: one `h1` per page, `header`/`nav`/`main`/`footer`, real `button` and `a`, `aria-label` on icon-only controls, `aria-current` on active nav.
- Contrast: body text and mono labels clear 4.5:1 against their surface. Verify accent-on-onyx and every `text-40` label. `text-34` is decorative only.
- Images: always `width`/`height` or `aspect-ratio` — zero layout shift. AVIF/WebP, `object-fit: cover`. Product photography on a near-black background so it merges with `onyx-800`.
- Content lives in data files or a CMS collection, never hardcoded in components. Products, categories, nav and footer links are all client-editable.
- Keyboard: full tab traversal, visible focus everywhere, no focus traps, Escape closes drawers and modals.
- No third-party blocking scripts. No web fonts beyond the two families.

## 10. Adding a new page — checklist

1. Utility bar, header, page-header band, CTA band, footer come from the shared layout. Do not restyle them.
2. Open with an eyebrow + h2. Use the two-line headline pattern.
3. Reach for the lattice before you reach for bordered cards.
4. Pick components from §4. If you need something new, build it from hairlines, one notch, and the type scale — then document it here.
5. One accent-filled primary button per screen region. Everything else is secondary or outline.
6. At most one prism instance and one diamond image per page.
7. Check the page at 1200 / 1440 / 1920 and at both smaller breakpoints before calling it done.
