/**
 * calloutFormTypes — the data model for the `form` contribution type.
 *
 * A form is a *response type*, not a framing: the callout keeps its own head
 * content (text, whiteboard, …) and the question list defines the shape of what
 * contributors submit — the structured sibling of the free-form post, memo and
 * whiteboard contribution types.
 *
 * Deliberately parallel to the subspace-application form model exported from
 * `@/app/components/dialogs/SubspaceApplicationDialog` (`FormField`,
 * `FormFieldType`, `FormFieldConstraints`). That model serves a multi-step
 * application wizard with people-pickers and profile auto-fill; this one serves
 * a flat, ordered question list attached to a callout. The `CalloutForm*` prefix
 * keeps the two from colliding at import sites.
 *
 * Field names mirror Alkemio's generic Form + form-question model
 * (`question` / `explanation` / `sortOrder`) so the production implementation
 * can map across without a rename pass. `answerType` and `options` extend it —
 * today's model is free-text-only.
 */
import { AlignLeft, CircleDot, TextCursorInput, type LucideIcon } from 'lucide-react';

/**
 * Who can read the collected responses.
 *  - `admins`       — space administrators only (the default per epic #2005)
 *  - `spaceMembers` — anyone with read access to the space
 *
 * In both modes a contributor can always see their own response(s).
 */
export type CalloutFormResponseVisibility = 'admins' | 'spaceMembers';

/**
 * How a question is answered.
 *  - `short`  — one line of text
 *  - `long`   — multi-line text
 *  - `choice` — pick one of the author's options
 */
export type CalloutFormAnswerType = 'short' | 'long' | 'choice';

export interface CalloutFormChoiceOption {
  id: string;
  label: string;
}

export interface CalloutFormQuestion {
  id: string;
  /** The question itself — rendered as the field label. */
  question: string;
  /** Optional helper text rendered under the label. */
  explanation?: string;
  /** Ascending display order. Duplicates are resolved by array position. */
  sortOrder: number;
  answerType: CalloutFormAnswerType;
  /** The pickable options. `choice` questions only; ignored otherwise. */
  options?: CalloutFormChoiceOption[];
}

/**
 * Single source of truth for the icon, label and helper text per answer type —
 * the same idiom `POST_TYPE_DESCRIPTORS` uses for framings. The typed Record
 * forces every `CalloutFormAnswerType` to be covered, so adding a type can't
 * silently fall through to a default renderer.
 */
export const ANSWER_TYPE_DESCRIPTORS: Record<
  CalloutFormAnswerType,
  { icon: LucideIcon; label: string; description: string }
> = {
  short: {
    icon: TextCursorInput,
    label: 'Short answer',
    description: 'A single line — a name, a place, a number',
  },
  long: {
    icon: AlignLeft,
    label: 'Paragraph',
    description: 'Multiple lines for a fuller reply',
  },
  choice: {
    icon: CircleDot,
    label: 'Multiple choice',
    description: 'Pick one of the options you provide',
  },
};

/** Ordered for the type picker — cheapest answer first. */
export const ANSWER_TYPE_ORDER: CalloutFormAnswerType[] = ['short', 'long', 'choice'];

export interface CalloutFormAnswer {
  questionId: string;
  value: string;
}

export interface CalloutFormResponse {
  id: string;
  author: { id: string; name: string; avatarUrl?: string };
  /** ISO-8601. Formatted for display at the render site. */
  submittedAt: string;
  answers: CalloutFormAnswer[];
}

/** Contribution-level payload for `PostCardData.contributionForm`. */
export interface CalloutFormData {
  questions: CalloutFormQuestion[];
  /** Defaults to `'admins'` per the epic's resolved scope decision. */
  responseVisibility: CalloutFormResponseVisibility;
  /** Per-form setting deciding single vs. multiple responses per contributor. */
  allowMultipleResponses: boolean;
  responses: CalloutFormResponse[];
}

/** Questions in display order. Never mutates the source array. */
export function sortedQuestions(form: CalloutFormData): CalloutFormQuestion[] {
  return [...form.questions].sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Counts of each answer type present, for summarising a form at a glance. */
export function answerTypeBreakdown(form: CalloutFormData): Array<{
  type: CalloutFormAnswerType;
  count: number;
}> {
  return ANSWER_TYPE_ORDER.map(type => ({
    type,
    count: form.questions.filter(q => q.answerType === type).length,
  })).filter(entry => entry.count > 0);
}

/** Every response authored by `userId`, oldest first. */
export function ownResponses(form: CalloutFormData, userId: string): CalloutFormResponse[] {
  return form.responses.filter(r => r.author.id === userId);
}

/**
 * The responses a given viewer is allowed to see, applying the visibility rule.
 * Own responses are always included — that invariant holds in both modes, so it
 * lives here rather than at each call site.
 */
export function visibleResponses(
  form: CalloutFormData,
  userId: string,
  isAdmin: boolean
): CalloutFormResponse[] {
  if (isAdmin || form.responseVisibility === 'spaceMembers') return form.responses;
  return ownResponses(form, userId);
}

/** True when the viewer is being shown a filtered subset rather than everything. */
export function responsesAreRestricted(form: CalloutFormData, isAdmin: boolean): boolean {
  return !isAdmin && form.responseVisibility === 'admins';
}

/** Whether this viewer may submit (another) response. */
export function canSubmitResponse(
  form: CalloutFormData,
  userId: string,
  canContribute: boolean
): boolean {
  if (!canContribute) return false;
  return form.allowMultipleResponses || ownResponses(form, userId).length === 0;
}

export function findAnswer(response: CalloutFormResponse, questionId: string): string {
  return response.answers.find(a => a.questionId === questionId)?.value ?? '';
}
