/**
 * FormSettingsDialog — settings for a form callout.
 *
 * Follows the Poll Settings pattern: a gear opens a compact modal of grouped
 * label-left / control-right rows, and changes apply immediately — there is no
 * Cancel/Save pair, so the modal is a panel rather than a transaction.
 *
 * Serves two contexts off one component:
 *  - authoring (from the Form panel in Create Post), where no responses exist yet
 *  - a live callout (from the gear in the card header), where they may
 *
 * The one departure from live-apply is loosening visibility on a form that
 * already has responses: those were written under an admins-only promise, so
 * that single transition asks first. Everything else toggles straight through.
 */
import { useEffect, useState } from 'react';
import { TriangleAlert } from 'lucide-react';
import { Button } from '@/crd/primitives/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/crd/primitives/dialog';
import { Label } from '@/crd/primitives/label';
import { Separator } from '@/crd/primitives/separator';
import { Switch } from '@/crd/primitives/switch';
import type { CalloutFormData, CalloutFormResponseVisibility } from './calloutFormTypes';

type FormSettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: CalloutFormData;
  onChange: (settings: {
    responseVisibility: CalloutFormResponseVisibility;
    allowMultipleResponses: boolean;
  }) => void;
};

export function FormSettingsDialog({ open, onOpenChange, form, onChange }: FormSettingsDialogProps) {
  // Pending confirmation for the one transition that exposes existing answers.
  const [confirmReveal, setConfirmReveal] = useState(false);

  useEffect(() => {
    if (!open) setConfirmReveal(false);
  }, [open]);

  const adminsOnly = form.responseVisibility === 'admins';
  const responseCount = form.responses.length;

  const apply = (patch: Partial<Pick<CalloutFormData, 'responseVisibility' | 'allowMultipleResponses'>>) => {
    onChange({
      responseVisibility: patch.responseVisibility ?? form.responseVisibility,
      allowMultipleResponses: patch.allowMultipleResponses ?? form.allowMultipleResponses
    });
  };

  const handleVisibilityToggle = (nextAdminsOnly: boolean) => {
    // Tightening is always safe. Loosening is only consequential once answers
    // exist — before that it's just a setting.
    if (!nextAdminsOnly && responseCount > 0) {
      setConfirmReveal(true);
      return;
    }
    apply({ responseVisibility: nextAdminsOnly ? 'admins' : 'spaceMembers' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* DialogContent renders its own close X at top-4 right-4 — don't add a second. */}
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <DialogTitle className="text-section-title">Form Settings</DialogTitle>
        </div>
        <DialogDescription className="sr-only">
          Control how responses are collected and who can read them.
        </DialogDescription>

        <Separator />

        <div className="px-6 py-5 flex flex-col gap-4">
          <p className="text-body-emphasis">Response Options</p>

          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="form-allow-multiple" className="text-body font-normal">
              Allow multiple responses
            </Label>
            <Switch
              id="form-allow-multiple"
              checked={form.allowMultipleResponses}
              onCheckedChange={checked => apply({ allowMultipleResponses: checked })}
            />
          </div>
        </div>

        <Separator />

        <div className="px-6 py-5 flex flex-col gap-4">
          <p className="text-body-emphasis">Visibility Options</p>

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Label htmlFor="form-admins-only" className="text-body font-normal">
                Only administrators can see responses
              </Label>
              {/* Higher stakes than the other rows, so the off-state is spelled
                  out rather than left to inference. */}
              <p className="text-caption text-muted-foreground mt-1">
                {adminsOnly
                  ? 'Turn off to let anyone with access to this space read them.'
                  : 'Anyone with access to this space can read every response.'}
              </p>
            </div>
            <Switch
              id="form-admins-only"
              checked={adminsOnly}
              onCheckedChange={handleVisibilityToggle}
            />
          </div>

          {confirmReveal && (
            <div className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-3">
              <TriangleAlert className="size-4 text-destructive mt-0.5 shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-body-emphasis text-destructive">
                  Reveal {responseCount} existing {responseCount === 1 ? 'response' : 'responses'}?
                </p>
                <p className="text-caption text-muted-foreground mt-1">
                  {responseCount === 1 ? 'It was' : 'They were'} submitted when only administrators
                  could read {responseCount === 1 ? 'it' : 'them'}.
                </p>
                <div className="flex justify-end gap-2 mt-3">
                  <Button variant="ghost" size="sm" onClick={() => setConfirmReveal(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      apply({ responseVisibility: 'spaceMembers' });
                      setConfirmReveal(false);
                    }}
                  >
                    Reveal
                  </Button>
                </div>
              </div>
            </div>
          )}

          <p className="text-caption text-muted-foreground">
            People can always see their own response.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
