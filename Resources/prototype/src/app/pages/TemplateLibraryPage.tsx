/**
 * Template library page.
 *
 * The header mirrors production's `CrdInnovationLibraryPage` (title + subtitle
 * above CRD's `InnovationLibraryView`), but the container is the prototype's
 * shared `ContentBand` rather than production's `max-w-7xl`: production uses a
 * different container on each standalone page, which left the library on a
 * different margin than the rest of the app. See `ContentBand`.
 */
import { useTranslation } from 'react-i18next';
import { ContentBand } from '@/app/components/layout/ContentBand';
import { TemplateLibrary } from '@/app/components/template-library/TemplateLibrary';

export default function TemplateLibraryPage() {
  const { t } = useTranslation('crd-templates');

  return (
    <ContentBand className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-page-title">{t('library.title')}</h1>
        <p className="text-body text-muted-foreground">{t('library.subtitle')}</p>
      </header>
      <TemplateLibrary />
    </ContentBand>
  );
}
