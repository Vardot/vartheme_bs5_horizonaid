# Views view search

The search results listing: the view title as the page heading, then the exposed filter bar, then the result summary, then the rows.

## Bootstrap reference

> [Bootstrap 5.3 — Typography](https://getbootstrap.com/docs/5.3/content/typography/#headings)

## What it does

The shared `views-view` component prints the view's `header` before its `exposed` form, which puts the "Displaying 1 - 10 of 24 results" summary above the search box. On a results page the visitor needs the box first, so this component reorders the two and promotes the view title to the page's `h1`.

It also gives the empty state a quiet notice surface instead of a bare paragraph, so "no results" reads as an answer rather than a rendering gap.

## Files

- `views-view-search.component.yml` — component schema and props
- `views-view-search.twig` — component template
- `views-view-search.scss` / `views-view-search.css` — component styles

## Props overview

| Prop | Type | Description |
|---|---|---|
| `content` | string | The rendered view. |
| `attributes` | `Drupal\Core\Template\Attribute` | HTML attributes for the containing element. |

## Slots

None. The component receives the standard `template_preprocess_views_view()` variables.

## Example

`templates/views/views-view--search--page.html.twig` includes it, so the search page display renders through this component while every other view keeps the shared `views-view` order:

```twig
{% include "vartheme_bs5_horizonaid:views-view-search" %}
```

## Notes

The exposed form itself is skinned by the `views-exposed-filters` component, which the theme attaches to every `views_exposed_form`. Its `views-exposed-form--search` modifier keeps the single keyword field and the Search button on one line.

## Design tokens

The empty-state notice takes its surface from `--bs-secondary-bg-subtle` and its rule from `--bs-border-color`. `--bs-tertiary-bg` is a dark token in this theme, so it would put body-coloured text on a dark panel.
