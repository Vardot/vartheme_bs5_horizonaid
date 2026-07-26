/**
 * @file
 * Forces the Country Card's hover-reveal content open inside the Drupal
 * Canvas editor's own canvas.
 *
 * Progressive enhancement: without JS the card behaves exactly as its CSS
 * defines (footer content past the first child, and the link, stay
 * `opacity: 0` until `:hover`/`:focus-within`). That's the intended public
 * front-end effect, but it means an editor who drops a second component
 * (e.g. a Text under the Heading) into the `content` slot sees it vanish
 * the moment their cursor leaves the card — it isn't broken, it's just
 * only ever visible on hover, which reads as "hidden" while editing.
 * Adding `.card-country--editor-reveal` (styled in card-country.scss to
 * match the `:hover`/`:focus-within` state) keeps every dropped component
 * visible at all times inside the editor's own canvas.
 *
 * Also skipped inside Canvas's own live-preview iframe and on the public
 * frontend, both of which should keep the real hover-to-reveal behavior —
 * mirrors the same `inCanvasEditor()` check figure.js uses (duplicated
 * rather than imported: this loads as a classic script, and the shared
 * helper is only ever used from an ES module — see anchor.js).
 */
((Drupal, once) => {
  const inCanvasEditor = () =>
    Boolean(
      window.parent &&
      window.parent.drupalSettings &&
      window.parent.drupalSettings.canvas &&
      !window.parent.document.body.querySelector(
        '[class^="_PagePreviewIframe"]',
      ),
    );

  Drupal.behaviors.varthemeBs5HorizonaidCardCountry = {
    attach(context) {
      if (!inCanvasEditor()) {
        return;
      }

      once(
        'varthemeBs5HorizonaidCardCountry',
        '.card-country',
        context,
      ).forEach((el) => {
        el.classList.add('card-country--editor-reveal');
      });
    },
  };
})(Drupal, once);
