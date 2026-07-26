# Accordion

A single accordion item with a clickable header, a plus/minus icon toggle, and a smooth height animation, designed to live inside an Accordion container.

## Bootstrap reference

> ### [Bootstrap documentation on Accordion](https://getbootstrap.com/docs/5.3/components/accordion/)
> * [Example](https://getbootstrap.com/docs/5.3/components/accordion/#example)
> * [Always open](https://getbootstrap.com/docs/5.3/components/accordion/#always-open)
> * [Accessibility](https://getbootstrap.com/docs/5.3/components/accordion/#accessibility)

## What it does

Use this component when you need a reusable accordion item that can:

- show a clickable header button with a configurable heading level (`H2`–`H6`)
- open or stay collapsed on first load
- bind to a parent accordion container so only one item is open at a time
- stay independent of the parent so it can remain open alongside its siblings
- animate open/closed with a plus-to-minus icon and a smooth height transition
- render hidden body content from a slot, with a placeholder when the slot is empty

## Files

- `accordion-block.component.yml` — component schema and props
- `accordion-block.twig` — component template
- `accordion-block.scss` / `accordion-block.css` — component styles
- `accordion-block.js` — toggle behavior script
- `README.md` — usage notes and examples
- `accordion-block.mdx` — Storybook docs page
- `accordion-block.stories.json` — Storybook story configuration
- `accordion-block.stories.twig` — Storybook story templates

## Props overview

### Content

- `title`: text shown in the header button; defaults to `Accordion item`
- `heading_level`: heading tag for the header — `2`, `3`, `4`, `5`, `6`; defaults to `3`

### Behavior

- `open_by_default`: open this item when the page first loads — `true` / `false`; defaults to `true`
- `always_open`: keep this item independent of the parent so it can stay open alongside others — `true` / `false`; defaults to `false`

### Binding

- `parent_id`: optional accordion container ID used to group items so only one stays open at a time; usually provided automatically by the Accordion container
- `item_id`: optional stable ID suffix for this item, useful for links, testing, or automation

## Slots

- `accordion_content` — content hidden when the accordion is collapsed

## Example: single item bound to a container

```twig
{% embed 'vartheme_bs5_horizonaid:accordion-block' with {
  title: 'What is your refund policy?',
  heading_level: 3,
  open_by_default: true,
  parent_id: 'faq-accordion',
  item_id: 'refunds',
} only %}
  {% block accordion_content %}
    <p class="mb-0">You can request a refund within 30 days of purchase.</p>
  {% endblock %}
{% endembed %}
```

## Example: independent item that stays open alongside others

```twig
{% embed 'vartheme_bs5_horizonaid:accordion-block' with {
  title: 'Standalone note',
  heading_level: 4,
  open_by_default: false,
  always_open: true,
} only %}
  {% block accordion_content %}
    <p class="mb-0">This item is not controlled by the parent accordion.</p>
  {% endblock %}
{% endembed %}
```

## Notes

- The component reads `accordion_parent_id` and `accordion_always_open` from the Twig context supplied by the Accordion container, so nesting items inside a container wires up parent binding and multi-open behavior automatically.
- `parent_id` and `item_id` set directly on the item override the container-provided values.
- When `item_id` is empty, a unique ID is generated so the `heading-*` / `body-*` IDs stay unique on the page.
- Expand/collapse is handled by `accordion-block.js` toggling an `is-expanded` class — no Bootstrap Collapse plugin is used. The header title switches to the accent color on hover, and the plus icon fades its vertical stroke into a minus on expand, both via `accordion-block.scss`.
- The body height animates with a CSS `grid-template-rows` transition (0fr → 1fr) rather than a measured pixel height, so it works without JavaScript computing sizes.
- Grouping (only one item open at a time) is driven by `data-accordion-parent` / `data-accordion-allow-multiple` attributes read by `accordion-block.js`, which looks up the ancestor by ID and collapses its other open, non-`always_open` items.
- In the Canvas / SDC component preview, items are forced open so their body content is visible while editing.
- When `accordion_content` is empty, a placeholder body is rendered via the `vartheme_bs5_horizonaid:text` component.
- Boolean props (`open_by_default`, `always_open`) are validated by SDC and arrive as real booleans.
