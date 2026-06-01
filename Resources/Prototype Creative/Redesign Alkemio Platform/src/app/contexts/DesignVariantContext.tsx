import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

export type DesignVariant = "A" | "B" | "C" | "D" | "E";

export interface VariantOption {
  id: DesignVariant;
  label: string;
  description: string;
}

export const DESIGN_VARIANTS: VariantOption[] = [
  { id: "A", label: "Variant A", description: "Side panel overlay — Space chat overlays content (Figma-style)" },
  { id: "B", label: "Variant B", description: "Persistent resizable drawer — Space chat docks beside content (Slack-style)" },
  { id: "C", label: "Variant C", description: "Full tab within Space — Space chat as a dedicated CHAT tab in Space navigation" },
  { id: "D", label: "Variant D", description: "Floating collapsible widget — Space chat as a persistent bubble (Intercom-style)" },
  { id: "E", label: "Variant E", description: "Space Channel only — dedicated CHAT tab per Space, no Hub, no DMs, no Group Chats (standalone)" },
];

interface DesignVariantContextType {
  variant: DesignVariant;
  setVariant: (v: DesignVariant) => void;
  variants: VariantOption[];
  currentVariant: VariantOption;
}

const DesignVariantContext = createContext<DesignVariantContextType | undefined>(undefined);

export function DesignVariantProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariantState] = useState<DesignVariant>(() => {
    try {
      const stored = localStorage.getItem("alkemio-design-variant");
      if (stored && ["A", "B", "C", "D", "E"].includes(stored)) {
        return stored as DesignVariant;
      }
    } catch {}
    return "A";
  });

  const setVariant = useCallback((v: DesignVariant) => {
    setVariantState(v);
    try {
      localStorage.setItem("alkemio-design-variant", v);
    } catch {}
  }, []);

  const currentVariant = useMemo(
    () => DESIGN_VARIANTS.find((o) => o.id === variant) ?? DESIGN_VARIANTS[0],
    [variant]
  );

  const value = useMemo(
    () => ({ variant, setVariant, variants: DESIGN_VARIANTS, currentVariant }),
    [variant, setVariant, currentVariant]
  );

  return (
    <DesignVariantContext.Provider value={value}>
      {children}
    </DesignVariantContext.Provider>
  );
}

export function useDesignVariant() {
  const context = useContext(DesignVariantContext);
  if (!context) {
    throw new Error("useDesignVariant must be used within a DesignVariantProvider");
  }
  return context;
}