/**
 * @file
 * Count-up animation for the Figure component's stat number.
 *
 * Progressive enhancement: the number is server-rendered as its final
 * value, so the component is fully usable without JS. When this behavior
 * runs, it resets the number to 0 and counts it up once the element
 * scrolls into view, unless the user prefers reduced motion — in which
 * case the final value is left untouched and nothing animates.
 *
 * Also skipped inside the Drupal Canvas editor surface: Canvas re-renders
 * components on every edit, and re-running a rAF loop + IntersectionObserver
 * per instance on each of those re-renders is a real performance drag.
 * Canvas's own live-preview iframe (which mirrors the frontend) and the
 * public frontend itself both still animate normally — only the editor's
 * own canvas is skipped.
 *
 * The number prop is free text (e.g. `48K+`, `$2.9M`, `99%`), not a plain
 * integer, so only the numeric core is counted up — any non-numeric prefix
 * (`$`) and suffix (`K+`, `M`, `%`) are kept static around it instead of
 * being dropped, and decimal precision (e.g. `4.8`) is preserved throughout
 * the animation rather than rounded to a whole number.
 */
((Drupal, once) => {
  const COUNT_UP_DURATION = 1800;
  const NUMBER_PATTERN = /-?[\d,]*\.?\d+/;

  const easeOutCubic = (t) => 1 - (1 - t) ** 3;

  // Mirrors lib/currentlyInCanvasEditor.js, duplicated rather than imported:
  // this behavior loads as a classic script (Drupal.behaviors + once), and
  // that helper is only ever used from an ES module (see
  // components/atoms/anchor/anchor.js, which opts into `type: module` via
  // its own libraryOverrides) — module and classic script loading aren't
  // mixed anywhere else in this theme, so this stays a plain script.
  const inCanvasEditor = () =>
    Boolean(
      window.parent &&
      window.parent.drupalSettings &&
      window.parent.drupalSettings.canvas &&
      !window.parent.document.body.querySelector(
        '[class^="_PagePreviewIframe"]',
      ),
    );

  const formatCount = (value, decimals) =>
    value.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  const animateCountUp = (el, target, duration, prefix, suffix, decimals) => {
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const current = easeOutCubic(progress) * target;
      el.textContent = prefix + formatCount(current, decimals) + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(tick);
      }
    };

    window.requestAnimationFrame(tick);
  };

  Drupal.behaviors.varthemeBs5HorizonaidFigure = {
    attach(context) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      if (inCanvasEditor()) {
        return;
      }

      once(
        'varthemeBs5HorizonaidFigure',
        '[data-count-target]',
        context,
      ).forEach((el) => {
        const raw = el.getAttribute('data-count-target') || '';
        const match = raw.match(NUMBER_PATTERN);
        if (!match) {
          return;
        }

        const numberText = match[0];
        const prefix = raw.slice(0, match.index);
        const suffix = raw.slice(match.index + numberText.length);
        const target = parseFloat(numberText.replace(/,/g, ''));
        if (Number.isNaN(target)) {
          return;
        }
        const decimals = (numberText.split('.')[1] || '').length;

        el.textContent = prefix + formatCount(0, decimals) + suffix;

        const observer = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                animateCountUp(
                  el,
                  target,
                  COUNT_UP_DURATION,
                  prefix,
                  suffix,
                  decimals,
                );
                obs.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.4 },
        );

        observer.observe(el);
      });
    },
  };
})(Drupal, once);
