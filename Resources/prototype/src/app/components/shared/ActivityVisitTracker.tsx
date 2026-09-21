import { useEffect } from "react";
import { useLocation } from "react-router";
import { useActivityIndicators } from "@/app/contexts/ActivityIndicatorsContext";
import {
  spaceContainer,
  subspaceContainer,
  tabContainer,
} from "@/app/data/activity-data";

/**
 * Marks containers as visited from the URL. Containers clear on arrival; items
 * clear on sight, which is handled where they render.
 */
export function ActivityVisitTracker() {
  const { pathname } = useLocation();
  const { visitContainer } = useActivityIndicators();

  useEffect(() => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts[0] !== "space" || !parts[1]) return;

    const spaceSlug = parts[1];
    visitContainer(spaceContainer(spaceSlug));

    if (parts[2] === "subspaces" && parts[3]) {
      visitContainer(subspaceContainer(parts[3]));
      // Sub-subspace: /space/:slug/subspaces/:a/subspaces/:b
      if (parts[4] === "subspaces" && parts[5]) {
        visitContainer(subspaceContainer(parts[5]));
      }
      return;
    }
    if (parts[2] === "settings") return;

    visitContainer(tabContainer(spaceSlug, parts[2] ?? "home"));
  }, [pathname, visitContainer]);

  return null;
}
