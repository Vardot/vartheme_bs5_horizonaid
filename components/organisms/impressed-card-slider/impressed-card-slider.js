/**
 * @file
 * Impressed Card Slider enhancements (Canvas/SDC-safe).
 *
 * Bootstrap has no multi-item-visible slider plugin to drive this, so the
 * track scrolls via plain `scrollBy()`. Progressive enhancement: without
 * JS the track is still a native scrollable/swipeable/keyboard-focusable
 * element (CSS Scroll Snap + `tabindex="0"`), just without the prev/next
 * buttons or disabled-at-the-end state.
 */
((Drupal, once) => {
  function flattenTrackItems(track) {
    Array.prototype.slice
      .call(track.querySelectorAll('.card-impressed'))
      .forEach((item) => {
        if (item.parentElement !== track) {
          track.appendChild(item);
        }
      });
  }

  function stepWidth(track) {
    const first = track.querySelector('.card-impressed');
    if (!first) {
      return track.clientWidth;
    }
    const gap = parseFloat(
      getComputedStyle(track).columnGap || getComputedStyle(track).gap || '0',
    );
    return first.getBoundingClientRect().width + gap;
  }

  function updateControls(track, prevButton, nextButton) {
    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    prevButton.disabled = track.scrollLeft <= 0;
    nextButton.disabled = track.scrollLeft >= maxScrollLeft - 1;
  }

  function initSlider(root) {
    const track = root.querySelector('[data-impressed-card-slider-track]');
    const prevButton = root.querySelector('[data-impressed-card-slider-prev]');
    const nextButton = root.querySelector('[data-impressed-card-slider-next]');
    if (!track || !prevButton || !nextButton) {
      return;
    }

    flattenTrackItems(track);

    prevButton.addEventListener('click', () => {
      track.scrollBy({ left: -stepWidth(track), behavior: 'smooth' });
    });
    nextButton.addEventListener('click', () => {
      track.scrollBy({ left: stepWidth(track), behavior: 'smooth' });
    });

    updateControls(track, prevButton, nextButton);
    track.addEventListener('scroll', () =>
      updateControls(track, prevButton, nextButton),
    );
    window.addEventListener('resize', () =>
      updateControls(track, prevButton, nextButton),
    );
  }

  Drupal.behaviors.impressedCardSlider = {
    attach(context) {
      once('impressed-card-slider', '.impressed-card-slider', context).forEach(
        initSlider,
      );
    },
  };
})(Drupal, once);
