/**
 * Form contributions — the question set read-only, plus the responses the
 * viewer is allowed to see.
 *
 * PROTOTYPE-ONLY. Production has no form callout type, so there is no CRD
 * component and no framing slot for this. It renders through CRD's
 * `contributionsSlot` because that is what it is: the questions are the schema
 * for what contributors submit, and the responses are the contributions.
 *
 * Extracted from `PostDetailDialog` during the CRD conversion so the dialog
 * could become a thin wrapper. The markup is unchanged.
 *
 * Answering happens through `FormRespondDialog` from the feed; this view is for
 * reading what the form asks.
 */
import { Lock, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/crd/primitives/avatar';
import {
  ANSWER_TYPE_DESCRIPTORS,
  type CalloutFormData,
  findAnswer,
  responsesAreRestricted,
  sortedQuestions,
  visibleResponses,
} from '@/app/components/callout/calloutFormTypes';

type CalloutFormFramingProps = {
  form: CalloutFormData;
  viewer?: { userId: string; isAdmin: boolean };
  onOpenResponse?: (responseId: string) => void;
};

export function CalloutFormFraming({ form, viewer, onOpenResponse }: CalloutFormFramingProps) {
  const questions = sortedQuestions(form);
  const viewerId = viewer?.userId ?? '';
  const visible = visibleResponses(form, viewerId, viewer?.isAdmin ?? false);
  const restricted = responsesAreRestricted(form, viewer?.isAdmin ?? false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-label uppercase text-muted-foreground">Questions ({questions.length})</span>
        <span className="inline-flex items-center gap-1.5 text-caption text-muted-foreground">
          {form.responseVisibility === 'admins' ? (
            <>
              <Lock className="h-3 w-3" aria-hidden="true" /> Responses visible to admins only
            </>
          ) : (
            <>
              <Users className="h-3 w-3" aria-hidden="true" /> Responses visible to space members
            </>
          )}
        </span>
      </div>

      <div className="space-y-3">
        {questions.map((question, index) => (
          <div key={question.id} className="rounded-xl border bg-muted/30 p-4">
            <p className="text-body-emphasis">
              <span className="mr-1.5 text-muted-foreground">{index + 1}.</span>
              {question.question}
            </p>
            {question.explanation && (
              <p className="mt-1 text-caption text-muted-foreground">{question.explanation}</p>
            )}
            <p className="mt-2 text-caption text-muted-foreground">
              {ANSWER_TYPE_DESCRIPTORS[question.answerType].label}
              {question.answerType === 'choice' && question.options
                ? ` · ${question.options.length} options`
                : ''}
            </p>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <p className="text-label uppercase text-muted-foreground">
          {restricted ? `Your response (${visible.length})` : `Responses (${visible.length})`}
        </p>
        {visible.length === 0 ? (
          <p className="mt-2 text-body text-muted-foreground">No responses yet.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {visible.map(response => (
              <div
                key={response.id}
                className="cursor-pointer space-y-3 rounded-lg border p-4 transition-colors hover:bg-muted/30"
                onClick={() => onOpenResponse?.(response.id)}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    {response.author.avatarUrl && (
                      <AvatarImage src={response.author.avatarUrl} alt={response.author.name} />
                    )}
                    <AvatarFallback className="text-badge">{response.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-body-emphasis">{response.author.name}</span>
                  <span className="text-caption text-muted-foreground">
                    {new Date(response.submittedAt).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                {questions.map(question => {
                  const answer = findAnswer(response, question.id);
                  if (!answer) return null;
                  return (
                    <div key={question.id}>
                      <p className="text-caption text-muted-foreground">{question.question}</p>
                      <p className="text-body break-words whitespace-pre-wrap">{answer}</p>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
