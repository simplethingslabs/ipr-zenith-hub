/**
 * Restores scroll position to the top on route change.
 *
 * React Router does not do this by default, so navigating from halfway down the
 * long Practice Areas page to Contact previously landed the visitor halfway down
 * Contact. In-page anchor links (`/practice-areas#patents`) are left alone so the
 * browser can still jump to the target element.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Let the browser resolve the anchor; if the element is not mounted yet,
      // scroll to it once this frame settles.
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
