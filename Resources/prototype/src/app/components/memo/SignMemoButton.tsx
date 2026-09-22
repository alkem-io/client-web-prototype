/**
 * SignMemoButton — the entry point, in both of its states.
 *
 * The rule it implements: when signing is switched on for a space, the button
 * is *always* there. Hiding it from people without a linked Cleverbase account
 * is how a feature stays invisible to exactly the people who have not set it up
 * yet — they never learn it exists, so they never link an account.
 *
 * Two notes on the unavailable state:
 *
 * - The button is `aria-disabled`, not `disabled`. A truly disabled button is
 *   removed from the tab order and swallows pointer events, so the explanation
 *   attached to it can be reached by neither keyboard nor (reliably) mouse —
 *   the explanation is the entire point here, so the button stays focusable and
 *   refuses the action itself.
 * - The explanation is a hover card rather than a tooltip because it has to
 *   carry a link to the documentation, and a tooltip's contents cannot be
 *   clicked. Hover cards open on hover and on focus; `open` is controlled as
 *   well so a tap works on touch, where Radix would otherwise never open it.
 */
import { useState } from "react";
import { ArrowUpRight, Signature } from "lucide-react";
import { Button, type ButtonProps } from "@/crd/primitives/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/app/components/ui/hover-card";
import { cn } from "@/crd/lib/utils";
import { CLEVERBASE_DOCS_URL } from "./signingData";

interface SignMemoButtonProps extends Omit<ButtonProps, "onClick"> {
  /** Whether this user has a Cleverbase account linked to their Alkemio account. */
  linked: boolean;
  onSign: () => void;
  label?: string;
  showIcon?: boolean;
}

export function SignMemoButton({
  linked,
  onSign,
  label = "Sign memo",
  showIcon = true,
  variant = "default",
  size,
  className,
  ...props
}: SignMemoButtonProps) {
  const [explaining, setExplaining] = useState(false);

  if (linked) {
    return (
      <Button
        variant={variant}
        size={size}
        className={cn("gap-2", className)}
        onClick={onSign}
        {...props}
      >
        {showIcon && <Signature className="size-4" />}
        {label}
      </Button>
    );
  }

  return (
    <HoverCard open={explaining} onOpenChange={setExplaining} openDelay={150}>
      <HoverCardTrigger asChild>
        <Button
          variant={variant}
          size={size}
          aria-disabled="true"
          className={cn("gap-2 opacity-50", className)}
          onClick={event => {
            // aria-disabled means we refuse the action ourselves.
            event.preventDefault();
            setExplaining(true);
          }}
          {...props}
        >
          {showIcon && <Signature className="size-4" />}
          {label}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent align="end" className="w-[320px] p-4">
        <p className="text-body-emphasis">You need a Cleverbase account first</p>
        <p className="mt-1.5 text-caption text-muted-foreground">
          Signing uses Cleverbase to confirm who you are. Create an account there, link it to
          your Alkemio account, and this button turns on.
        </p>
        <a
          href={CLEVERBASE_DOCS_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-caption font-medium text-primary hover:underline"
        >
          How to set that up
          <ArrowUpRight className="size-3.5" />
        </a>
      </HoverCardContent>
    </HoverCard>
  );
}
