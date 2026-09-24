/**
 * @file
 * Behaviors for the Vartheme BS5 Horizonaid theme.
 */

(function ($, Drupal, once) {
  Drupal.behaviors.varthemeBS5Horizonaid = {
    attach() {
      // Vartheme JavaScript behaviors goes here.
    },
  };

  /**
   * Opens external links in a new tab and tells screen readers so.
   *
   * Covers links no component renders: menus, rich text and blocks.
   */
  Drupal.behaviors.varthemeBS5HorizonaidNewTab = {
    attach(context) {
      const notice = Drupal.t('(opens in a new tab)');
      const host = window.location.hostname.replace(/^www\./, '');

      once('vartheme-new-tab', 'a[href]', context).forEach((link) => {
        let url;
        try {
          url = new URL(link.href, window.location.href);
        } catch (e) {
          return;
        }
        const external =
          /^https?:$/.test(url.protocol) &&
          url.hostname.replace(/^www\./, '') !== host;
        if (!external && link.getAttribute('target') !== '_blank') {
          return;
        }

        link.setAttribute('target', '_blank');
        link.relList.add('noopener', 'noreferrer');

        // Skip a link a component, an editor or another module already announced.
        const label = link.getAttribute('aria-label');
        const announced =
          link.querySelector('[data-new-tab-hint]') ||
          (label || link.textContent).includes(notice);
        if (announced) {
          return;
        }
        if (label) {
          link.setAttribute('aria-label', `${label} ${notice}`);
          return;
        }
        const hint = document.createElement('span');
        hint.className = 'visually-hidden';
        hint.dataset.newTabHint = '';
        hint.textContent = ` ${notice}`;
        link.appendChild(hint);
      });
    },
  };
})(window.jQuery, window.Drupal, window.once);
