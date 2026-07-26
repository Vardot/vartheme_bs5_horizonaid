/**
 * @file
 * Map Info Card close behavior.
 *
 * Progressive enhancement only: without JS the card simply has no working
 * close button (it still renders fine). Hides the closest `.map-info-card`
 * on click via the `hidden` attribute rather than a class, so this works
 * whether the card is used standalone or as organisms/map's popup (whose
 * own JS shows/hides the same card by toggling `hidden`).
 */

((Drupal, once) => {
  Drupal.behaviors.varthemeBs5HorizonaidMapInfoCard = {
    attach(context) {
      once(
        'varthemeBs5HorizonaidMapInfoCard',
        '.map-info-card__close',
        context,
      ).forEach((closeButton) => {
        closeButton.addEventListener('click', () => {
          const card = closeButton.closest('.map-info-card');
          if (card) {
            card.hidden = true;
          }
        });
      });
    },
  };
})(Drupal, once);
