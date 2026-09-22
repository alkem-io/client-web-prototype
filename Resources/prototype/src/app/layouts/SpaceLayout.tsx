import { Outlet } from 'react-router';
import { Footer } from '@/app/components/layout/Footer';
import { Header } from '@/app/components/layout/Header';

/** Space pages: same shell as MainLayout — see the note there on why there is
 *  no wrapper element. */
export function SpaceLayout() {
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
