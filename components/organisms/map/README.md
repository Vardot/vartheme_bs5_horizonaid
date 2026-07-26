# Map

A self-contained interactive world map — no external map API or key required. Custom zoom-in / zoom-out / reset controls; clicking a highlighted country opens its popup (`molecules/map-info-card`, dropped into the `countries` slot) with a description, up to two stats, and a link.

## Bootstrap reference

> [Bootstrap 5.3 — Card](https://getbootstrap.com/docs/5.3/components/card/) (the map card shell: rounded corners, shadow)

This component is not a Bootstrap UI pattern — the map itself is a plain SVG, projected from GeoJSON with [d3-geo](https://d3js.org/d3-geo) (vendored, see Notes). Bootstrap utility classes are used only for the shell (spacing, radius, shadow) and the popup (`map-info-card`).

## What it does

Use this component for a "where we work" / "our impact" map that can:

- highlight any number of countries (by ISO 3166-1 alpha-2 code) on a minimal grey/white styled world map — just drop in as many `map-info-card` components as you need
- open a popup with a description, up to two stats, and a link when a highlighted country is clicked
- zoom in / out and reset to the default view via custom controls
- optionally show drag & drop content above the map (e.g. a heading and intro paragraph)

## Managing countries (admin-friendly, no field limit)

Adding, removing, or editing a highlighted country is just adding, removing, or editing a `map-info-card` in the `countries` slot in Drupal Canvas — the same drag & drop experience as any other unlimited-slot component in this theme (e.g. `organisms/impressed-card-slider`'s cards). There's no numbered-field limit and nothing else to keep in sync:

1. Drop a **Map Info Card** component into the map's **Countries** slot.
2. Set its **Country code** prop to the country's two-letter ISO 3166-1 alpha-2 code (e.g. `SO` for Somalia).
3. Fill in the card's heading, description, up to two stats, and optional link — exactly like using `map-info-card` standalone.

The map reads the highlighted set and each popup's content directly from whichever cards are actually dropped in — there's no separate "highlighted countries" list to keep in sync, and no cap on how many you can add.

## Files

- `map.component.yml` — component schema, props (map settings only), and the `content` / `countries` slots
- `map.twig` — component template
- `map.scss` / `map.css` — component styles (SVG country fill/hover, custom control buttons, popup positioning)
- `map.js` — projects the vendored GeoJSON to SVG with d3-geo, and drives zoom/reset/click-popup behavior (see Notes)
- `assets/world-countries-110m.geojson` — vendored country-boundary polygons (see Notes)
- `assets/vendor/d3-array.min.js`, `assets/vendor/d3-geo.min.js` — vendored d3-geo + its d3-array dependency (see Notes)
- `README.md` — usage notes and examples
- `map.mdx` — Storybook docs page
- `map.stories.json` — Storybook story configuration
- `map.stories.twig` — Storybook story templates

## Props overview

### Map settings

- `map_height`: `sm` (20rem) | `md` (28rem) | `lg` (36rem); defaults to `md`
- `corner_style`: Bootstrap rounded utility applied to the map area; defaults to `rounded-4`
- `box_shadow`: `shadow-none`, `shadow-sm`, `shadow`, `shadow-lg`; defaults to `shadow-none`
- `background_color`: Bootstrap background utility applied to the map area (`none`, `bg-body-tertiary`, `bg-tertiary`, `bg-accent`, `bg-accent-subtle`, `bg-primary`, `bg-primary-subtle`, `bg-secondary`, `bg-secondary-subtle`, `bg-dark`); defaults to `bg-body-tertiary`. Shows while the country GeoJSON is loading, and behind the SVG canvas at every zoom level.

## Slots

- `content` — optional drag & drop content shown above the map
- `countries` — add one or more [`molecules/map-info-card`](../../molecules/map-info-card/README.md) components here (unlimited, drag & drop reorder), each with its own **Country code** prop set. See "Managing countries" above.

## Example

```twig
{% embed 'vartheme_bs5_horizonaid:map' with {
  map_height: 'lg',
} %}
  {% block countries %}
    {% embed 'vartheme_bs5_horizonaid:map-info-card' with {
      country_code: 'SO',
      heading: 'Somalia',
      description: 'Supporting displaced communities and refugee populations across southern and central regions.',
      stat_1_value: '2.9M',
      stat_1_label: 'Internally displaced people reached',
      stat_2_value: '14K',
      stat_2_label: 'Legal aid cases supported in 2025',
      link_url: 'https://example.com/somalia',
    } %}
    {% endembed %}
    {% embed 'vartheme_bs5_horizonaid:map-info-card' with {
      country_code: 'UA',
      heading: 'Ukraine',
      description: 'Emergency response for conflict-affected communities.',
      stat_1_value: '1.2M',
      stat_1_label: 'People assisted',
      link_url: 'https://example.com/ukraine',
    } %}
    {% endembed %}
  {% endblock %}
{% endembed %}
```

## Notes

- **No API key, no external network calls at runtime.** The map used to wrap the Google Maps JavaScript API (and needed a key configured under Appearance → Settings). It's now a plain SVG: `map.js` fetches the vendored GeoJSON and projects it straight to `<path>` elements with d3-geo, entirely client-side.
- **The GeoJSON URL comes from `drupalSettings`, not `component_metadata.path`.** A couple of other components (`card-text`, `card-country`) use `component_metadata.path` as a narrow, guarded fallback for Storybook example paths (`if component_metadata.path is defined`) — but it resolves to an **empty string** when Drupal Canvas renders this component through its own API rendering path, 404ing the GeoJSON fetch and silently breaking the entire map (no country shapes drawn, and every dropped `map-info-card` stays visible/unpositioned since the JS never gets past the failed fetch — see the progressive-enhancement note below, which is exactly what that failure mode looks like). `vartheme_bs5_horizonaid_page_attachments_alter()` computes the URL server-side with `extension.list.theme` (reliable in every rendering context) and exposes it as `drupalSettings.varthemeBs5HorizonaidMap.geojsonUrl`, the same mechanism the old Google Maps API key used this hook for.
- **d3-geo is vendored, not bundled.** This theme's component build (`webpack.config.components.js`) only compiles SCSS — there's no JS bundler wiring `node_modules` imports into browser code. `d3-geo` (v3.1.1) and its `d3-array` (v3.2.4) dependency are vendored as their pre-built minified UMD files (`assets/vendor/`, ISC license, copyright header retained) and registered as the `d3-geo-vendor` Drupal library (see `vartheme_bs5_horizonaid.libraries.yml`), a dependency of this component. d3-array must load first — its UMD build populates the shared `window.d3` global that d3-geo's own UMD wrapper extends.
- **Country boundaries are Natural Earth's 110m admin-0 countries dataset** (`assets/world-countries-110m.geojson`), vendored and trimmed to just `iso_a2` / `iso_a3` / `name` + geometry (~250KB). Public domain, no attribution required — the standard resolution tier for whole-world (not zoomed-in) map displays, also used by D3's own examples and `topojson/world-atlas`.
- **Highlighted countries and popup content are discovered from the DOM, not from component props.** Every `map-info-card` dropped into the `countries` slot renders its own `data-country-code` attribute; `map.js` reads whichever cards are actually there to build the highlighted set and the click → popup mapping. This is why there's no field limit and nothing to keep in sync — unlike the old numbered `country_1_*`..`country_10_*` props this component used with Google Maps (Canvas has no field/widget mapping for an array-of-objects *prop*, but a slot of pre-built component *instances* has no such limit — the same pattern `organisms/impressed-card-slider` uses for its cards).
- Country matching uses **ISO 3166-1 alpha-2 codes**, matched against the GeoJSON's `iso_a2` property.
- **Projection:** `d3.geoNaturalEarth1()`, fit to the SVG's `viewBox` via d3's `fitSize` — a flat, low-distortion whole-world projection, the standard choice for this kind of overview map (also what fixes Google's Mercator-based zoom levels from meaning anything here). Zoom in/out multiplies/divides a scale transform on the country `<g>` around the map's center; reset returns to scale `1`, clears any pan offset, and closes any open popup.
- **Drag-to-pan.** Pointer events on the canvas translate the `<g>` by the drag delta, converted from screen pixels to the group's own coordinate space via its `getScreenCTM()` scale factor, so it stays accurate at any zoom level. A drag past a small pixel threshold suppresses the click that would otherwise follow on pointer-up, so panning across a highlighted country never accidentally opens its popup — a stationary click still opens it normally. The cursor switches to a "grab"/"grabbing" hand to signal this.
- **Zoom/reset controls sit bottom-left** (`.map__controls`).
- **Popup positioning uses `getScreenCTM()`** on the clicked country's `<path>` (via its bounding-box center), which accounts for the SVG's `viewBox` scaling and the zoom `<g>`'s transform automatically — simpler and more robust than the manual lat/lng-to-pixel math the old Google Maps version needed.
- **Highlighted countries are keyboard-accessible** (`tabindex="0"`, `role="button"`, `aria-label` from the GeoJSON's country name, Enter/Space to activate) — an improvement over the old Google Maps Data-layer version, which had no keyboard access at all.
- **Progressive enhancement:** without JS (or if the GeoJSON fetch fails), the SVG canvas stays empty, but every dropped `map-info-card` still renders in normal document flow inside `.map__popup` — country information is never fully inaccessible, it just isn't the floating click-to-reveal popup. `map.scss`'s `.map__popup--positioned` modifier (added by `map.js` only once a country is actually clicked) is what switches the popup to floating/absolute positioning.
- The card's own zoom/reset buttons use the theme's `$primary` (default background) and `$accent` (default icon) tokens, swapping to `$accent` background / white icon on hover — both read from this theme's existing color tokens, not new hardcoded hex values.
- **Country colors** are plain CSS custom properties on `.map`, swapped with `:hover`/`:focus-visible` rather than JS-computed inline styles (simpler than the old Google Data-layer version, which needed manual `mouseover`/`mouseout` listeners to fake the same effect): `--map-country-fill` (`#E0E0E0` — a fixed design value; no existing Bootstrap/theme token matches it), `--map-country-highlighted-fill` (`var(--bs-accent)`, `#0073E6`), `--map-country-highlighted-hover-fill` (`var(--bs-secondary)`, `#0D2C54` — this theme's `$secondary`/`$navy`).
- If no content is provided to the `content` slot, nothing is rendered above the map (no placeholder — unlike a drag & drop slot component, this one is fully optional).
