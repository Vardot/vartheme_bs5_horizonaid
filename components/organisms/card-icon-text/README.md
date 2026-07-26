# Icon Text Card

A lightweight Bootstrap card with an optional uploaded icon image above a single drag & drop content slot. Drop a Heading and a Text component together to form the title and description — headings switch to the accent color on hover.

## Bootstrap reference

> [Bootstrap 5.3 — Card](https://getbootstrap.com/docs/5.3/components/card/)

## What it does

Use this component when you need a badge-style icon card that can:

- optionally show an uploaded icon image (SVG, PNG, WebP) above the content
- align the icon to the left, center, or right
- hold arbitrary drag & drop content — drop a Heading and a Text component together
- switch dropped headings to the accent color on hover
- apply a brand background color, border, rounded corners, shadow, and optional padding
- optionally turn the whole card into a clickable stretched link

## Files

- `card-icon-text.component.yml` — component schema and props
- `card-icon-text.twig` — component template
- `card-icon-text.scss` / `card-icon-text.css` — component styles
- `README.md` — usage notes and examples
- `card-icon-text.mdx` — Storybook docs page
- `card-icon-text.stories.json` — Storybook story configuration
- `card-icon-text.stories.twig` — Storybook story templates

## Props overview

### Icon

- `icon_image`: optional Canvas image object (`src`, `alt`, `width`, `height`); leave empty to hide the icon area
- `icon_alignment`: horizontal icon position — `start` (left), `center`, `end` (right); defaults to `start`

### Appearance

- `background_color`: brand background color — `none`, `bg-body-tertiary`, `bg-tertiary`, `bg-accent`, `bg-accent-subtle`, `bg-primary`, `bg-primary-subtle`, `bg-secondary`, `bg-secondary-subtle`, `bg-dark`; defaults to `bg-primary-subtle`
- `card_border`: adds `border` (otherwise `border-0`); defaults to `false`
- `corner_style`: Bootstrap rounded utility — `rounded-0`, `rounded-1`, `rounded-2`, `rounded-3`, `rounded-4`, `rounded-5`, `rounded-pill`; defaults to `rounded-4`
- `box_shadow`: `shadow-none`, `shadow-sm`, `shadow`, `shadow-lg`; defaults to `shadow-none`
- `padded`: adds `p-4` to the card body; defaults to `true`
- `equal_height`: adds `h-100` to the card wrapper; defaults to `false`

### Link

- `stretched_link`: when enabled and `link_url` is set, the whole card becomes clickable; defaults to `false`
- `link_url`: optional card link URL; defaults to empty
- `link_target`: `default`, `_self`, `_blank`; defaults to `default`

## Slots

- `content` — drag & drop content slot. Drop a Heading and a Text component together to form the title and description; headings switch to the accent color on hover (leave their text color empty).

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

## Example: icon card (left-aligned, primary subtle)

```twig
{% embed 'vartheme_bs5_horizonaid:card-icon-text' with {
  icon_image: { src: '/path/to/icon.svg', alt: '', width: 64, height: 64 },
  icon_alignment: 'start',
  background_color: 'bg-primary-subtle',
  box_shadow: 'shadow-none',
  corner_style: 'rounded-4',
} %}
  {% block content %}
    <h3 class="h5">Title card</h3>
    <p class="mb-0">Description text</p>
  {% endblock %}
{% endembed %}
```

## Example: accent subtle variant

```twig
{% embed 'vartheme_bs5_horizonaid:card-icon-text' with {
  icon_image: { src: '/path/to/icon.svg', alt: '', width: 64, height: 64 },
  icon_alignment: 'start',
  background_color: 'bg-accent-subtle',
  box_shadow: 'shadow-none',
  corner_style: 'rounded-4',
} %}
  {% block content %}
    <h3 class="h5">Title card</h3>
    <p class="mb-0">Description text</p>
  {% endblock %}
{% endembed %}
```

## Example: linked card (entire card clickable)

```twig
{% embed 'vartheme_bs5_horizonaid:card-icon-text' with {
  background_color: 'bg-primary-subtle',
  stretched_link: true,
  link_url: 'https://example.com',
  link_target: '_blank',
} %}
  {% block content %}
    <h3 class="h5">Clickable card</h3>
    <p class="mb-0">The entire card acts as a link.</p>
  {% endblock %}
{% endembed %}
```

## Notes

- When `icon_image` is empty, the icon area is hidden and only the content slot renders.
- The icon is rendered via the `vartheme_bs5_horizonaid:image` component using `object-fit-contain` and `w-auto`; SVGs are recommended.
- The gap between the icon and the content slot (`--card-icon-text-gap`) and the icon's max width (`--card-icon-text-icon-max-width`) are CSS custom properties computed from the Bootstrap `$spacer` token — see `card-icon-text.scss`.
- If no content is provided, a small "Drop content here" hint is rendered.
- Headings dropped in the content slot are styled via `--bs-secondary` at rest and switch to `--bs-accent` on hover (matches the brand navy → accent-blue hover treatment used by `card-events`); leave any heading text color empty so this can apply.
- The stretched link is only rendered when both `stretched_link` is enabled and `link_url` is set; `link_target: default` maps to `_self`.
- Boolean props (`card_border`, `padded`, `equal_height`, `stretched_link`) are validated and defaulted by SDC, so they arrive as real booleans.
