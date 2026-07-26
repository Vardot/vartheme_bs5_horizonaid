/**
 * @file
 * Map behavior.
 *
 * Self-contained SVG world map — no external map API or key. Projects the
 * vendored country GeoJSON straight to SVG `<path>` elements with d3-geo
 * (vendored UMD build, see vartheme_bs5_horizonaid.libraries.yml's
 * `d3-geo-vendor` library — loaded as plain globals under `window.d3`,
 * not bundled, since this theme's component build only compiles SCSS).
 *
 * Highlighted countries and their popups are discovered from the DOM, not
 * from component props: every molecules/map-info-card dropped into the
 * `countries` slot carries its own `data-country-code` attribute, so this
 * behavior just reads whatever cards are already there. Clicking a
 * highlighted country shows that exact card (hiding any other) and
 * positions it over the country via `getScreenCTM()`, which accounts for
 * the SVG's viewBox scaling and the zoom `<g>`'s transform automatically —
 * no manual projection math needed the way Google's lat/lng bounds did.
 *
 * Progressive enhancement: without JS (or if the GeoJSON fetch fails) the
 * SVG canvas stays empty, but every dropped map-info-card is still fully
 * rendered and readable in normal flow (map.scss only switches `.map__popup`
 * to floating/absolute positioning once this behavior successfully attaches
 * `--positioned`), so country information is never fully inaccessible.
 *
 * Drag-to-pan: pointer events on the canvas translate the zoom `<g>` by the
 * drag delta, converted from screen pixels to the group's own coordinate
 * space via its `getScreenCTM()` scale factor (so it stays accurate at any
 * zoom level or card size). A real drag (past a small pixel threshold, to
 * tell it apart from a stationary click) suppresses the click that would
 * otherwise follow on pointer-up, so panning across a highlighted country
 * never accidentally opens its popup.
 *
 * The GeoJSON URL comes from drupalSettings
 * (varthemeBs5HorizonaidMap.geojsonUrl), computed server-side in
 * vartheme_bs5_horizonaid_page_attachments_alter() — not from a data
 * attribute built with `component_metadata.path` in Twig, which resolves to
 * an empty string when Drupal Canvas renders this component through its own
 * API rendering path (confirmed: the fetch 404s there, breaking the whole
 * map). See that hook's docblock.
 */
