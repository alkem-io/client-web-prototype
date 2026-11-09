import { useState } from "react";
import type {
  MembershipFilter,
  MembershipRowData,
} from "@/crd/components/contributor/settings/MembershipsSection.types";
import { toast } from "sonner";
import { demoDelay, useDemoState } from "./useDemoState";

/** The membership list shared by the user and organisation Membership tabs. */
export function useDemoMemberships(key: string, seed: MembershipRowData[], leftMessage: string) {
  const [rows, setRows] = useDemoState(key, seed);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<MembershipFilter>("all");
  const [pendingLeave, setPendingLeave] = useState<MembershipRowData | null>(null);
  const [leaving, setLeaving] = useState(false);

  const term = search.trim().toLowerCase();
  const visible = rows.filter(
    (row) =>
      row.displayName.toLowerCase().includes(term) &&
      (filter === "all" || (filter === "spaces" ? row.type === "Space" : row.type === "Subspace"))
  );

  return {
    rows,
    visible,
    search,
    filter,
    onSearchChange: setSearch,
    onFilterChange: setFilter,
    onClearFilters: () => {
      setSearch("");
      setFilter("all");
    },
    pendingLeave,
    leaving,
    onRequestLeave: setPendingLeave,
    onCancelLeave: () => setPendingLeave(null),
    onConfirmLeave: () => {
      if (!pendingLeave) return;
      setLeaving(true);
      demoDelay(() => {
        setRows((previous) => previous.filter((row) => row.id !== pendingLeave.id));
        setLeaving(false);
        setPendingLeave(null);
        toast.success(leftMessage);
      });
    },
  };
}
