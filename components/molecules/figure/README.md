# Figure

A stat figure card with a large number and a description label. Background and font sizes/colors are all configurable via Bootstrap utilities — no custom CSS. The number counts up from 0 when it scrolls into view.

## Bootstrap reference

> [Bootstrap 5.3 — Utilities: Background](https://getbootstrap.com/docs/5.3/utilities/background/)
> [Bootstrap 5.3 — Utilities: Colors](https://getbootstrap.com/docs/5.3/utilities/colors/)
> [Bootstrap 5.3 — Display headings](https://getbootstrap.com/docs/5.3/content/typography/#display-headings)

## What it does

Use this component for a stat/metric card that can:

- show a large number (e.g. `2.9M`, `0000`) and a description label below it
- apply a brand background color to the card root
- independently size and color the number and description via Bootstrap utilities
- count the number up from 0 when it scrolls into view (progressive enhancement — fully usable without JS)

## Files

- `figure.component.yml` — component schema and props
- `figure.twig` — component template
- `figure.js` — count-up animation behavior
- `README.md` — usage notes and examples
- `figure.mdx` — Storybook docs page
- `figure.stories.json` — Storybook story configuration
- `figure.stories.twig` — Storybook story templates

## Props overview

### Content

- `number` (required): the main statistic number
- `description` (required): short descriptive label below the number

### Appearance

- `background_color`: brand background color — `none`, `bg-body-tertiary`, `bg-tertiary`, `bg-accent`, `bg-accent-subtle`, `bg-primary`, `bg-primary-subtle`, `bg-secondary`, `bg-secondary-subtle`, `bg-dark`; defaults to `bg-accent-subtle`
- `align`: Bootstrap `text-*` utility for the horizontal alignment of both the number and the description — `text-start` (left), `text-center`, `text-end` (right); defaults to `text-start`
- `number_size`: Bootstrap `display-*` utility for the number; defaults to `display-1`
- `number_color`: Bootstrap text color utility for the number; defaults to `text-black`
- `description_size`: Bootstrap `fs-*` utility for the description; defaults to `fs-6`
- `description_color`: Bootstrap text color utility for the description; defaults to `text-black`

## Slots

- N/A — all content is scalar props (`number`, `description`), not drag & drop slots.

## Background color options

| Value | Label |
|---|---|
| `none` | None (transparent) |
| `bg-body-tertiary` | Body tertiary |
| `bg-tertiary` | Tertiary |
| `bg-accent` | Accent |
| `bg-accent-subtle` | Accent subtle |
| `bg-primary` | Primary |
| `bg-primary-subtle` | Primary subtle |
| `bg-secondary` | Secondary |
| `bg-secondary-subtle` | Secondary subtle |
| `bg-dark` | Dark |

## Example

```twig
{% embed 'vartheme_bs5_horizonaid:figure' with {
  number: '0000',
  description: 'Number description',
  background_color: 'bg-accent-subtle',
  align: 'text-start',
  number_size: 'display-1',
  number_color: 'text-black',
  description_size: 'fs-6',
  description_color: 'text-black',
} %}
{% endembed %}
```

## Notes

- **Mind contrast when changing `background_color`.** The default (`bg-accent-subtle` + `text-black`) is light-on-light-adjacent and reads fine. For a dark background (`bg-dark`, `bg-secondary`) switch `number_color`/`description_color` to `text-white`/`text-white-50`; for `bg-primary` (this theme's bright gold), keep dark text — white fails WCAG contrast on gold.
- The number counts up from 0 on scroll-into-view via `figure.js` (progressive enhancement, respects `prefers-reduced-motion`, and is skipped inside the Drupal Canvas editor's own re-rendering canvas — see the file's docblock). The count-up only animates the numeric core of `number` — any non-numeric prefix/suffix (`48K+`, `$2.9M`, `99%`) is kept static around it, and decimal precision is preserved.
- Both required props (`number`, `description`) have no default — the component expects them to always be supplied.
