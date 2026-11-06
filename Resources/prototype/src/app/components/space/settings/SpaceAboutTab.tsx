import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  AVAILABLE_CLASSIFICATION_TEMPLATES,
  type ClassificationTemplate,
} from '@/app/components/classifications/ClassificationPickerDialog';
import {
  type ClassificationPickerConflict,
  ClassificationPickerDialog,
  type ClassificationPickerSource,
} from '@/crd/components/classification/ClassificationPickerDialog';
import type {
  ClassificationEntryData,
  ClassificationTemplateOptionData,
} from '@/crd/components/classification/types';
import type { CityOption } from '@/crd/components/common/CityAutocompleteInput';
import { ImageCropDialog, type ImageCropConfig } from '@/crd/components/common/ImageCropDialog';
import { ConfirmationDialog } from '@/crd/components/dialogs/ConfirmationDialog';
import { SpaceSettingsAboutView } from '@/crd/components/space/settings/SpaceSettingsAboutView';
import type {
  AboutFormValues,
  AboutReference,
  SpaceCardPreview,
  SpaceSettingsLevel,
} from '@/crd/components/space/settings/SpaceSettingsAboutView.types';
import {
  DEFAULT_BANNER_ASPECT_RATIO,
  MAX_BANNER_ASPECT_RATIO,
  MIN_BANNER_ASPECT_RATIO,
} from '@/crd/lib/bannerAspectRatio';
import { getInitials } from '@/crd/lib/getInitials';
import { pickColorFromId } from '@/crd/lib/pickColorFromId';
import { TabSaveBar } from './TabSaveBar';
import { demoMarkdownUpload, fileToDataUrl, useDemoForm } from './demoState';

const BANNER_SETTINGS_KEY = 'alkemio-banner-settings';
/** The content width `mappers/spaceBanner.ts` converts a stored banner height against. */
const BANNER_BAND_WIDTH = 1140;
const DEFAULT_PAGE_BANNER =
  'https://images.unsplash.com/photo-1690191863988-f685cddde463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200';
const DEFAULT_CARD_BANNER =
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80';

const COUNTRIES = [
  { name: 'Belgium', code: 'BE' },
  { name: 'France', code: 'FR' },
  { name: 'Germany', code: 'DE' },
  { name: 'Netherlands', code: 'NL' },
  { name: 'Spain', code: 'ES' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'United States', code: 'US' },
];

const CITIES: CityOption[] = [
  { id: 'NL.amsterdam', name: 'Amsterdam', countryCode: 'NL', countryName: 'Netherlands' },
  { id: 'NL.rotterdam', name: 'Rotterdam', countryCode: 'NL', countryName: 'Netherlands' },
  { id: 'NL.utrecht', name: 'Utrecht', countryCode: 'NL', countryName: 'Netherlands' },
  { id: 'BE.brussels', name: 'Brussels', countryCode: 'BE', countryName: 'Belgium' },
  { id: 'DE.berlin', name: 'Berlin', countryCode: 'DE', countryName: 'Germany' },
  { id: 'ES.madrid', name: 'Madrid', countryCode: 'ES', countryName: 'Spain' },
];

const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const toTemplateOption = (template: ClassificationTemplate): ClassificationTemplateOptionData => ({
  id: template.id,
  displayLabel: template.name,
  description: template.description,
  cardinality: template.cardinality === 'multi' ? 'MULTI_SELECT' : 'SINGLE_SELECT',
  values: template.values.map(label => ({ id: slug(label), label })),
});

const PICKER_SOURCES: ClassificationPickerSource[] = [
  {
    key: 'platform',
    templates: AVAILABLE_CLASSIFICATION_TEMPLATES.filter(t => t.source !== 'space').map(toTemplateOption),
  },
  {
    key: 'space',
    templates: AVAILABLE_CLASSIFICATION_TEMPLATES.filter(t => t.source === 'space').map(toTemplateOption),
  },
];

const readStoredBanner = (): { image?: string; height?: number } => {
  try {
    return JSON.parse(localStorage.getItem(BANNER_SETTINGS_KEY) ?? '{}');
  } catch {
    return {};
  }
};

export type AboutState = { about: AboutFormValues; classifications: ClassificationEntryData[] };

