# Impressed Card Slider

A feature section: a heading, a short list of links, and a CTA on the left; a horizontally-scrolling row of existing ["Impressed Card"](../card-impressed/README.md) components on the right, with prev/next controls below. Add one or more Impressed Card components into the slot — unlimited, drag & drop reorder.

## Bootstrap reference

Bootstrap has no component for a multi-item-visible slider — only the single-slide-at-a-time [Carousel](https://getbootstrap.com/docs/5.3/components/carousel/), which doesn't fit this pattern. The scrolling track instead uses [CSS Scroll Snap](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap) (MDN), the same technique `organisms/country-slider` established. The prev/next controls and CTA reuse Bootstrap's [Buttons](https://getbootstrap.com/docs/5.3/components/buttons/) (the CTA via `atoms/button`), and the link list reuses [colored links](https://getbootstrap.com/docs/5.3/helpers/colored-links/) utilities.

## What it does

Use this component when you need to:

- present a heading, a short list of category/section links (one shown as active/underlined), and a CTA next to a horizontally-scrolling row of cards, with no fixed limit on how many cards
- let editors add, remove, and reorder cards freely in Canvas by dropping in existing "Impressed Card" components
- show ~2 cards at a time on desktop with a peek of the next (2 on small/medium screens, ~1 with a peek on mobile), advanced with prev/next buttons

## Why a slot for cards but flat props for links

Drupal Canvas has no field/widget mapping for a `type: array` prop whose items are freeform objects — only scalar arrays or `$ref`'d shapes like a single image are supported. A component with such a prop fails Canvas's requirements check silently and never appears in the component picker.

- The cards need to be **unlimited**, so they use a `cards` **slot** (the same pattern `organisms/programs` uses with `molecules/program-tab`, and `organisms/country-slider` uses with `organisms/card-country`): drop as many existing "Impressed Card" instances as you want.
- The links are a **small, bounded** list (not unlimited), so they're a fixed set of `link_1_*`..`link_4_*` scalar props instead of a slot. Even though a link is just a label + URL, it still isn't one of Canvas's "well-known" `$ref` shapes (only images, video, and content-entity references are), so an array of link objects would hit the exact same picker-visibility problem — bounded flat props sidestep it entirely, the same pattern `card-hero` uses for its button props.

## Files

- `impressed-card-slider.component.yml` — component schema, props, and the `cards` slot
- `impressed-card-slider.twig` — component template (heading/links/CTA column, scroll track, controls)
- `impressed-card-slider.scss` / `impressed-card-slider.css` — the Scroll Snap track, 2-line text clamp, control button sizing, and the arrow hover nudge
- `impressed-card-slider.js` — drives the prev/next buttons and their disabled-at-the-end state (see Notes)
- `README.md` — usage notes and examples

## Props overview

- `bg_edge2edge`: extend the background full width, beyond the container; defaults to `true`
- `background_color`: Bootstrap background utility — same full palette as `atoms/section` (`none`, `bg-body`, `bg-body-secondary`, `bg-body-tertiary`, `bg-tertiary`, `bg-accent`, `bg-primary`/`-subtle`, `bg-secondary`/`-subtle`, `bg-success`/`-subtle`, `bg-danger`/`-subtle`, `bg-warning`/`-subtle`, `bg-info`/`-subtle`, `bg-light`/`-subtle`, `bg-dark`/`-subtle`, `bg-black`, `bg-white`, `bg-transparent`); defaults to `bg-dark`. Dark-enough options (`bg-primary`, `bg-secondary`, `bg-success`, `bg-danger`, `bg-dark`, `bg-black`, `bg-accent`) automatically flip the heading/links/placeholder text to white; every other option keeps dark text.
- `container_type`: `container`, `container-fluid`, or `none`; defaults to `container`
- `padding_block_start` / `padding_block_end`: Bootstrap `pt-*`/`pb-*` spacing utilities (same enum as `atoms/section`, `0`–`5`); both default to `5` so the section keeps its original breathing room out of the box
- `heading_text`: heading text; defaults to `Latest Updates`
- `heading_level`: HTML heading level (1–6); defaults to `2`
- `link_N_label` / `link_N_url` / `link_N_active` (`N` = `1`–`4`): each link's label, URL, and whether it shows the active underline. Leave a label empty to hide that link (and any links after it that are also empty).
- `cta_label`: CTA label; defaults to `Explore More`
- `cta_url`: CTA URL; leave empty to hide the CTA
- `cta_target`: `default`, `_self`, or `_blank`

## Slots

- `cards` — add one or more [`organisms/card-impressed`](../card-impressed/README.md) components here (unlimited, drag & drop reorder). Drop a Badge component into each card's `overlay` slot for the NEWS/REPORT-style label, and a Heading + Text into its `content` slot for the title/description.

## Example

```twig
{% embed 'vartheme_bs5_horizonaid:impressed-card-slider' with {
  heading_text: 'Latest Updates',
  link_1_label: 'Healthcare & Medicine',
  link_1_url: '/updates/healthcare',
  link_1_active: true,
  link_2_label: 'Sustenance & Growth',
  link_2_url: '/updates/sustenance',
  cta_label: 'Explore More',
  cta_url: '/updates'
} %}
  {% block cards %}
    {% embed 'vartheme_bs5_horizonaid:card-impressed' with {
      media_image: { src: '/sites/default/files/news-1.jpg', alt: 'Volunteer handing supplies to a person in need', width: 800, height: 450 },
      background_color: 'bg-dark'
    } %}
      {% block overlay %}
        {% include 'vartheme_bs5_horizonaid:badge' with { label: 'News', variant: 'text-bg-dark' } only %}
      {% endblock %}
      {% block content %}
        <h3>Bridging Medical Gaps in Border Corridors</h3>
        <p>Our mobile health units successfully delivered emergency pediatric medicine and preventative care.</p>
      {% endblock %}
    {% endembed %}
  {% endblock %}
{% endembed %}
```

## Notes

- The track (`[data-impressed-card-slider-track]`) is a native scrollable element with CSS Scroll Snap and `tabindex="0"` — it's swipeable and keyboard-scrollable without JS. `impressed-card-slider.js` adds the prev/next buttons' click-to-scroll behavior and disables each button at its respective scroll boundary.
- `impressed-card-slider.js` moves any "Impressed Card" instance found nested inside extra markup to be a direct child of the track before measuring/scrolling — the same defensive step `hero-slider-container` takes for `.carousel-item`, in case Canvas ever wraps slot children.
- `card-impressed` has no built-in text truncation, so `impressed-card-slider.scss` clamps each card's dropped `<p>` content to 2 lines, scoped only to cards inside this slider's track — `card-impressed` itself is unchanged.
- Each active link (`link_N_active: true`) reuses `atoms/link`'s `underline_color`/`underline_opacity`/`underline_offset` props (the same pattern `card-country` uses for its "Learn more" link) rather than custom CSS.
- With no Impressed Card items in the slot, a small "Add "Impressed Card" components here." placeholder renders instead.
- The CTA renders via [`atoms/button`](../../atoms/button/README.md) (`variant: btn-accent`, `radius: rounded-pill`) rather than a styled link, and only renders when `cta_url` is set.
- The prev/next control buttons render a custom pill-outline-and-arrow SVG icon (the outline and arrow are both part of the artwork, colored via `currentColor` from the button's `.text-primary` class — not a CSS border, so this isn't reachable with Bootstrap utilities alone). The "next" icon reuses the same markup as "prev", mirrored with `transform: scaleX(-1)` rather than duplicating the path data. On hover/focus, only the arrow (grouped in its own `<g>`, not the pill outline) nudges a little further in the direction it points — disabled via `prefers-reduced-motion: reduce`, and skipped entirely while a button is `:disabled`.
