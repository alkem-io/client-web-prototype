/**
 * FormResponsesDialog — the scan/compare view over collected form responses.
 *
 * The contribution grid answers "who responded?"; this answers "what did
 * everyone say to question 3?". One row per respondent, one column per question,
 * cells truncated with the full text revealed on row expand.
 *
 * It renders only what the caller passes in `responses` — the US3 visibility
 * rule is applied upstream by `useCalloutFormMock.visibleResponsesFor`, so this
 * component never has to reason about who is allowed to see what.
 */
import { useState } from 'react';
import { ChevronDown, ChevronRight, Lock, Users } from 'lucide-react';
import { cn } from '@/crd/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/crd/primitives/avatar';
import { Badge } from '@/crd/primitives/badge';
import { Button } from '@/crd/primitives/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/crd/primitives/dialog';
import {
  type CalloutFormData,
  type CalloutFormResponse,
  findAnswer,
  sortedQuestions
} from './calloutFormTypes';

type FormResponsesDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calloutTitle: string;
  form: CalloutFormData;
  /** Already filtered for the viewer. */
  responses: CalloutFormResponse[];
  /** Highlights the viewer's own rows. */
  currentUserId: string;
  /** True when the viewer is seeing a filtered subset rather than everything. */
  isRestricted?: boolean;
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function FormResponsesDialog({
  open,
  onOpenChange,
  calloutTitle,
  form,
  responses,
  currentUserId,
  isRestricted
}: FormResponsesDialogProps) {
  const questions = sortedQuestions(form);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl lg:max-w-5xl max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b text-left">
          <DialogTitle className="text-section-title">Responses</DialogTitle>
          <DialogDescription className="text-caption text-muted-foreground mt-1">
            {calloutTitle}
          </DialogDescription>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-badge">
              {responses.length} {responses.length === 1 ? 'response' : 'responses'}
            </Badge>
            <span className="inline-flex items-center gap-1.5 text-caption text-muted-foreground">
              {form.responseVisibility === 'admins' ? (
                <>
                  <Lock className="size-3.5" aria-hidden="true" />
                  Visible to administrators only
                </>
              ) : (
                <>
                  <Users className="size-3.5" aria-hidden="true" />
                  Visible to anyone with access to this space
                </>
              )}
            </span>
          </div>
          {isRestricted && (
            <p className="text-caption text-muted-foreground mt-2">
              You&apos;re seeing your own response. Other responses are visible to space
              administrators only.
            </p>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {responses.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-body text-muted-foreground">No responses yet.</p>
              <p className="text-caption text-muted-foreground mt-1">
                Responses will appear here as people submit them.
              </p>
            </div>
          ) : (
            // Wide tables scroll inside their own container so the dialog body
            // never scrolls horizontally.
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-muted/50 backdrop-blur-sm">
                  <tr>
                    <th className="text-left text-label uppercase text-muted-foreground px-6 py-3 min-w-56">
                      Respondent
                    </th>
                    {questions.map((question, index) => (
                      <th
                        key={question.id}
                        className="text-left text-label uppercase text-muted-foreground px-4 py-3 min-w-48"
                      >
                        <span className="line-clamp-2 normal-case text-caption font-semibold">
                          {index + 1}. {question.question}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {responses.map(response => {
                    const isExpanded = expandedId === response.id;
                    const isOwn = response.author.id === currentUserId;
                    return (
                      <tr
                        key={response.id}
                        className={cn(
                          'border-t border-border align-top cursor-pointer hover:bg-muted/40 transition-colors',
                          isOwn && 'bg-primary/5'
                        )}
                        onClick={() => setExpandedId(isExpanded ? null : response.id)}
                      >
                        <td className="px-6 py-3">
                          <div className="flex items-start gap-2">
                            {isExpanded ? (
                              <ChevronDown
                                className="size-4 mt-0.5 text-muted-foreground shrink-0"
                                aria-hidden="true"
                              />
                            ) : (
                              <ChevronRight
                                className="size-4 mt-0.5 text-muted-foreground shrink-0"
                                aria-hidden="true"
                              />
                            )}
                            <Avatar className="w-6 h-6 shrink-0">
                              {response.author.avatarUrl && (
                                <AvatarImage
                                  src={response.author.avatarUrl}
                                  alt={response.author.name}
                                />
                              )}
                              <AvatarFallback className="text-badge">
                                {response.author.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-body-emphasis truncate">
                                {response.author.name}
                              </p>
                              <p className="text-caption text-muted-foreground">
                                {formatDate(response.submittedAt)}
                              </p>
                              {isOwn && (
                                <Badge variant="secondary" className="text-badge mt-1">
                                  You
                                </Badge>
                              )}
                            </div>
                          </div>
                        </td>
                        {questions.map(question => {
                          const answer = findAnswer(response, question.id);
                          return (
                            <td key={question.id} className="px-4 py-3">
                              <p
                                className={cn(
                                  'text-body whitespace-pre-wrap break-words',
                                  !isExpanded && 'line-clamp-3',
                                  !answer && 'text-muted-foreground italic'
                                )}
                              >
                                {answer || 'No answer'}
                              </p>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/20">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
