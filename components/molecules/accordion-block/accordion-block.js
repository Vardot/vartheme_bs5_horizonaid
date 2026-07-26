/**
 * @file
 * Accordion Block toggle behavior.
 *
 * Replaces Bootstrap's Collapse plugin: expand/collapse is a single class
 * toggle (`is-expanded`) so the CSS grid-template-rows height animation in
 * accordion-block.scss can run without JS measuring pixel heights. When a
 * header's `data-accordion-parent` points at an ancestor id and
 * `data-accordion-allow-multiple` is not "true", opening the item collapses
 * its open siblings within that same ancestor (single-open-at-a-time
 * grouping, mirroring the old data-bs-parent behavior).
 */

((Drupal, once) => {
  function setExpanded(item, header, expanded) {
    item.classList.toggle('is-expanded', expanded);
    header.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    const wrapper = item.querySelector('.accordion-block__body-wrapper');
    if (wrapper) {
      wrapper.setAttribute('aria-hidden', expanded ? 'false' : 'true');
    }
  }

  function collapseGroupSiblings(item, groupId) {
    const group = document.getElementById(groupId);
    if (!group) {
      return;
    }
    group
      .querySelectorAll('.accordion-block.is-expanded')
      .forEach((sibling) => {
        if (sibling === item) {
          return;
        }
        const siblingHeader = sibling.querySelector('.accordion-block__header');
        if (
          !siblingHeader ||
          siblingHeader.getAttribute('data-accordion-allow-multiple') === 'true'
        ) {
          return;
        }
        setExpanded(sibling, siblingHeader, false);
      });
  }

  Drupal.behaviors.varthemeBs5HorizonaidAccordionBlock = {
    attach(context) {
      once(
        'varthemeBs5HorizonaidAccordionBlock',
        '.accordion-block__header',
        context,
      ).forEach((header) => {
        header.addEventListener('click', () => {
          const item = header.closest('.accordion-block');
          if (!item) {
            return;
          }

          const nowExpanded = !item.classList.contains('is-expanded');
          if (nowExpanded) {
            const groupId = header.getAttribute('data-accordion-parent');
            const allowMultiple =
              header.getAttribute('data-accordion-allow-multiple') === 'true';
            if (groupId && !allowMultiple) {
              collapseGroupSiblings(item, groupId);
            }
          }

          setExpanded(item, header, nowExpanded);
        });
      });
    },
  };
})(Drupal, once);
