# Views exposed filters

A wrapper for the exposed filter form of a view, carrying the Horizon Aid skin so a listing can lay its filters out without reaching for the form ID Views happens to generate.

## Bootstrap reference

> [Bootstrap 5.3 — Forms layout](https://getbootstrap.com/docs/5.3/forms/layout/)

## What it does

Use this component when you need the exposed filters of a view listing to:

- sit in a tinted rounded card whose controls bottom-align with each other
- let the keyword filter absorb the free space while select filters keep a steady column
- break the Apply Filters / Reset actions onto their own line under the filter row
- switch to a stacked, one-control-per-row layout
- collapse every control to the full row width below the `md` breakpoint
- take extra Bootstrap utility classes on the filter row
- expose the exposed form itself through a single slot
- carry the Horizon Aid skin — search icon, navy-outlined inputs, labels, the filled Apply Filters pill and the ghost Reset

## Files

- `views-exposed-filters.component.yml` — component schema and props
- `views-exposed-filters.twig` — component template
- `views-exposed-filters.scss` / `views-exposed-filters.css` — component styles

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `layout` | string (`inline`, `stacked`) | `inline` | How the filters sit next to each other. |
| `utility_classes` | array | `[]` | Extra Bootstrap utility classes for the filter row. |

## Slots

| Slot | Description |
|---|---|
| `filters` | The exposed filter form of the view. |

## How a listing uses it

A view opts in through the `components_exposed_form` exposed-form plugin, pointing at
`vartheme_bs5_horizonaid:views-exposed-filters`. Listings that do not render through this
SDC still get the same skin: `hook_form_alter()` attaches this component's library on every
`views_exposed_form`, because SDC otherwise only attaches a component's CSS when the
component itself renders.

## Design tokens

Every value derives from the theme's Bootstrap tokens — the card surface from
`--bs-secondary-bg-subtle`, the input outline and label colour from `--bs-dark`, and the
Apply Filters pill from `--bs-primary`. No hard-coded hex outside the inline search-icon
SVG, which cannot take a CSS custom property.
