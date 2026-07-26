# Profile Card

A Bootstrap card for a team member profile: an uploaded photo that fills the card and zooms slightly on hover, a dark footer with a single drag & drop content area, and optional social links whose icons pick up an accent color on hover.

## Bootstrap reference

> [Bootstrap 5.3 — Card](https://getbootstrap.com/docs/5.3/components/card/)

## What it does

Use this component for a "team" / "our people" grid item that can:

- show an uploaded photo, cropped to cover the card (drimage sizes the derivative to the container so it stays sharp at every breakpoint)
- hold one drag & drop content slot for the person's name and description (drop a Heading + Text component)
- optionally show LinkedIn, X, Facebook, and Instagram icons — each only appears when its URL is set
- apply a brand background color to the footer, a border, rounded corners, and a shadow
- zoom the photo and switch the social icons to an accent color on hover/focus

## Files

- `card-profile.component.yml` — component schema and props
- `card-profile.twig` — component template
- `card-profile.scss` / `card-profile.css` — component styles
- `README.md` — usage notes and examples
- `card-profile.mdx` — Storybook docs page
- `card-profile.stories.json` — Storybook story configuration
- `card-profile.stories.twig` — Storybook story templates

## Props overview

### Photo

- `image`: Canvas image object (`src`, `alt`, `width`, `height`) — the person's photo, cover-cropped to fill the card above the footer

### Appearance

- `background_color`: brand background color applied to the footer — `none`, `bg-body-tertiary`, `bg-tertiary`, `bg-accent`, `bg-primary`, `bg-primary-subtle`, `bg-secondary`, `bg-secondary-subtle`, `bg-dark`; defaults to `bg-dark`
- `card_border`: adds `border` (otherwise `border-0`); defaults to `false`
- `corner_style`: Bootstrap rounded utility — `rounded-0`, `rounded-1`, `rounded-2`, `rounded-3`, `rounded-4`, `rounded-5`, `rounded-pill`; defaults to `rounded-4`
- `box_shadow`: `shadow-none`, `shadow-sm`, `shadow`, `shadow-lg`; defaults to `shadow-none`
- `equal_height`: adds `h-100` to the card wrapper; defaults to `false`

### Social links

- `linkedin_url` / `twitter_url` / `facebook_url` / `instagram_url`: optional profile URLs; each icon only renders when its URL is set. Links open in a new tab (`target="_blank"`, `rel="noopener noreferrer"`).

## Slots

- `content` — drag & drop content area for the person's name and description (drop a Heading + Text component)

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

## Example: default profile card

```twig
{% embed 'vartheme_bs5_horizonaid:card-profile' with {
  image: { src: '/path/to/photo.jpg', alt: 'Jane Doe', width: 720, height: 720 },
  background_color: 'bg-dark',
  corner_style: 'rounded-4',
  box_shadow: 'shadow-sm',
  linkedin_url: 'https://linkedin.com/in/example',
  twitter_url: 'https://x.com/example',
} %}
  {% block content %}
    <h3 class="h5 mb-1 text-white">Jane Doe</h3>
    <p class="mb-0 text-white-50">Product Designer</p>
  {% endblock %}
{% endembed %}
```

## Example: no social links

```twig
{% embed 'vartheme_bs5_horizonaid:card-profile' with {
  image: { src: '/path/to/photo.jpg', alt: 'John Smith', width: 720, height: 720 },
  background_color: 'bg-primary',
} %}
  {% block content %}
    <h3 class="h5 mb-1 text-white">John Smith</h3>
    <p class="mb-0 text-white-50">Engineering Lead</p>
  {% endblock %}
{% endembed %}
```

## Notes

- The photo is rendered via the `vartheme_bs5_horizonaid:image` component with `cover_fill: true`, so drimage sizes the derivative to the media area's actual width **and** height and re-fetches on resize — the photo never pixelates or stretches.
- Social icons use the lower-level `vartheme_bs5_horizonaid:bootstrap-icon` atom (not `atoms/icon`) so no `text-*` utility class is forced on them — Bootstrap's color utilities are `!important` and would block the hover color transition, so `card-profile.scss` owns the icon color end-to-end via `--card-profile-icon-color` / `--card-profile-icon-hover-color`.
- If no content is provided, a small "Drop heading & text here" hint is rendered.
- Hovering or focusing the card zooms the photo (`--card-profile-zoom-scale`, default `1.05`) and switches social icons to `--card-profile-icon-hover-color` (defaults to `var(--bs-warning)`); both respect `prefers-reduced-motion: reduce`.
- Boolean props (`card_border`, `equal_height`) are validated and defaulted by SDC, so they arrive as real booleans.
