# Accordion container

A container for any content, only one of whose accordions may be open at a time — the parent wrapper that manages shared grouping behavior for nested accordion items.

## Bootstrap reference

> ### [Bootstrap documentation on Accordion](https://getbootstrap.com/docs/5.3/components/accordion/)
> * [Example](https://getbootstrap.com/docs/5.3/components/accordion/#example)
> * [Always open](https://getbootstrap.com/docs/5.3/components/accordion/#always-open)
> * [Accessibility](https://getbootstrap.com/docs/5.3/components/accordion/#accessibility)

## What it does

Use this component when you need a reusable accordion wrapper that can:

- group one or more accordion items under a single accordion system
- allow multiple items to stay open at the same time, or restrict to one open item
- generate a stable container ID, or accept a custom one, used to group nested items
- render a default two-item demo when the slot is empty (for preview)

## Files

- `accordion-container.component.yml` — component schema and props
- `accordion-container.twig` — component template
- `accordion-container.scss` / `accordion-container.css` — component styles
- `README.md` — usage notes and examples
- `accordion-container.mdx` — Storybook docs page
- `accordion-container.stories.json` — Storybook story configuration
- `accordion-container.stories.twig` — Storybook story templates

## Props overview

### Layout

- `id`: accordion container ID used to group nested items so only one stays open at a time; leave empty to auto-generate

### Behavior

- `always_open`: allow multiple accordion items to stay open at the same time — `true` / `false`; defaults to `false`

## Slots

- `accordion_content` — place one or more accordion items inside this slot

## Example: basic grouped accordion

```twig
{% embed 'vartheme_bs5_horizonaid:accordion-container' with {
  id: 'faq-accordion',
  always_open: false
} only %}
  {% block accordion_content %}
    {% embed 'vartheme_bs5_horizonaid:accordion-block' with {
      title: 'First item',
      heading_level: 3,
      open_by_default: true,
    } only %}
      {% block accordion_content %}
        <p class="mb-0">First accordion content.</p>
      {% endblock %}
    {% endembed %}

    {% embed 'vartheme_bs5_horizonaid:accordion-block' with {
      title: 'Second item',
      heading_level: 3,
      open_by_default: false,
    } only %}
      {% block accordion_content %}
        <p class="mb-0">Second accordion content.</p>
      {% endblock %}
    {% endembed %}
  {% endblock %}
{% endembed %}
```

## Example: always-open (multiple expanded)

```twig
{% embed 'vartheme_bs5_horizonaid:accordion-container' with {
  id: 'support-topics',
  always_open: true
} only %}
  {% block accordion_content %}
    {% embed 'vartheme_bs5_horizonaid:accordion-block' with {
      title: 'Topic 1',
      open_by_default: true,
    } only %}
      {% block accordion_content %}
        <p class="mb-0">This item can stay open alongside other items.</p>
      {% endblock %}
    {% endembed %}
  {% endblock %}
{% endembed %}
```

## Notes

- The container passes `accordion_parent_id` and `accordion_always_open` to nested accordion items through the Twig context, so child items inherit grouping and multi-open behavior automatically.
- If no `id` is provided, an `accordion-*` ID is generated automatically.
- Items stack in a flex column with a fixed gap (`accordion-container.scss`); each item keeps its own rounded corners and background — there is no edge-to-edge "flush" mode.
- Grouping is enforced entirely in `accordion-block.js`: each item's header carries a `data-accordion-parent` attribute pointing at this container's ID, so opening one item collapses its open siblings within the same container (unless `always_open` is enabled, either on the container or on the individual item).
- When `always_open` is enabled, opening one item does not close the others.
- When the `accordion_content` slot is empty, a built-in two-item demo accordion is rendered for preview purposes.
- Boolean props (`always_open`) are validated by SDC and arrive as real booleans.
