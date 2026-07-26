# Taxonomy

A Bootstrap-styled taxonomy badge that renders as a link when a URL is provided, otherwise as a span.

## What it does

Use this component when you need to:

- display a taxonomy term as a compact, uppercase badge
- optionally turn the badge into a link to the term page
- open that link in the same or a new tab
- choose between a large and small typography size
- choose between a primary, secondary or tertiary color pairing

## Files

- `taxonomy.component.yml` — component schema and props
- `taxonomy.twig` — component template
- `README.md` — usage notes and examples
- `taxonomy.mdx` — Storybook docs page
- `taxonomy.stories.json` — Storybook story configuration
- `taxonomy.stories.twig` — Storybook story templates

## Props overview

### Content

- `label`: text shown inside the taxonomy badge (required)

### Link

- `url`: if provided, the taxonomy renders as a link; defaults to `''`
- `target`: where to open the link, only used when `url` is provided — `_self` or `_blank`; defaults to `_self`

### Appearance

- `size`: typography size (taxonomy modifier class) — `taxonomy-lg` or `taxonomy-sm`; defaults to `taxonomy-lg`
- `color`: background/text color pairing (taxonomy modifier class) — `taxonomy-primary`, `taxonomy-secondary` or `taxonomy-tertiary`; defaults to `taxonomy-primary`

## Target values

| Value | Label |
|---|---|
| `_self` | Same tab |
| `_blank` | New tab |

## Size values

| Value | Label |
|---|---|
| `taxonomy-lg` | Large |
| `taxonomy-sm` | Small |

## Color values

| Value | Label | Background | Text |
|---|---|---|---|
| `taxonomy-primary` | Primary | `bg-dark` (navy) | `text-white` |
| `taxonomy-secondary` | Secondary | `bg-accent` (blue) | `text-white` |
| `taxonomy-tertiary` | Tertiary | `bg-primary` (gold) | `text-secondary` (navy) |

## Available attributes

- `attributes`: attributes array available to the component
- `taxonomy_attributes`: attributes for the rendered badge element (`<a>` or `<span>`)

## Example

```twig
{% include 'vartheme_bs5_horizonaid:taxonomy' with {
  label: 'Announcements',
  url: '/taxonomy/term/12',
  target: '_blank',
  size: 'taxonomy-lg',
  color: 'taxonomy-secondary'
} only %}
```

```twig
{% include 'vartheme_bs5_horizonaid:taxonomy' with {
  label: 'Draft',
  size: 'taxonomy-sm',
  color: 'taxonomy-tertiary'
} only %}
```

## Notes

- With a non-empty `url` the badge renders as `<a>`; otherwise it renders as `<span>`.
- The badge is built entirely from Bootstrap utilities (`badge`, `rounded-pill`, the `color`-mapped `bg-*`/`text-*` pair, and more) plus the `taxonomy` class — no custom CSS.
- The `taxonomy-lg` size adds the `fs-6` utility; `taxonomy-sm` omits it.
- `color` picks a `bg-*` + `text-*` pair rather than a single `text-bg-*` utility, so `taxonomy-tertiary` can pair `bg-primary` with the exact navy of `text-secondary` (Bootstrap's `text-bg-primary` contrast color is plain black instead).
- When `target` is `_blank`, the link also gets `rel="noopener noreferrer"`.
- The link variant adds `text-decoration-none`; both `label` and `url` are escaped on output.
