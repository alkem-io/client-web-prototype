/**
 * PostFormBox — a form added to a post, drawn entirely with production's
 * components. This file only holds the demo state a real connector would get
 * from the server: the responses, which of them are yours, and the dialogs.
 *
 * In production a form is a *framing* — something added to the post, chosen in
 * "Add to post" — so it renders in `PostCard`'s framing slot (`children`), not
 * as a contributions list. The prototype used to model it as a response type;
 * that was retired on 2026-10-13 in favour of production's design.
 *
 *   CalloutFormBox              the bordered box: title, question count, state, "View responses"
 *   CalloutFormFillIn           the questions, answerable when the form is open
 *   CalloutFormOwnResponses     what you have already sent, with withdraw
 *   CalloutFormResponsesTable   every response, for whoever may read them all
 *   CalloutFormResponseDialog   one response, opened from the table
 */
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MOCK_CURRENT_USER } from '@/app/components/mediaGallery/useMediaGalleryMockUpload';
import { CalloutFormBox } from '@/crd/components/callout/CalloutFormBox';
import { CalloutFormFillIn } from '@/crd/components/callout/CalloutFormFillIn';
import { CalloutFormOwnResponses } from '@/crd/components/callout/CalloutFormOwnResponses';
import { CalloutFormResponseDialog } from '@/crd/components/callout/CalloutFormResponseDialog';
import { CalloutFormResponsesTable } from '@/crd/components/callout/CalloutFormResponsesTable';
import { deriveFormColumns } from '@/crd/components/callout/calloutFormColumns';
import type {
  FormAnswerInput,
  FormAnswerView,
  FormQuestionView,
  FormResponseView,
} from '@/crd/components/callout/calloutFormTypes';
import { isChoiceKind } from '@/crd/forms/callout/formValues';
import type { FormSettingsValue } from '@/crd/forms/callout/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/crd/primitives/dialog';

/** A form attached to a post, in production's shape. */
export type PostFormData = {
  title?: string;
  description?: string;
  questions: FormQuestionView[];
  settings: FormSettingsValue;
  /** False while the post is a draft. */
  published?: boolean;
  /** Every response, yours included — the viewer's own are those whose respondent id is the demo user's. */
  responses: FormResponseView[];
};

type PostFormBoxProps = {
  form: PostFormData;
  spaceName?: string;
  /** Space admin: may read every response regardless of visibility, and delete them. */
  isAdmin?: boolean;
  /** Contribute privilege in the space. */
  canContribute?: boolean;
};

const toAnswerView = (questions: FormQuestionView[], input: FormAnswerInput): FormAnswerView => {
  const question = questions.find(q => q.id === input.questionID);
  const type = question?.type ?? 'SHORT_TEXT';
  return {
    questionID: input.questionID,
    prompt: question?.prompt ?? '',
    type,
    text: isChoiceKind(type) ? undefined : input.text,
    selectedLabels: isChoiceKind(type)
      ? (input.selectedOptionIDs ?? []).map(id => question?.options.find(o => o.id === id)?.label ?? id)
      : [],
  };
};

export function PostFormBox({
  form,
  spaceName = 'this space',
  isAdmin = true,
  canContribute = true,
}: PostFormBoxProps) {
  const { t } = useTranslation('crd-space');
  const [responses, setResponses] = useState<FormResponseView[]>(form.responses);
  const [tableOpen, setTableOpen] = useState(false);
  const [openResponseId, setOpenResponseId] = useState<string | null>(null);

  const { settings, questions } = form;
  const published = form.published !== false;
  const isOpen = settings.state === 'OPEN';
  const status = !published ? 'DRAFT' : !isOpen ? 'CLOSED' : undefined;

  const own = responses.filter(r => r.respondent?.id === MOCK_CURRENT_USER.id);
  const canReadAll = isAdmin || settings.visibility === 'MEMBERS';
  // Single-response mode: once you have answered, the fill-in gives way to your answer.
  const showFillIn = settings.responseMode === 'MULTIPLE' || own.length === 0;
  const canSubmit = canContribute && published && isOpen;

  const columns = useMemo(() => deriveFormColumns(questions, responses), [questions, responses]);
  const openResponse = responses.find(r => r.id === openResponseId) ?? null;

  const submit = (answers: FormAnswerInput[]) => {
    setResponses(prev => [
      ...prev,
      {
        id: `form-response-${Date.now()}`,
        createdDate: new Date(),
        respondent: { id: MOCK_CURRENT_USER.id, name: MOCK_CURRENT_USER.name },
        answers: answers.map(answer => toAnswerView(questions, answer)),
      },
    ]);
  };
  const remove = (responseId: string) => setResponses(prev => prev.filter(r => r.id !== responseId));

  return (
    <>
      <CalloutFormBox
        title={form.title}
        description={form.description}
        questionCount={questions.length}
        status={status}
        defaultCollapsed={settings.defaultCollapsed}
        onViewResponses={canReadAll ? () => setTableOpen(true) : undefined}
        responseCount={responses.length}
      >
        {own.length > 0 && (
          <CalloutFormOwnResponses
            responses={own.map((r, i) => ({ ...r, number: i + 1 }))}
            questions={questions}
            onWithdraw={remove}
            status={showFillIn ? undefined : status}
          />
        )}
        {showFillIn && (
          <CalloutFormFillIn
            questions={questions}
            visibility={settings.visibility}
            spaceName={spaceName}
            state={settings.state}
            published={published}
            canSubmit={canSubmit}
            submitting={false}
            onSubmit={submit}
          />
        )}
      </CalloutFormBox>

      {/* Production has no wrapper dialog for the table in its design system; this is the plain one. */}
      <Dialog open={tableOpen} onOpenChange={setTableOpen}>
        <DialogContent className="sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>{form.title?.trim() || t('formResponses.dialogTitle')}</DialogTitle>
          </DialogHeader>
          <CalloutFormResponsesTable
            columns={columns}
            responses={responses}
            total={responses.length}
            hasMore={false}
            loadingMore={false}
            onLoadMore={() => {}}
            canModerate={isAdmin}
            onDelete={remove}
            onOpen={setOpenResponseId}
            deletedUserLabel={t('formResponses.deletedUser')}
          />
        </DialogContent>
      </Dialog>

      <CalloutFormResponseDialog
        open={openResponse !== null}
        onOpenChange={open => !open && setOpenResponseId(null)}
        response={openResponse}
        formTitle={form.title?.trim() || t('formResponses.dialogTitle')}
        columns={columns}
        canModerate={isAdmin}
        onDelete={id => {
          remove(id);
          setOpenResponseId(null);
        }}
        deletedUserLabel={t('formResponses.deletedUser')}
      />
    </>
  );
}
