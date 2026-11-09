import { ArrowUpRight, BadgeCheck, Signature } from "lucide-react";
import { toast } from "sonner";
import { setCleverbaseLinked, useMemoSigning } from "@/app/components/memo/memoSigningStore";
import { CLEVERBASE_DOCS_URL } from "@/app/components/memo/signingData";
import { SettingsSection } from "@/crd/components/common/SettingsSection";
import { Button } from "@/crd/primitives/button";

/**
 * DigitalSigningSettingsSection — link the signing identity memos are signed with.
 *
 * WHAT PRODUCTION WOULD GAIN
 * Memo signing (spec 013) needs a Cleverbase account. This is where "you need a
 * Cleverbase account" resolves: linking here is what makes the Sign memo button
 * work on every memo, so a signature can be verified outside Alkemio. Production
 * has no memo signing and no such section.
 *
 * WHAT PRODUCTION NEEDS TO ADD
 * `UserSecurityTabView` has four fixed slots and none for an extra section, so
 * the prototype renders this next to it. The upstream ask: a slot on that view,
 * or production owning this section alongside memo signing.
 */
export function DigitalSigningSettingsSection() {
  const { cleverbaseLinked } = useMemoSigning();

  return (
    <SettingsSection
      title="Digital signing"
      description="Sign memos with a signature that can be verified outside Alkemio."
      icon={<Signature className="size-4" />}
      iconColor="green"
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/20 p-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
              <BadgeCheck className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-body-emphasis truncate">Cleverbase</p>
              <p className="text-caption text-muted-foreground">
                {cleverbaseLinked
                  ? "Linked — you can sign memos in any space where signing is on."
                  : "Not linked — Sign memo stays visible but can't be used yet."}
              </p>
            </div>
          </div>
          <Button
            variant={cleverbaseLinked ? "outline" : "default"}
            size="sm"
            className="shrink-0"
            onClick={() => {
              setCleverbaseLinked(!cleverbaseLinked);
              toast.success(
                cleverbaseLinked ? "Cleverbase account unlinked" : "Cleverbase account linked — you can sign memos now"
              );
            }}
          >
            {cleverbaseLinked ? "Unlink" : "Link account"}
          </Button>
        </div>
        <a
          href={CLEVERBASE_DOCS_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-caption font-medium text-primary hover:underline"
        >
          How signing works
          <ArrowUpRight className="size-3.5" />
        </a>
      </div>
    </SettingsSection>
  );
}
