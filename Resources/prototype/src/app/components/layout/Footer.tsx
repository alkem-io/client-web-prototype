/**
 * Footer — production's `@/crd/layouts/Footer`, wired to the prototype's
 * LanguageContext.
 *
 * The prototype's own footer capped content at `max-w-7xl` (1280px) while
 * production caps at 1600px with `px-4 sm:px-6`, so the two disagreed on page
 * margins at every viewport above 1280px. Production wins.
 *
 * This file exists only to adapt the context to production's props — it must
 * not restyle anything.
 */
import { Footer as CrdFooter } from '@/crd/layouts/Footer';
import { LANGUAGES, useLanguage, type Language } from '@/app/contexts/LanguageContext';

const FOOTER_LINKS = {
  terms: '/terms',
  privacy: '/privacy',
  security: '/security',
  about: '/about'
};

export function Footer({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <CrdFooter
      className={className}
      links={FOOTER_LINKS}
      languages={LANGUAGES.map(l => ({ code: l.code, label: l.label }))}
      currentLanguage={language}
      onLanguageChange={code => setLanguage(code as Language)}
    />
  );
}