const buildDemoAbout = (): AboutState => {
  const stored = readStoredBanner();
  const sdg = AVAILABLE_CLASSIFICATION_TEMPLATES.find(t => t.id === 'ct-sdg');
  const sdgOption = sdg ? toTemplateOption(sdg) : undefined;
  return {
    about: {
      name: 'Green Energy Space',
      tagline: 'Accelerating the transition to sustainable energy systems worldwide.',
      country: 'NL',
      city: 'Amsterdam',
      avatar: { id: 'avatar', uri: null, altText: null, aspectRatio: 1 },
      pageBanner: {
        id: 'page-banner',
        uri: stored.image ?? DEFAULT_PAGE_BANNER,
        altText: null,
        aspectRatio: stored.height ? BANNER_BAND_WIDTH / stored.height : DEFAULT_BANNER_ASPECT_RATIO,
      },
      cardBanner: { id: 'card-banner', uri: DEFAULT_CARD_BANNER, altText: null, aspectRatio: 416 / 256 },
      tagsetId: 'tagset-1',
      tags: ['Innovation', 'Sustainability', 'Tech'],
      profileId: 'profile-1',
      references: [
        { id: 'ref-1', title: 'Company Vision 2030', uri: 'https://example.com/vision', description: '' },
        { id: 'ref-2', title: 'Design System Guidelines', uri: 'https://example.com/design', description: '' },
      ],
      what: 'This space is dedicated to exploring new technologies and sustainable solutions.',
      why: "We believe that collaboration is key to solving the world's biggest challenges.",
      who: 'Engineers, Designers, and Product Managers who are passionate about the future.',
    },
    classifications: sdgOption
      ? [
          {
            id: 'cls-1',
            displayLabel: sdgOption.displayLabel,
            cardinality: sdgOption.cardinality,
            values: sdgOption.values,
            selectedValueIDs: sdgOption.values
              .filter(value => value.label.startsWith('SDG 7 ') || value.label.startsWith('SDG 13 '))
              .map(value => value.id),
            display: true,
            sortOrder: 0,
          },
        ]
      : [],
  };
};

/** Member-facing pages read the page banner from here (`mappers/spaceBanner.ts`). */
const persistPageBanner = (next: AboutState, previous: AboutState) => {
  const banner = next.about.pageBanner;
  const before = previous.about.pageBanner;
  if (banner.uri === before.uri && banner.aspectRatio === before.aspectRatio) return;
  try {
    localStorage.setItem(
      BANNER_SETTINGS_KEY,
      JSON.stringify({
        image: banner.uri,
        height: Math.round(BANNER_BAND_WIDTH / (banner.aspectRatio ?? DEFAULT_BANNER_ASPECT_RATIO)),
      })
    );
  } catch {
    toast.error('This image is too large to keep in the demo. Try a smaller one.');
  }
};

type VisualKey = 'avatar' | 'pageBanner' | 'cardBanner';

const CROP_CONFIG: Record<VisualKey, (ratio?: number) => ImageCropConfig> = {
  avatar: () => ({ aspectRatio: 1, maxWidth: 410, minWidth: 190 }),
  cardBanner: () => ({ aspectRatio: 416 / 256, maxWidth: 416, minWidth: 208 }),
  pageBanner: ratio => ({
    aspectRatio: ratio ?? DEFAULT_BANNER_ASPECT_RATIO,
    aspectRatioBounds: { min: MIN_BANNER_ASPECT_RATIO, max: MAX_BANNER_ASPECT_RATIO },
    maxWidth: 1536,
    minWidth: 1200,
  }),
};

type SpaceAboutTabProps = {
  level?: SpaceSettingsLevel;
  scope?: string;
  initial?: AboutState | (() => AboutState);
  /** Where this space's card links to in the preview. */
  href?: string;
};

