/**
 * @file
 * Programs tabs enhancements (Canvas/SDC-safe).
 *
 * Canvas renders each "Program Tab" slot child independently, so the shared
 * pill nav can't be built in Twig from sibling data. Each Program Tab
 * instance nests its own pill nav `<button>` inside its own `.tab-pane` (see
 * `molecules/program-tab`); this behavior:
 * - moves each button out into the shared nav `<ul>`.
 * - ensures exactly one tab/pane is active, auto-activating the first when
 *   none is flagged.
 *
 * Bootstrap's Tab plugin discovers sibling buttons by querying the closest
 * `.nav`/`[role="tablist"]` ancestor of the clicked button, and finds each
 * target pane by ID selector lookup — neither depends on DOM nesting depth
 * or direct-child adjacency, so no `.tab-pane` "flattening" (unlike
 * `hero-slider-container`'s `.carousel-item` flattening) is needed here.
 */
((Drupal, once) => {
  function ensureSingleActivePane(panes) {
    const active = panes.filter((pane) => pane.classList.contains('active'));
    if (active.length === 0 && panes.length) {
      panes[0].classList.add('show', 'active');
      return panes[0];
    }
    active.slice(1).forEach((pane) => pane.classList.remove('show', 'active'));
    return active[0] || null;
  }

  function buildNav(root) {
    const nav = root.querySelector('[data-programs-nav]');
    const content = root.querySelector('[data-programs-content]');
    if (!nav || !content) {
      return;
    }

    const panes = Array.prototype.slice.call(
      content.querySelectorAll('[data-programs-pane]'),
    );
    if (!panes.length) {
      return;
    }

    const activePane = ensureSingleActivePane(panes);

    panes.forEach((pane) => {
      const button = pane.querySelector('[data-programs-nav-button]');
      if (!button) {
        return;
      }

      const isActive = pane === activePane;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');

      const item = document.createElement('li');
      item.className = 'nav-item';
      item.setAttribute('role', 'presentation');
      item.appendChild(button);
      nav.appendChild(item);
    });
  }

  Drupal.behaviors.programs = {
    attach(context) {
      once('programs', '.programs', context).forEach(buildNav);
    },
  };
})(Drupal, once);
