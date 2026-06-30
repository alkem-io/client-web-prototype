import * as React from "react";
import { Button, type ButtonProps } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./tooltip";

export interface IconButtonProps extends ButtonProps {
  /** Tooltip label to show on hover/focus */
  tooltipLabel: string;
  /** Tooltip side position */
  tooltipSide?: "top" | "right" | "bottom" | "left";
}

/**
 * Icon button with automatic tooltip.
 * Use this for all icon-only buttons that need tooltips.
 *
 * @example
 * <IconButton
 *   variant="ghost"
 *   size="icon"
 *   tooltipLabel="Settings"
 *   onClick={handleSettings}
 * >
 *   <Settings className="w-5 h-5" />
 * </IconButton>
 */
const IconButton = React.forwardRef<
  HTMLButtonElement,
  IconButtonProps
>(
  (
    {
      tooltipLabel,
      tooltipSide = "top",
      children,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            ref={ref}
            size="icon"
            aria-label={ariaLabel || tooltipLabel}
            {...props}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side={tooltipSide}>{tooltipLabel}</TooltipContent>
      </Tooltip>
    );
  }
);

IconButton.displayName = "IconButton";

export { IconButton };