((Drupal, once) => {
  const ZOOM_STEP = 1.4;
  const MAX_SCALE = 8;
  const MIN_SCALE = 1;
  const VIEWBOX_WIDTH = 960;
  const VIEWBOX_HEIGHT = 500;
  const DRAG_CLICK_THRESHOLD = 4; // px of movement before a drag counts as a pan, not a click.

  function buildCountriesByCode(popup) {
    const map = new Map();
    if (!popup) {
      return map;
    }
    popup
      .querySelectorAll('.map-info-card[data-country-code]')
      .forEach((card) => {
        const code = card.getAttribute('data-country-code');
        if (code) {
          map.set(code, card);
        }
      });
    return map;
  }

  function hideAllCards(countriesByCode) {
    countriesByCode.forEach((card) => {
      card.hidden = true;
    });
  }

  // 0.75rem at the theme's default 16px root font size — the gap between
  // the popup and the country it points to.
  const POPUP_GAP = 12;

  function showCard(mapRoot, popup, card, group, pathEl) {
    card.hidden = false;
    popup.classList.add('map__popup--positioned');

    const svg = mapRoot.querySelector('[data-map-canvas]');
    const point = svg.createSVGPoint();
    const bbox = pathEl.getBBox();
    point.x = bbox.x + bbox.width / 2;
    point.y = bbox.y + bbox.height / 2;
    const screenPoint = point.matrixTransform(group.getScreenCTM());
    const mapBounds = mapRoot.getBoundingClientRect();
    const anchorX = screenPoint.x - mapBounds.left;
    const anchorY = screenPoint.y - mapBounds.top;

    // Centered above the country, offset by the gap — but clamped to the
    // map's own visible area, since `.map` clips overflow: a card centered
    // on a country near the top/left/right edge would otherwise render
    // partly (or, for the top edge, almost entirely) outside that box and
    // get cut off, exactly as it did before this clamping existed.
    const left = Math.max(
      0,
      Math.min(
        anchorX - popup.offsetWidth / 2,
        mapBounds.width - popup.offsetWidth,
      ),
    );
    const top = Math.max(
      0,
      Math.min(
        anchorY - popup.offsetHeight - POPUP_GAP,
        mapBounds.height - popup.offsetHeight,
      ),
    );
    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
  }

  function initMap(canvas, drupalSettings) {
    const { d3 } = window;
    if (!d3 || !d3.geoNaturalEarth1 || !d3.geoPath) {
      return;
    }

    const mapRoot = canvas.closest('.map');
    const popup = mapRoot ? mapRoot.querySelector('[data-map-popup]') : null;
    const countriesByCode = buildCountriesByCode(popup);
    const geojsonUrl =
      (drupalSettings.varthemeBs5HorizonaidMap &&
        drupalSettings.varthemeBs5HorizonaidMap.geojsonUrl) ||
      '';
    if (!geojsonUrl) {
      return;
    }

    fetch(geojsonUrl)
      .then((response) => response.json())
      .then((geojson) => {
        const projection = d3
          .geoNaturalEarth1()
          .fitSize([VIEWBOX_WIDTH, VIEWBOX_HEIGHT], geojson);
        const pathGenerator = d3.geoPath(projection);

        const svgNs = 'http://www.w3.org/2000/svg';
        const group = document.createElementNS(svgNs, 'g');
        group.setAttribute('data-map-zoom-group', true);
        canvas.appendChild(group);

        geojson.features.forEach((feature) => {
          const code = feature.properties && feature.properties.iso_a2;
          const highlighted = countriesByCode.has(code);
          const pathEl = document.createElementNS(svgNs, 'path');
          pathEl.setAttribute('d', pathGenerator(feature) || '');
          pathEl.setAttribute('data-iso-a2', code || '');
          pathEl.classList.add('map__country');
          if (highlighted) {
            pathEl.classList.add('map__country--highlighted');
            pathEl.setAttribute('tabindex', '0');
            pathEl.setAttribute('role', 'button');
            pathEl.setAttribute(
              'aria-label',
              (feature.properties && feature.properties.name) || code,
            );
          }
          group.appendChild(pathEl);
        });

        let scale = MIN_SCALE;
        let panX = 0;
        let panY = 0;
        const cx = VIEWBOX_WIDTH / 2;
        const cy = VIEWBOX_HEIGHT / 2;

        function applyTransform() {
          group.setAttribute(
            'transform',
            `translate(${panX + cx}, ${panY + cy}) scale(${scale}) translate(${-cx}, ${-cy})`,
          );
        }
        applyTransform();

        const selectCountry = (pathEl) => {
          if (!popup) {
            return;
          }
          const code = pathEl.getAttribute('data-iso-a2');
          const card = countriesByCode.get(code);
          if (!card) {
            return;
          }
          hideAllCards(countriesByCode);
          showCard(mapRoot, popup, card, group, pathEl);
        };

        // --- Drag-to-pan ---------------------------------------------------
        // `canvas.setPointerCapture()` retargets every subsequent pointer
        // event (and the "click" the browser synthesizes from a
        // stationary pointerdown+pointerup pair) to `canvas` itself, not
        // whatever element was actually under the pointer — so a
        // `click` listener reading `event.target` can never find the
        // clicked country once capture is in effect. The country is
        // resolved once, from the real target at `pointerdown` time
        // (before capture applies), and reused at `pointerup` instead of
        // relying on a separate click event.
        let isDragging = false;
        let dragMoved = false;
        let dragStartClientX = 0;
        let dragStartClientY = 0;
        let dragStartPanX = 0;
        let dragStartPanY = 0;
        let dragPxToUnit = 1;
        let pointerDownCountryPath = null;

        canvas.addEventListener('pointerdown', (event) => {
          if (event.button !== 0) {
            return;
          }
          isDragging = true;
          dragMoved = false;
          dragStartClientX = event.clientX;
          dragStartClientY = event.clientY;
          dragStartPanX = panX;
          dragStartPanY = panY;
          pointerDownCountryPath = event.target.closest(
            '.map__country--highlighted',
          );
          const ctm = group.getScreenCTM();
          dragPxToUnit = ctm && ctm.a ? 1 / ctm.a : 1;
          canvas.setPointerCapture(event.pointerId);
          canvas.classList.add('map__canvas--dragging');
        });

        canvas.addEventListener('pointermove', (event) => {
          if (!isDragging) {
            return;
          }
          const deltaX = event.clientX - dragStartClientX;
          const deltaY = event.clientY - dragStartClientY;
          if (!dragMoved && Math.hypot(deltaX, deltaY) > DRAG_CLICK_THRESHOLD) {
            dragMoved = true;
          }
          panX = dragStartPanX + deltaX * dragPxToUnit;
          panY = dragStartPanY + deltaY * dragPxToUnit;
          applyTransform();
        });

        canvas.addEventListener('pointerup', () => {
          isDragging = false;
          canvas.classList.remove('map__canvas--dragging');
          if (!dragMoved && pointerDownCountryPath) {
            selectCountry(pointerDownCountryPath);
          }
          pointerDownCountryPath = null;
        });

        canvas.addEventListener('pointercancel', () => {
          isDragging = false;
          canvas.classList.remove('map__canvas--dragging');
          pointerDownCountryPath = null;
        });

        if (popup) {
          // Keyboard access: highlighted countries are focusable
          // (tabindex="0", role="button" above) but SVG has no native
          // Enter/Space activation the way a real <button> does. Unrelated
          // to pointer capture, so a plain `event.target` check is fine
          // here.
          group.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') {
              return;
            }
            const pathEl = event.target.closest('.map__country--highlighted');
            if (pathEl) {
              event.preventDefault();
              selectCountry(pathEl);
            }
          });

          countriesByCode.forEach((card) => {
            card.hidden = true;
            const closeButton = card.querySelector('.map-info-card__close');
            if (closeButton) {
              closeButton.addEventListener('click', () => {
                popup.classList.remove('map__popup--positioned');
              });
            }
          });
        }

        (mapRoot || canvas.parentElement)
          .querySelectorAll('[data-map-action]')
          .forEach((button) => {
            button.addEventListener('click', () => {
              const action = button.getAttribute('data-map-action');
              if (action === 'zoom-in') {
                scale = Math.min(MAX_SCALE, scale * ZOOM_STEP);
                applyTransform();
              } else if (action === 'zoom-out') {
                scale = Math.max(MIN_SCALE, scale / ZOOM_STEP);
                applyTransform();
              } else if (action === 'reset') {
                scale = MIN_SCALE;
                panX = 0;
                panY = 0;
                applyTransform();
                if (popup) {
                  hideAllCards(countriesByCode);
                  popup.classList.remove('map__popup--positioned');
                }
              }
            });
          });
      })
      .catch(() => {
        // Progressive enhancement: leave the empty SVG canvas as-is. Any
        // map-info-card dropped into the countries slot is still rendered
        // and readable in normal flow (see the file's docblock).
      });
  }

  Drupal.behaviors.varthemeBs5HorizonaidMap = {
    attach(context, settings) {
      once('varthemeBs5HorizonaidMap', '[data-map-canvas]', context).forEach(
        (canvas) => initMap(canvas, settings),
      );
    },
  };
})(Drupal, once);
