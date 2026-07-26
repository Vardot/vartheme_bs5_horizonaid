# Program Tab

A single program tab item: a full-width image with a content card inset flush at its bottom-right corner, plus its own pill nav label. Meant to be placed inside [`organisms/programs`](../../organisms/programs/README.md)'s `tabs` slot. Add as many Program Tab items as you want and reorder via drag & drop in Canvas — there is no fixed limit.

## Bootstrap reference

> [Bootstrap 5.3 — Navs and tabs](https://getbootstrap.com/docs/5.3/components/navs-tabs/)

## What it does

Use this component when you need to add one program/service tab to a "Programs" container:

- a pill nav label for this tab
- a full-width image with a configurable crop ratio
- a content card (title, text, optional "Learn More" link) inset flush at the image's bottom-right corner, spanning a tall portion of the image height on `lg`+ screens, stacked as a plain block below the image on smaller screens

## Files

- `program-tab.component.yml` — component schema and props
- `program-tab.twig` — component template
- `program-tab.scss` / `program-tab.css` — component styles (the inset card positioning)
- `README.md` — usage notes and examples

## Props overview

- `active`: whether this tab is open by default; defaults to `false`. If no Program Tab in the container is active, `organisms/programs`' `programs.js` auto-activates the first one.
- `title`: pill nav label; defaults to `Program`
- `image`: image object (`src`, `alt`, `width`, `height`)
- `ratio`: image crop ratio — `ratio-auto`, `ratio-16x9`, `ratio-4x3`, `ratio-1x1`, `ratio-21x9`; defaults to `ratio-16x9`
- `card_title`: content card heading; defaults to `Program title`
- `card_text`: content card body text
- `link_url`: "Learn More" link URL; leave empty to hide the link
- `link_label`: "Learn More" link text; defaults to `Learn More`
- `link_target`: `default`, `_self`, or `_blank`

## Example

```twig
{% include 'vartheme_bs5_horizonaid:program-tab' with {
  active: true,
  title: 'Education',
  image: {
    src: '/sites/default/files/education.jpg',
    alt: 'Children smiling outside a rebuilt school',
    width: 1200,
    height: 675
  },
  ratio: 'ratio-16x9',
  card_title: 'Education',
  card_text: 'Building safe schools and training local teachers to give children a clear path to a brighter future.',
  link_url: '/programs/education',
  link_label: 'Learn More',
  link_target: 'default'
} only %}
```

Placed standalone (outside `organisms/programs`) it still renders as a valid `.tab-pane`, but its pill button won't be visible in a nav bar — it needs the `programs.js` relocation behavior, which only runs inside a `.programs` root.

## Notes

- The component's root element **is** the Bootstrap `.tab-pane` — the pill nav `<button>` renders as its first child so it's still reachable (and hidden along with an inactive pane) without JS.
- `organisms/programs`' `programs.js` moves each button out into the shared pill nav on page load; Canvas renders each slot child independently, so this cross-sibling rearrangement can't be done in Twig.
- The card is positioned with `position: absolute` only at `lg`+ (via `program-tab.scss`): flush against the image's right edge, held up 2.5rem off the bottom edge, and spanning the bottom 60% of the image height. Only its start-side corners (top-left/bottom-left in LTR) are rounded — the end-side corners sit flush against the image's own edge, which the panel's `rounded-4 overflow-hidden` already rounds, so a second rounded corner there would look wrong. Bootstrap's `rounded-start` utility isn't breakpoint-responsive, so the corner radius (all 4 corners when stacked below `lg`, start-side only at `lg`+) is set directly in `program-tab.scss` from the `--bs-border-radius-xl` token. Below `lg` the card renders in normal flow as a plain full-width block below the image.
- The "Learn More" link only renders when `link_url` is set.
- The component depends on `vartheme_bs5_horizonaid/bs-tab-script` (Bootstrap's tab plugin).
