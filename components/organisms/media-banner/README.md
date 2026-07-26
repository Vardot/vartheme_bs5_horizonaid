# Media Banner

An uploaded image with a floating content box slot for a heading, text, buttons, or any other component. This is the mirrored, start-anchored sibling of `organisms/hero-banner` (which anchors to the end side).

## Bootstrap reference

> [Bootstrap 5.3 — Border-radius](https://getbootstrap.com/docs/5.3/utilities/borders/#radius) · [Background](https://getbootstrap.com/docs/5.3/utilities/background/)

## What it does

Use this component when you need a media banner that can:

- render an uploaded image, cropped to cover its box
- round the image with a Bootstrap radius utility, or this component's own 1.25rem preset
- float a content box over the image's bottom edge, offset from its start side
- accept any content in the content box through a single slot — heading, text, button, or any other component
- switch the content box's background color, with text color auto-switching to white on dark backgrounds

## Files

- `media-banner.component.yml` — component schema and props
- `media-banner.twig` — component template
- `media-banner.scss` — component styles (source; `media-banner.css` is the build output)
- `README.md` — usage notes and examples
- `media-banner.mdx` — Storybook docs page
- `media-banner.stories.json` — Storybook story configuration
- `media-banner.stories.twig` — Storybook story templates

## Props overview

### Image

- `media`: the media banner image (`src`, `alt`, `width`, `height`)
- `image_radius`: `none`, `rounded-2`, `rounded-3`, `rounded-4`, `rounded-hero`, `rounded-5`, `rounded-pill`; defaults to `rounded-hero`

### Content box

- `content_bg`: Bootstrap background utility — `bg-transparent`, `bg-white`, `bg-light`, `bg-dark`, `bg-black`, `bg-primary`, `bg-secondary`, `bg-success`, `bg-danger`, `bg-warning`, `bg-info`; defaults to `bg-light`
- `content_color`: `auto`, `text-dark`, `text-white`; defaults to `auto`

## Slots

- `content` — content box slot; drop in a heading, text, button, or any other component

## Example

```twig
{% embed 'vartheme_bs5_horizonaid:media-banner' with {
  media: {
    src: '/path/to/banner.jpg',
    alt: 'Banner image',
    width: 1920,
    height: 1075
  },
  image_radius: 'rounded-hero',
  content_bg: 'bg-light',
  content_color: 'auto'
} only %}
  {% block content %}
    {% include 'vartheme_bs5_horizonaid:heading' with {
      heading_text: 'Title',
      level: 2,
      text_color: 'text-dark'
    } only %}
    {% include 'vartheme_bs5_horizonaid:text' with {
      text: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>',
      text_color: 'text-dark'
    } only %}
    {% include 'vartheme_bs5_horizonaid:button' with {
      label: 'Button',
      variant: 'btn-primary',
      size: 'btn-md',
      radius: 'rounded-pill',
      alignment: 'left'
    } only %}
  {% endblock %}
{% endembed %}
```

## Notes

- `image_radius: rounded-hero` is this component's own preset (1.25rem) — the theme's Bootstrap radius scale stops at `rounded-4` (1rem) and `rounded-5` (1.5rem), with no utility for the reference design's exact value. Every other `image_radius` value is a stock Bootstrap utility applied directly to the image.
- The content box's padding (2.5rem), radius (1.25rem on the top corners only), and start-side offset (3rem) are fixed design tokens defined in `media-banner.scss`, matching the reference design; they are not configurable props.
- The content box's desktop width reads the `--desktop-columns-4col` CSS custom property (a hook for a future global grid/design-token system), falling back to the reference design's own fixed value (22.4375rem) until one is defined.
- From `lg` up, the box is inset 11.56rem from the image's top edge (image showing above the box) down to its bottom edge, so its height follows the image rather than its content; the image gets a matching `min-height` so there's always room for both the gap and the box's content.
- Below the `lg` breakpoint the content box stays in normal flow, pulled up slightly over the image's bottom edge, and spans the available width so it never overflows the viewport. From `lg` up it becomes an absolutely positioned card anchored to the image's bottom and start-side offset.
- `content_color: auto` switches to white text when `content_bg` is one of `bg-dark`, `bg-black`, `bg-primary`, `bg-secondary` — same convention as `atoms/section`.
- The content box only renders when the `content` slot has content.
- The image renders through `vartheme_bs5_horizonaid:image` with `cover_fill: true`, so drimage sizes the derivative to the rendered box and stays sharp at every screen size. Fit (`object-fit-cover`) and focal position (`center`) are fixed, not configurable props.
