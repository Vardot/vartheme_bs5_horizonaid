# Events Card

A two-tone Bootstrap card for events: an eyebrow taxonomy label, a single drag-and-drop content slot, and a bottom date/time bar.

## Bootstrap reference

> [Bootstrap 5.3 — Card](https://getbootstrap.com/docs/5.3/components/card/)

## What it does

Use this component to promote an event with:

- an eyebrow taxonomy label (e.g. "Webinar") with an accent underline sized to the text, not the row
- a single drag & drop `content` slot — drop a Heading and a Text component together to form the title and description; headings switch to the accent color on card hover
- a bottom bar showing the event date range and time, both plain text so editors can use any display format (e.g. "12 Jun", "12 Jun – 30 Jul")
- an optional border, shadow, rounded corners, equal height, and a full-card stretched link

## Files

- `card-events.component.yml` — component schema, props, and slot
- `card-events.twig` — component template
- `card-events.scss` / `card-events.css` — component styles
- `README.md` — usage notes and examples
- `card-events.mdx` — Storybook docs page
- `card-events.stories.json` — Storybook story configuration
- `card-events.stories.twig` — Storybook story templates

## Props overview

### Content

- `taxonomy_label`: eyebrow label shown above the content slot; defaults to `Webinar`
- `date_start`: event start date, shown as-is (e.g. `12 Jun`); plain text, not tied to any date format
- `date_end`: optional event end date, shown as-is (e.g. `30 Jul`); when set, the range shown is `date_start – date_end`; leave empty for a single-day event (shows `date_start` only)
- `time`: event time, e.g. `11:00 - 2:30 CET`; plain text

### Appearance

- `card_border`: adds `border` (otherwise `border-0`); defaults to `false`
- `corner_style`: Bootstrap rounded utility — `rounded-0`, `rounded-1`, `rounded-2`, `rounded-3`, `rounded-4`, `rounded-5`, `rounded-pill`; defaults to `rounded-4`
- `box_shadow`: `shadow-none`, `shadow-sm`, `shadow`, `shadow-lg`; defaults to `shadow-none`
- `equal_height`: adds `h-100` to the card wrapper; defaults to `false`

### Link

- `stretched_link`: when enabled and `link_url` is set, the whole card becomes clickable; defaults to `false`
- `link_url`: optional card link URL; defaults to empty
- `link_target`: `default`, `_self`, `_blank`; defaults to `default`

## Slot

- `content` — a single drag & drop slot. Drop a Heading component (leave its `text_color` empty so it inherits the card's built-in hover-to-accent color — an explicit `text-*` color on the dropped heading is a Bootstrap utility with `!important` and will permanently win over the hover state) and a Text component together. Any `<h1>`–`<h6>` in the slot gets the hover color; any `<p>` in the slot is visually clamped to 3 lines.

## Example: default event card

```twig
{% embed 'vartheme_bs5_horizonaid:card-events' with {
  taxonomy_label: 'Webinar',
  date_start: '12 Jun',
  date_end: '30 Jul',
  time: '11:00 - 2:30 CET',
} %}
  {% block content %}
    {% include 'vartheme_bs5_horizonaid:heading' with { heading_text: 'Event Title', level: 3 } only %}
    {% include 'vartheme_bs5_horizonaid:text' with {
      text: '<p>Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>',
    } only %}
  {% endblock %}
{% endembed %}
```

## Example: linked card (entire card clickable)

```twig
{% embed 'vartheme_bs5_horizonaid:card-events' with {
  taxonomy_label: 'Workshop',
  date_start: '20 Oct',
  time: '2:00 - 4:00 CET',
  stretched_link: true,
  link_url: 'https://example.com',
  link_target: '_blank',
} %}
  {% block content %}
    {% include 'vartheme_bs5_horizonaid:heading' with { heading_text: 'Hands-on Design Systems', level: 3 } only %}
    {% include 'vartheme_bs5_horizonaid:text' with {
      text: '<p>A practical, hands-on workshop covering tokens, components, and governance.</p>',
    } only %}
  {% endblock %}
{% endembed %}
```

## Notes

- The top section uses `bg-primary-subtle` and the bottom bar uses `bg-primary` — both map to the theme's brand gold tokens, so they follow the active (sub-)theme automatically.
- The taxonomy label uses `align-self-start` so its underline hugs the label text instead of stretching across the card (the parent is a `flex-column` container, so without it every flex child — including the label — stretches to full width per Bootstrap's default `align-items: stretch`).
- The heading hover color is set via the `--bs-secondary` / `--bs-accent` CSS custom properties, not the `.text-secondary` / `.text-accent` utility classes — Bootstrap's color utilities compile with `!important`, which a `:hover` rule can never override regardless of selector specificity.
- The content slot is free-form, so the hover color and the 3-line clamp target elements generically by tag (`:is(h1, h2, h3, h4, h5, h6)` and `p`) inside `.card-events__content`, not a fixed class on a specific prop.
- If the content slot is empty, a small "Drop content here" hint is rendered.
- The stretched link's accessible label is taken from the rendered content slot's stripped text.
- The stretched link is only rendered when both `stretched_link` is enabled and `link_url` is set; `link_target: default` maps to `_self`.
- Boolean props (`card_border`, `equal_height`, `stretched_link`) are validated and defaulted by SDC, so they arrive as real booleans.
- `date_start`/`date_end`/`time` are plain strings, not tied to the theme's `vartheme_bs5_horizonaid:date` component — that component requires an ISO `YYYY-MM-DD` value and renders a fixed `M j, Y` format, which doesn't fit the compact "12 Jun – 30 Jul" range shown in the design. Keeping these as free text lets editors use any display format.
