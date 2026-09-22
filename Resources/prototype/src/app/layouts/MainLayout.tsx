import { Outlet } from 'react-router';
import { Footer } from '@/app/components/layout/Footer';
import { Header } from '@/app/components/layout/Header';

/**
 * Page shell: header, content, footer.
 *
 * Deliberately adds NO wrapper of its own. `App.tsx` already provides the
 * `crd-root flex min-h-screen flex-col` column that production's `CrdLayout`
 * uses, and these three are its direct children — exactly production's
 * structure.
 *
 * A second `min-h-screen` shell here used to nest another constrained flex
 * column inside the first. Combined with `#root { height: 100% }` from
 * production's global stylesheet, that capped the column at viewport height
 * and let the header's `h-16` shrink to 45px.
 */
export function MainLayout() {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
