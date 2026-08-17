/**
 * FormRespondDialog — the answering surface for the `form` contribution type.
 *
 * Two modes off one layout so the questions a respondent answered and the
 * questions they read back can never drift apart:
 *  - `respond` — an input per answer type (line, paragraph, choice list)
 *  - `view`    — the same questions with the submitted answers rendered read-only
 *
 * One renderer per `answerType`, dispatched off `ANSWER_TYPE_DESCRIPTORS`. No
 * question is mandatory and no answer is length-capped, so there is nothing to
 * validate — Submit is always live and a blank answer is a legitimate reply.
 */
import { useEffect, useMemo, useState } from 'react';
import { ClipboardList, Lock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Textarea } from '@/app/components/ui/textarea';
import {
  type CalloutFormAnswer,
  type CalloutFormData,
  type CalloutFormResponse,
  findAnswer,
  sortedQuestions,
} from './calloutFormTypes';

type FormRespondDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Callout title — shown as the dialog heading so the form has context. */
  calloutTitle: string;
  form: CalloutFormData;
  mode: 'respond' | 'view';
  /** The response being read back. Required in `view` mode. */
  response?: CalloutFormResponse;
  onSubmit?: (answers: CalloutFormAnswer[]) => void;
};

export function FormRespondDialog({
  open,
  onOpenChange,
  calloutTitle,
  form,
  mode,
  response,
  onSubmit,
}: FormRespondDialogProps) {
  const questions = useMemo(() => sortedQuestions(form), [form]);
  const [values, setValues] = useState<Record<string, string>>({});

  // Reset whenever the dialog opens so a cancelled draft never leaks into the
  // next form, and so `view` mode always reflects the response it was given.
  useEffect(() => {
    if (!open) return;
    if (mode === 'view' && response) {
      setValues(
        Object.fromEntries(questions.map(q => [q.id, findAnswer(response, q.id)]))
      );
    } else {
      setValues({});
    }
  }, [open, mode, response, questions]);

  const isView = mode === 'view';

  const handleSubmit = () => {
    const answers: CalloutFormAnswer[] = questions.map(q => ({
      questionId: q.id,
      value: (values[q.id] ?? '').trim(),
    }));
    onSubmit?.(answers);
    toast.success('Response submitted', {
      description:
        form.responseVisibility === 'admins'
          ? 'Only space administrators can see your answers.'
          : 'Anyone with access to this space can see your answers.',
    });
    onOpenChange(false);
  };

  const submittedOn =
    isView && response
      ? new Date(response.submittedAt).toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b text-left">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
              <ClipboardList className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-section-title">{calloutTitle}</DialogTitle>
              <DialogDescription className="text-caption text-muted-foreground mt-1">
                {isView
                  ? `Your response${submittedOn ? ` · submitted ${submittedOn}` : ''}`
                  : `${questions.length} ${questions.length === 1 ? 'question' : 'questions'}`}
              </DialogDescription>
            </div>
          </div>

          {/* Tell respondents who will read this before they write it. */}
          {!isView && (
            <div className="mt-3 flex items-center gap-2 text-caption text-muted-foreground">
              {form.responseVisibility === 'admins' ? (
                <>
                  <Lock className="size-3.5" aria-hidden="true" />
                  Only space administrators can see your response
                </>
              ) : (
                <>
                  <Users className="size-3.5" aria-hidden="true" />
                  Anyone with access to this space can see your response
                </>
              )}
            </div>
          )}
        </DialogHeader>

        <div className="px-6 py-5 flex flex-col gap-5 overflow-y-auto">
          {questions.map((question, index) => {
            const value = values[question.id] ?? '';
            const setValue = (next: string) =>
              setValues(prev => ({ ...prev, [question.id]: next }));

            return (
              <div
                key={question.id}
                className="rounded-xl border bg-muted/30 p-4 flex flex-col gap-3"
              >
                <div>
                  <label htmlFor={question.id} className="text-body-emphasis">
                    <span className="text-muted-foreground mr-1.5">{index + 1}.</span>
                    {question.question}
                  </label>
                  {question.explanation && (
                    <p className="text-caption text-muted-foreground mt-1">
                      {question.explanation}
                    </p>
                  )}
                </div>

                {isView ? (
                  <p className="text-body whitespace-pre-wrap break-words">
                    {value || (
                      <span className="text-muted-foreground italic">No answer given</span>
                    )}
                  </p>
                ) : question.answerType === 'choice' ? (
                  <RadioGroup
                    value={value}
                    onValueChange={setValue}
                    className="gap-2"
                    aria-label={question.question}
                  >
                    {(question.options ?? []).map(option => (
                      <Label
                        key={option.id}
                        htmlFor={`${question.id}-${option.id}`}
                        className={cn(
                          'flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors font-normal',
                          value === option.label
                            ? 'border-primary bg-primary/5'
                            : 'border-border bg-background hover:bg-muted/50'
                        )}
                      >
                        <RadioGroupItem
                          id={`${question.id}-${option.id}`}
                          value={option.label}
                        />
                        <span className="text-body">{option.label}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                ) : question.answerType === 'long' ? (
                  <Textarea
                    id={question.id}
                    value={value}
                    onChange={event => setValue(event.target.value)}
                    placeholder="Type your answer…"
                    className="bg-background min-h-24"
                  />
                ) : (
                  <Input
                    id={question.id}
                    value={value}
                    onChange={event => setValue(event.target.value)}
                    placeholder="Type your answer…"
                    className="bg-background"
                  />
                )}
              </div>
            );
          })}

          {questions.length === 0 && (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <p className="text-body text-muted-foreground">
                This form doesn&apos;t have any questions yet.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/20">
          {isView ? (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={handleSubmit} disabled={questions.length === 0}>
                Submit Form
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
