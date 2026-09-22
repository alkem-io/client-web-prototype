import { RouterProvider } from 'react-router-dom';
import { Toaster } from '@/crd/primitives/sonner';
import { TooltipProvider } from '@/crd/primitives/tooltip';
import { LanguageProvider } from './contexts/LanguageContext';
import { MessagingHubProvider } from './contexts/MessagingHubContext';
import { SearchProvider } from './contexts/SearchContext';
import { router } from './routes';

export default function App() {
  return (
    /*
     * `crd-root` is required, not cosmetic: crd.css scopes the Inter font
     * stack, the token-driven background/foreground colours, the border reset
     * and the pointer-cursor rules to this class. Without it the prototype
     * renders unstyled. Production applies it in CrdLayout; the prototype uses
     * its own layouts, so it goes on the app root instead.
     *
     * `shrink-0` is needed here but not in production: production's CrdLayout
     * sits inside extra wrappers that grow past the viewport, so its crd-root
     * is content-sized. Here crd-root is a direct flex child of
     * `#root { height:100%; display:flex }` (production's global stylesheet,
     * vendored in src/vendor/), so without it the column is capped at viewport
     * height and the header's h-16 collapses to 45px.
     */
    <div className="crd-root flex min-h-screen shrink-0 flex-col bg-background text-foreground">
      <TooltipProvider delayDuration={500}>
        <LanguageProvider>
          <MessagingHubProvider>
            <SearchProvider>
              <RouterProvider router={router} />
              <Toaster />
            </SearchProvider>
          </MessagingHubProvider>
        </LanguageProvider>
      </TooltipProvider>
    </div>
  );
}
