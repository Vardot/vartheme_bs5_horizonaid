# Programs

A pill-tabbed programs showcase container. A nav-pills tab list floats over the top of the active tab's image on `lg`+ screens (stacked above it on smaller screens) while each tab pane swaps a full-width image for a content card inset at its bottom-right corner. Add one or more ["Program Tab"](../../molecules/program-tab/README.md) components into the slot — unlimited, drag & drop reorder.

## Bootstrap reference

> [Bootstrap 5.3 — Navs and tabs](https://getbootstrap.com/docs/5.3/components/navs-tabs/)

## What it does

Use this component when you need to:

- present programs/services as pill tabs overlaid on a shared image + card area, with no fixed limit on how many
- let editors add, remove, and reorder tabs freely in Canvas by dropping in "Program Tab" components
- keep the pill nav in place while only the image/card content changes per tab

## Why a slot instead of an array prop

Drupal Canvas has no field/widget mapping for a `type: array` prop whose items are freeform objects (title + image + text + link) — only scalar arrays or `$ref`'d shapes like a single image are supported. A component with such a prop fails Canvas's requirements check silently and never appears in the component picker. This container instead uses a `tabs` **slot**, the same unlimited-repeat pattern `organisms/hero-slider-container` uses with `molecules/hero-slide`: drop as many self-contained child component instances as you want.

## Files

- `programs.component.yml` — component schema, props, and the `tabs` slot
- `programs.twig` — component template (nav shell + tab-content wrapper)
- `programs.js` — moves each Program Tab's pill button into the shared nav and ensures one active tab (see Notes)
- `programs.scss` / `programs.css` — responsive nav positioning (overlay on `lg`+, stacked below)
- `README.md` — usage notes and examples

## Props overview

- `tabs_id`: id applied to the tab list `<ul>` and tab-content wrapper; defaults to `programs-tabs`. Change this if more than one Programs component is placed on the same page.
- `container_type`: `container`, `container-fluid`, or `none`; defaults to `container`

## Slots

- `tabs` — add one or more [`molecules/program-tab`](../../molecules/program-tab/README.md) components here (unlimited, drag & drop reorder). Each instance carries its own title, image, card text, and link.

## Example

```twig
{% embed 'vartheme_bs5_horizonaid:programs' with {
  tabs_id: 'programs-tabs'
} %}
  {% block tabs %}
    {% include 'vartheme_bs5_horizonaid:program-tab' with {
      active: true,
      title: 'Education',
      image: { src: '/sites/default/files/education.jpg', alt: 'Children smiling outside a rebuilt school', width: 1200, height: 675 },
      card_title: 'Education',
      card_text: 'Building safe schools and training local teachers to give children a clear path to a brighter future.',
      link_url: '/programs/education'
    } only %}
    {% include 'vartheme_bs5_horizonaid:program-tab' with {
      title: 'Women',
      image: { src: '/sites/default/files/women.jpg', alt: 'Two women standing together in a field', width: 1200, height: 675 },
      card_title: 'Women',
      card_text: 'Providing legal defense, grants, and leadership training to help women break poverty cycles.',
      link_url: '/programs/women'
    } only %}
  {% endblock %}
{% endembed %}
```

## Notes

- The nav `<ul>` renders empty on the server; `programs.js` moves each Program Tab's pill `<button>` into it on page load. Without JS, the currently-active tab's button still renders (nested inside its own visible pane) — Bootstrap tabs are inherently JS-dependent for interactivity regardless, the same baseline as `molecules/tabs` and `organisms/hero-slider-container`.
- If no Program Tab is marked `active`, `programs.js` auto-activates the first one — mirroring `hero-slide`'s "If no slide is active, the container will auto-activate the first slide."
- Bootstrap's Tab plugin discovers sibling nav buttons by querying the closest `.nav`/`[role="tablist"]` ancestor of the clicked button, and finds each target pane by ID selector lookup — neither depends on DOM nesting depth, so no `.tab-pane` "flattening" step (unlike `hero-slider-container`'s `.carousel-item` flattening) is needed.
- The nav only overlays the image on `lg`+ (via `programs.scss`); below `lg` it stays in normal flow, stacked above the image. An absolutely-positioned nav has no bounded height, so once enough pills wrap to multiple lines on a narrow screen it would otherwise grow down over the tab content underneath it.
- With no Program Tab items in the slot, a small "Add "Program Tab" components here." placeholder renders instead.
- The component depends on `vartheme_bs5_horizonaid/bs-tab-script` (Bootstrap's tab plugin) and `core/once`.
