# Country Slider

A heading + description above a horizontally-scrolling row of ["Country Card"](../card-country/README.md) components, with a "View all" link and prev/next controls. Add one or more Country Card components into the slot — unlimited, drag & drop reorder.

## Bootstrap reference

Bootstrap has no component for a multi-item-visible slider — only the single-slide-at-a-time [Carousel](https://getbootstrap.com/docs/5.3/components/carousel/), which doesn't fit this pattern. The scrolling track instead uses [CSS Scroll Snap](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap) (MDN), the theme's first use of this technique. The prev/next controls and "View all" link still reuse Bootstrap's [Buttons](https://getbootstrap.com/docs/5.3/components/buttons/) utilities.

## What it does

Use this component when you need to:

- present a heading, description, and a row of country/destination cards that scrolls horizontally, with no fixed limit on how many cards
- let editors add, remove, and reorder cards freely in Canvas by dropping in existing "Country Card" components
- show 4 cards at a time on desktop (2 on small/medium screens, ~1 with a peek of the next on mobile), advanced with prev/next buttons

## Why a slot instead of an array prop

Drupal Canvas has no field/widget mapping for a `type: array` prop whose items are freeform objects — only scalar arrays or `$ref`'d shapes like a single image are supported. A component with such a prop fails Canvas's requirements check silently and never appears in the component picker. This container instead uses a `cards` **slot**, the same unlimited-repeat pattern `organisms/programs` uses with `molecules/program-tab`: drop as many existing "Country Card" instances as you want.

## Files

- `country-slider.component.yml` — component schema, props, and the `cards` slot
- `country-slider.twig` — component template (heading/description, scroll track, footer with "View all" link + controls)
- `country-slider.scss` / `country-slider.css` — the Scroll Snap track and control button sizing
- `country-slider.js` — drives the prev/next buttons and their disabled-at-the-end state (see Notes)
- `README.md` — usage notes and examples

## Props overview

- `heading_text`: heading text; defaults to `Where We Work`
- `heading_level`: HTML heading level (1–6); defaults to `2`
- `description_text`: rich text (HTML) shown under the heading
- `container_type`: `container`, `container-fluid`, or `none`; defaults to `container`
- `cta_label`: "View all" link label; defaults to `View All Countries`
- `cta_url`: "View all" link URL; leave empty to hide the link
- `cta_target`: `default`, `_self`, or `_blank`

## Slots

- `cards` — add one or more [`organisms/card-country`](../card-country/README.md) components here (unlimited, drag & drop reorder).

## Example

```twig
{% embed 'vartheme_bs5_horizonaid:country-slider' with {
  heading_text: 'Where We Work',
  cta_label: 'View All Countries',
  cta_url: '/countries'
} %}
  {% block cards %}
    {% include 'vartheme_bs5_horizonaid:card-country' with {
      image: { src: '/sites/default/files/ecuador.jpg', alt: 'A mother holding her child', width: 600, height: 780 }
    } only %}
    {% include 'vartheme_bs5_horizonaid:card-country' with {
      image: { src: '/sites/default/files/kenya.jpg', alt: 'Women standing together', width: 600, height: 780 }
    } only %}
  {% endblock %}
{% endembed %}
```

Each `card-country` instance carries its own name/description via its `content` slot (drop a Heading + Text) — see [`organisms/card-country`'s README](../card-country/README.md).

## Notes

- The track (`[data-country-slider-track]`) is a native scrollable element with CSS Scroll Snap and `tabindex="0"` — it's swipeable and keyboard-scrollable without JS. `country-slider.js` adds the prev/next buttons' click-to-scroll behavior and disables each button at its respective scroll boundary.
- `country-slider.js` moves any "Country Card" instance found nested inside extra markup to be a direct child of the track before measuring/scrolling — the same defensive step `hero-slider-container` takes for `.carousel-item`, in case Canvas ever wraps slot children.
- The scroll step is measured from the first rendered `.card-country`'s actual width, so it stays correct across the mobile/tablet/desktop card-width breakpoints in `country-slider.scss` without needing to duplicate those widths in JS.
- With no Country Card items in the slot, a small "Add "Country Card" components here." placeholder renders instead.
- The "View all" link only renders when `cta_url` is set; the controls stay right-aligned via `ms-auto` either way.
- The prev/next control buttons render a custom pill-outline-and-arrow SVG icon (the outline and arrow are both part of the artwork, colored via `currentColor` from the button's `.text-dark` class — not a CSS border, so this isn't reachable with Bootstrap utilities alone). Unlike `impressed-card-slider` (which mirrors one icon with `scaleX(-1)`), prev and next each use their own distinct left-/right-pointing path data. On hover/focus, only the arrow (grouped in its own `<g>`, not the pill outline) nudges a little further in the direction it points — disabled via `prefers-reduced-motion: reduce`, and skipped entirely while a button is `:disabled`.
- Each `card-country` instance keeps its own normal hover behavior inside the slider too — footer collapsed by default, expanding on hover/focus (shrinking the photo to make room) exactly as it does everywhere else on the site. `country-slider.scss` only sets each card's width per breakpoint; it does not override the footer's height or transition.
