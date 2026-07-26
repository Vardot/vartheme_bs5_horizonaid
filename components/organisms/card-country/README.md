# Country Card

A Bootstrap card for a country / destination teaser: an uploaded photo, a dark footer with a single drag & drop content area, and an optional "Learn more" style link. The footer is clipped to a compact height by default and expands on hover/focus to reveal the full content and link — always expanded inside the Drupal Canvas editor's own canvas, so nothing dropped into the slot ever looks hidden while editing.

## Bootstrap reference

> [Bootstrap 5.3 — Card](https://getbootstrap.com/docs/5.3/components/card/)
> [Bootstrap 5.3 — Link](https://getbootstrap.com/docs/5.3/helpers/colored-links/)

## What it does

Use this component for a "destinations" / "countries" grid item that can:

- show an uploaded photo, cropped to cover the card (drimage sizes the derivative to the container so it stays sharp at every breakpoint)
- hold one drag & drop content slot for the country name and description (drop a Heading + Text component)
- clip the footer to a compact height by default (roughly a one-line title) and expand it on hover/focus to reveal the rest of the content and the link
- optionally show a "Learn more" style link with a warning-colored underline
- apply a brand background color to the footer, a border, rounded corners, and a shadow

## Files

- `card-country.component.yml` — component schema and props
- `card-country.twig` — component template
- `card-country.scss` / `card-country.css` — component styles
- `card-country.js` — forces the hover-reveal state open inside the Drupal Canvas editor (see Notes)
- `README.md` — usage notes and examples
- `card-country.mdx` — Storybook docs page
- `card-country.stories.json` — Storybook story configuration
- `card-country.stories.twig` — Storybook story templates

## Props overview

### Photo

- `image`: Canvas image object (`src`, `alt`, `width`, `height`) — the destination photo, cover-cropped to fill the card above the footer

### Appearance

- `background_color`: brand background color applied to the footer — `none`, `bg-body-tertiary`, `bg-tertiary`, `bg-accent`, `bg-primary`, `bg-primary-subtle`, `bg-secondary`, `bg-secondary-subtle`, `bg-dark`; defaults to `bg-dark`
- `card_border`: adds `border` (otherwise `border-0`); defaults to `false`
- `corner_style`: Bootstrap rounded utility — `rounded-0`, `rounded-1`, `rounded-2`, `rounded-3`, `rounded-4`, `rounded-5`, `rounded-pill`; defaults to `rounded-4`
- `box_shadow`: `shadow-none`, `shadow-sm`, `shadow`, `shadow-lg`; defaults to `shadow-none`
- `equal_height`: adds `h-100` to the card wrapper; defaults to `false`

### Link

- `link_url`: optional "Learn more" link URL; leave empty to hide the link
- `link_text`: visible label for the link; defaults to `Learn more`
- `link_target`: `default`, `_self`, `_blank`; defaults to `default`. `_blank` automatically adds `rel="noopener noreferrer"`.

## Slots

- `content` — drag & drop content area for the country name and description (drop a Heading + Text component). Clipped to a compact height until the card is hovered or focused (always expanded in the Drupal Canvas editor).

## Background color options

| Value | Label |
|---|---|
| `none` | None (transparent) |
| `bg-body-tertiary` | Body tertiary |
| `bg-tertiary` | Tertiary |
| `bg-accent` | Accent |
| `bg-primary` | Primary |
| `bg-primary-subtle` | Primary subtle |
| `bg-secondary` | Secondary |
| `bg-secondary-subtle` | Secondary subtle |
| `bg-dark` | Dark |

## Example: default country card

```twig
{% embed 'vartheme_bs5_horizonaid:card-country' with {
  image: { src: '/path/to/photo.jpg', alt: 'Peru', width: 720, height: 940 },
  background_color: 'bg-dark',
  corner_style: 'rounded-4',
  box_shadow: 'shadow-sm',
  link_url: 'https://example.com/peru',
  link_text: 'Learn more',
} %}
  {% block content %}
    <h3 class="h5 mb-0 text-white">Peru</h3>
    <p class="mb-0 text-white-50 mt-2">Discover the ancient wonders of Machu Picchu and the vibrant culture of the Andes.</p>
  {% endblock %}
{% endembed %}
```

## Example: no link

```twig
{% embed 'vartheme_bs5_horizonaid:card-country' with {
  image: { src: '/path/to/photo.jpg', alt: 'Japan', width: 720, height: 940 },
  background_color: 'bg-primary',
} %}
  {% block content %}
    <h3 class="h5 mb-0 text-white">Japan</h3>
    <p class="mb-0 text-white-50 mt-2">A blend of ancient tradition and futuristic cities.</p>
  {% endblock %}
{% endembed %}
```

## Notes

- **The card's total height is fixed** (`--card-country-height`, default `26.25rem` / 420px) so the hover reveal never grows the card itself — that would reflow the grid and push everything below it down the page. The photo (`flex-grow-1`) and footer (`flex-shrink-0`, explicit `height`) are flex children of a fixed-height column, so as the footer's height animates from collapsed to expanded, the photo shrinks to make room within that fixed budget — the photo gets visibly smaller while hovered, exactly like the reference, with **no separate transition or transform on the photo itself**: only `.card-country__footer`'s `height` has a `transition`, so it is the sole animated property in the whole reveal. `equal_height: true` overrides this with Bootstrap's `h-100` (which compiles `!important`), so the card matches its row siblings instead.
- **The photo fills the media area at every size.** `atoms/image` renders with `ratio: ratio-auto` here (the media area's height is dynamic, not one of `atoms/image`'s fixed ratio presets), so its `<img>` keeps Bootstrap's `.img-fluid` `height: auto` by default and would size itself only by its own intrinsic aspect ratio — ignoring the shrinking flex box entirely. `card-country.scss` overrides this on `.card-country__photo img` (a class + element selector, naturally more specific than the bare `.img-fluid` class, so no `!important` needed) with `height: 100%; object-fit: cover;`, and `object-position: top` so the crop is always anchored to the top of the photo — as the media area shrinks, height is trimmed from the bottom only, not both edges.
- The footer's collapsed height (`--card-country-footer-collapsed-h`, default `5rem` / 80px) roughly hugs a one-line title; the expanded height (`--card-country-footer-expanded-h`, default `18.375rem` / 294px) fits the description and link plus the link's own `1.5rem` bottom gap — `26.25rem` total leaves `21.25rem` for the photo collapsed and `7.875rem` expanded. Padding stays a consistent `p-4` (24px, `box-sizing: border-box` via Bootstrap's reboot) in both states, so nothing shifts or re-flows besides the animated height. The **first child** dropped into the `content` slot (typically the Heading) is the always-visible title and never moves. Everything after it, plus the link, is treated as "extra": hidden `1.25rem` below its resting position with `opacity: 0`, then slides up to `translateY(0)` / `opacity: 1` on hover or focus, `0.08s` (≈80ms) after the footer starts expanding — matching the reference reveal animation without needing a second slot. The link wrapper carries its own `mb-4` (`1.5rem`) on top of the footer's `p-4` bottom padding, so there's `3rem` of clear space between "Learn more" and the card's bottom edge, not just the footer's own padding.
- **The footer is `d-flex flex-column justify-content-between`**, so the optional link is pushed to the footer's bottom edge whenever there's spare vertical room (mainly the expanded state) — the CTA stays pinned to the bottom of the panel via flexbox alone, no absolute positioning needed.
- The link uses Bootstrap's [colored link helpers](https://getbootstrap.com/docs/5.3/helpers/colored-links/) (`link-light` for the text, `link-underline-warning` for the underline — `#FFC72C` gold, this theme's `$warning`/`$primary`) rather than custom CSS. `card-country.scss` forces the underline color with an explicit `.card-country__link.link-underline-warning` override: the compiled Bootstrap bundle emits the base `.link-underline` utility (blue `$accent`, from `$link-color`) *after* `.link-underline-warning`, and both carry `!important` at equal specificity, so without the override the base class's blue wins the tie instead of the intended gold (the same fix `organisms/impressed-card-slider` applies for its own link list).
- If no content is provided, a small "Drop heading & text here" hint is rendered.
- Boolean props (`card_border`, `equal_height`) are validated and defaulted by SDC, so they arrive as real booleans.
- **`card-country.js` keeps the reveal permanently open inside the Drupal Canvas editor's own canvas** (`.card-country--editor-reveal`, styled in `card-country.scss` to match the `:hover`/`:focus-within` state) — without it, a second component dropped into the `content` slot (e.g. a Text under the Heading) would only ever become visible on hover, which reads as "hidden" while editing. Progressive enhancement: without JS (and on the public front-end / Canvas's own live-preview iframe, both of which are explicitly skipped) the card behaves exactly as the CSS defines — hover/focus to reveal.
