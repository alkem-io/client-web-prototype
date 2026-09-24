/**
 * Innovation pack profile page.
 *
 * Wrapped in the prototype's shared `ContentBand` so it lines up with every
 * other page. Production uses `container mx-auto px-4 md:px-8` here and
 * `max-w-7xl px-4` on the library — two different margins for two adjacent
 * pages. See `ContentBand`.
 */
import { ContentBand } from "@/app/components/layout/ContentBand";
import { TemplatePackDetail } from "@/app/components/template-library/TemplatePackDetail";

export default function TemplatePackDetailPage() {
  return (
    <ContentBand>
      <TemplatePackDetail />
    </ContentBand>
  );
}
