# Map Info Card

A small info card — heading, description, up to two stat rows, a "Learn More" link, and a close button. Used standalone, or dropped into `organisms/map`'s `countries` slot (with **Country code** set) to become that country's click popup.

## Bootstrap reference

> [Bootstrap 5.3 — Card](https://getbootstrap.com/docs/5.3/components/card/)
> [Bootstrap 5.3 — Close button](https://getbootstrap.com/docs/5.3/components/close-button/)

## What it does

Use this component for a small "spotlight" card that can:

- show a heading, a short description, and up to two labeled stat rows
- show a "Learn More" style link
- be dismissed via a close button
- be dropped into `organisms/map`'s `countries` slot to become that country's click popup — set **Country code** and the map does the rest (see `organisms/map`'s README)

## Files

- `map-info-card.component.yml` — component schema and props
- `map-info-card.twig` — component template
- `map-info-card.scss` / `map-info-card.css` — component styles
- `map-info-card.js` — close-button behavior
- `README.md` — usage notes and examples
- `map-info-card.mdx` — Storybook docs page
- `map-info-card.stories.json` — Storybook story configuration
- `map-info-card.stories.twig` — Storybook story templates

## Props overview

- `country_code`: two-letter ISO 3166-1 alpha-2 code (e.g. `SO` for Somalia) — only needed when this card is dropped into `organisms/map`'s `countries` slot; leave empty for standalone use
- `heading`: card title (e.g. a country name)
- `description`: short description paragraph
- `stat_1_value` / `stat_1_label`: first stat row; hidden when `stat_1_value` is empty
- `stat_2_value` / `stat_2_label`: second stat row; hidden when `stat_2_value` is empty
- `link_url`: optional "Learn More" link; leave empty to hide the link
- `link_text`: visible link label; defaults to `Learn More`

## Example

```twig
{% embed 'vartheme_bs5_horizonaid:map-info-card' with {
  country_code: 'SO',
  heading: 'Somalia',
  description: 'Supporting displaced communities and refugee populations across southern and central regions with emergency shelter, clean water access, and legal protection services.',
  stat_1_value: '2.9M',
  stat_1_label: 'Internally displaced people reached',
  stat_2_value: '14K',
  stat_2_label: 'Legal aid cases supported in 2025',
  link_url: 'https://example.com/somalia',
} %}
{% endembed %}
```

## Notes

- **This card is always fully self-rendered — `organisms/map` never edits its content.** When `country_code` is set, the map discovers the card by its `data-country-code` attribute (not by reading component props directly — a slot's content is just rendered markup from Twig's perspective) to know which countries to highlight and what each popup should say, and shows/hides this exact card on click. There's nothing else to wire up.
- The close button uses Bootstrap's `atoms/close-button` (`.btn-close`). Its click behavior (`map-info-card.js`) sets the `hidden` attribute on the closest `.map-info-card` — progressive enhancement only; without JS the card just has no working close button. This works identically whether the card is standalone or inside `organisms/map`.
- Background uses `bg-primary-subtle` and the stat rows use `bg-primary` — both theme tokens, not hardcoded colors.
