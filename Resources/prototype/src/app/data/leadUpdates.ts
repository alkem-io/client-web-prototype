/**
 * Shared lead-update data for the "lead updates reachable" exploration
 * (client-web#10321).
 *
 * One source so the notification in the header and the update dialog on the
 * space can never disagree about which update you opened. The notification
 * carries an `updateId`; the space page reads `?update=<id>` and opens that
 * exact update — even when newer ones have been posted since.
 */
import type { CommunityUpdate } from "@/crd/components/space/CommunityUpdatesDialog";

/** The demo space the lead updates belong to. */
export const LEAD_UPDATE_SPACE = {
  slug: "green-energy",
  name: "Green Energy Space",
};

const ELENA = {
  name: "Elena Rodriguez",
  initials: "ER",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

const JEROEN = {
  name: "Jeroen Nijkamp",
  initials: "JN",
};

/**
 * Updates from the leads, newest first — the order production's Updates box and
 * the full-list dialog use. "Newer" steps toward index 0, "Older" away from it.
 */
export const LEAD_UPDATES: CommunityUpdate[] = [
  {
    id: "q2-sprint",
    author: ELENA,
    date: new Date("2026-10-16T10:12:00"),
    body:
      "Welcome to the Q2 sprint! We're focusing on stakeholder alignment and finalising the policy proposal.\n\n" +
      "Please review the updated timeline in the Knowledge Base and flag any blockers in this week's check-in post. The draft goes to the advisory group on 6 November, so anything that needs changing should be in by the 31st.\n\n" +
      "Thanks to everyone who joined last week's call. The recording is in the Knowledge Base under \"Sprint calls\".",
  },
  {
    id: "office-hours",
    author: JEROEN,
    date: new Date("2026-10-05T09:30:00"),
    body:
      "Office hours are moving from Tuesday to Thursday, 15:00 to 16:00 CET, starting this week.\n\n" +
      "Same link as before. Bring anything: questions about the platform, a post you want feedback on, or an idea for a subspace.",
  },
  {
    id: "members-120",
    author: ELENA,
    date: new Date("2026-09-18T14:05:00"),
    body:
      "We passed 120 members this week. Thank you all for bringing people in.\n\n" +
      "If you are new: say hello in the Community tab and tell us which part of the transition you work on.",
  },
  {
    id: "welcome",
    author: ELENA,
    date: new Date("2026-08-21T11:00:00"),
    body:
      "Welcome to the Green Energy Space. This space is for sharing what works, finding each other, and building the field together.\n\n" +
      "Start with the Knowledge Base for the basics, then join a subspace that matches your work.",
  },
];

export const leadUpdateById = (id: string | null) =>
  id ? LEAD_UPDATES.find(u => u.id === id) : undefined;

/** A deep link to a single update, as it would read in the address bar. */
export const leadUpdateHref = (id: string) =>
  `/space/${LEAD_UPDATE_SPACE.slug}?update=${id}`;

/**
 * The lead-update notifications shown at the top of the notifications overlay.
 * One points at the latest update, one at an older update — so clicking it
 * proves the notification opens *its* update, not whatever is newest.
 */
export const LEAD_UPDATE_NOTIFICATIONS = [
  {
    id: "lu-1",
    updateId: "q2-sprint",
    author: ELENA.name,
    avatar: ELENA.avatarUrl,
    time: "2 hours ago",
    unread: true,
  },
  {
    id: "lu-2",
    updateId: "office-hours",
    author: JEROEN.name,
    avatar: "",
    time: "Yesterday",
    unread: true,
  },
];
