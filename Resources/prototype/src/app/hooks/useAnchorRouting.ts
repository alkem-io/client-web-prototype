/**
 * Make CRD's plain `<a href>` links navigate through the router.
 *
 * CRD is client-agnostic by design: it has no router dependency, so every link
 * it renders — `CompactSpaceCard`, `SidebarResourceItem`, `SpaceCard`,
 * `DashboardSidebar` — is a bare `<a href="/space/…">`. Left alone those do a
 * full document load, which in the prototype means losing all in-memory mock
 * state and a visible white flash on every click.
 *
 * Rather than re-implement each CRD component to accept a `Link`, one delegated
 * listener on the document turns same-origin anchor clicks into router
 * navigations. This is the same trick client-web's own CRD pages rely on, and
 * it means every future CRD conversion gets working navigation for free.
 *
 * Deliberately does NOT intercept: modified clicks (new tab / new window),
 * non-left buttons, `target=_blank`, `download`, external origins, explicit
 * `data-native-link`, or anchors whose default was already prevented by a
 * handler inside the card (CRD's pin button does exactly that).
 */
import { useEffect } from 'react';
import type { createBrowserRouter } from 'react-router';

type Router = ReturnType<typeof createBrowserRouter>;

export function useAnchorRouting(router: Router) {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // A nested handler (e.g. CRD's home-space pin button) already handled it.
      if (event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download') || anchor.hasAttribute('data-native-link')) return;
      if (anchor.getAttribute('rel')?.includes('external')) return;

      const url = new URL(anchor.href, window.location.origin);
      if (url.origin !== window.location.origin) return;

      event.preventDefault();
      void router.navigate(url.pathname + url.search + url.hash);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [router]);
}