/** About tab: production's view. Everything is staged, and saved together from the unsaved-changes bar. */
export function SpaceAboutTab({ level = 'L0', scope = 'space', initial = buildDemoAbout, href = '#' }: SpaceAboutTabProps) {
  const { t } = useTranslation('crd-spaceSettings');
  const form = useDemoForm<AboutState>(`${scope}:about`, initial, level === 'L0' ? persistPageBanner : undefined);
  const { about, classifications } = form.value;

  const [pendingCrop, setPendingCrop] = useState<{ key: VisualKey; file: File } | null>(null);
  const [recropKey, setRecropKey] = useState<VisualKey | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [conflict, setConflict] = useState<ClassificationPickerConflict | null>(null);
  const [cityRequested, setCityRequested] = useState(false);

  const patchAbout = (patch: Partial<AboutFormValues>) =>
    form.set(previous => ({ ...previous, about: { ...previous.about, ...patch } }));
  const patchEntry = (id: string, patch: Partial<ClassificationEntryData>) =>
    form.set(previous => ({
      ...previous,
      classifications: previous.classifications.map(entry => (entry.id === id ? { ...entry, ...patch } : entry)),
    }));

  const previewCard: SpaceCardPreview = {
    name: about.name,
    tagline: about.tagline,
    bannerUrl: about.cardBanner.uri,
    avatarUrl: about.avatar.uri,
    tags: about.tags,
    color: pickColorFromId(about.profileId),
    initials: getInitials(about.name),
    href,
    level,
    what: about.what,
  };

  const untitledReferenceIds = about.references
    .filter(reference => !reference.title.trim() && (reference.uri.trim() || reference.description.trim()))
    .map(reference => reference.id);

  const addClassification = (templateId: string, displayLabel: string) => {
    const template = PICKER_SOURCES.flatMap(source => source.templates).find(option => option.id === templateId);
    if (!template) return;
    if (classifications.some(entry => entry.displayLabel === displayLabel)) {
      setConflict({ templateId, attemptedLabel: displayLabel });
      return;
    }
    form.set(previous => ({
      ...previous,
      classifications: [
        ...previous.classifications,
        {
          id: `cls-${Date.now()}`,
          displayLabel,
          cardinality: template.cardinality,
          values: template.values,
          selectedValueIDs: [],
          display: true,
          sortOrder: previous.classifications.length,
        },
      ],
    }));
    setConflict(null);
    setPickerOpen(false);
  };

  const startRecrop = async (key: VisualKey) => {
    setRecropKey(null);
    const uri = about[key].uri;
    if (!uri) return;
    try {
      const blob = await (await fetch(uri)).blob();
      setPendingCrop({ key, file: new File([blob], `${key}.jpg`, { type: blob.type }) });
    } catch {
      toast.error('This image could not be opened for cropping. Upload it again instead.');
    }
  };

  useEffect(() => {
    if (!pickerOpen) setConflict(null);
  }, [pickerOpen]);

  return (
    <>
      <SpaceSettingsAboutView
        {...about}
        level={level}
        previewCard={previewCard}
        countries={COUNTRIES}
        cityOptions={cityRequested ? CITIES : undefined}
        onCityFocus={() => setCityRequested(true)}
        disabled={form.saving}
        onChange={patchAbout}
        onUploadAvatar={file => setPendingCrop({ key: 'avatar', file })}
        onUploadPageBanner={file => setPendingCrop({ key: 'pageBanner', file })}
        onUploadCardBanner={file => setPendingCrop({ key: 'cardBanner', file })}
        onRecropVisual={setRecropKey}
        onReferencesChange={rows =>
          patchAbout({
            references: rows.map(
              (row, index): AboutReference => ({
                id: row.id ?? `ref-new-${Date.now()}-${index}`,
                title: row.name,
                uri: row.uri,
                description: row.description ?? '',
              })
            ),
          })
        }
        onReferenceFileUpload={async file => URL.createObjectURL(file)}
        untitledReferenceIds={untitledReferenceIds}
        classifications={classifications}
        unsavedClassificationIds={classifications
          .filter(entry => !form.saved.classifications.some(savedEntry => savedEntry.id === entry.id))
          .map(entry => entry.id)}
        onAddClassification={() => setPickerOpen(true)}
        onSelectClassificationValues={(id, selectedValueIDs) => patchEntry(id, { selectedValueIDs })}
        onToggleClassificationDisplay={(id, display) => patchEntry(id, { display })}
        onRemoveClassification={id =>
          form.set(previous => ({
            ...previous,
            classifications: previous.classifications.filter(entry => entry.id !== id),
          }))
        }
        {...demoMarkdownUpload}
      />

      <TabSaveBar
        count={form.count}
        saving={form.saving}
        save={form.save}
        discard={form.discard}
        canSave={untitledReferenceIds.length === 0}
        saveBlockedReason={t('about.references.titleRequired')}
      />

      <ImageCropDialog
        open={pendingCrop !== null}
        file={pendingCrop?.file}
        config={pendingCrop ? CROP_CONFIG[pendingCrop.key](about.pageBanner.aspectRatio) : {}}
        onSave={async ({ file, altText, aspectRatio }) => {
          if (!pendingCrop) return;
          const uri = await fileToDataUrl(file);
          const current = about[pendingCrop.key];
          patchAbout({
            [pendingCrop.key]: { ...current, uri, altText, aspectRatio: aspectRatio ?? current.aspectRatio },
          });
          setPendingCrop(null);
        }}
        onCancel={() => setPendingCrop(null)}
        saveLabel={t('about.branding.cropDialog.save')}
        savingLabel={t('about.branding.cropDialog.saving')}
        cancelLabel={t('about.branding.cropDialog.cancel')}
        title={t('about.branding.cropDialog.title')}
        altTextLabel={t('about.branding.cropDialog.altText')}
        altTextPlaceholder={t('about.branding.cropDialog.altTextPlaceholder')}
        initialAltText={pendingCrop ? (about[pendingCrop.key].altText ?? undefined) : undefined}
      />

      <ConfirmationDialog
        open={recropKey !== null}
        onOpenChange={open => {
          if (!open) setRecropKey(null);
        }}
        variant="destructive"
        title={t('about.branding.recropConfirm.title')}
        description={t('about.branding.recropConfirm.description')}
        confirmLabel={t('about.branding.recropConfirm.confirm')}
        cancelLabel={t('about.branding.recropConfirm.cancel')}
        onConfirm={() => {
          if (recropKey) void startRecrop(recropKey);
        }}
        onCancel={() => setRecropKey(null)}
      />

      <ClassificationPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        sources={PICKER_SOURCES}
        onSelectTemplate={addClassification}
        conflict={conflict}
        onRetryWithLabel={addClassification}
        onDismissConflict={() => setConflict(null)}
        subspace={level !== 'L0'}
      />
    </>
  );
}
