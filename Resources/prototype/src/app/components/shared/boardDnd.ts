/**
 * dnd-kit plumbing shared by the prototype's exploratory kanban boards
 * (SubspaceBoardView, KanbanBoardPost).
 *
 * These boards have no production counterpart yet, so they keep their own card
 * and column design — but the drag mechanics are production's. Values here are
 * copied from `@/crd/components/callout/task-board/TaskBoardView` so an
 * exploration that later graduates into client-web already behaves identically.
 *
 * When one of these boards does graduate, delete its prototype implementation
 * and import the CRD component instead — don't keep both.
 */
import {
  type CollisionDetection,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

/** Prefix for a column's droppable id so it can never collide with a card id. */
export const COLUMN_DROPPABLE_PREFIX = 'col:';

export const toColumnDroppableId = (columnId: string) => `${COLUMN_DROPPABLE_PREFIX}${columnId}`;

export const fromColumnDroppableId = (droppableId: string) =>
  droppableId.startsWith(COLUMN_DROPPABLE_PREFIX)
    ? droppableId.slice(COLUMN_DROPPABLE_PREFIX.length)
    : undefined;

/**
 * Pointer-first collision detection (production's `boardCollisionDetection`).
 *
 * Columns are full-height droppables, so `closestCorners` alone mis-resolves: a
 * short dragged card's corners stay closer to its own (equally short) source
 * droppable than to a tall target column whose bottom corners are hundreds of px
 * away — the card never "enters" another column. `pointerWithin` instead asks
 * which droppable the pointer is literally inside, which is exactly right for a
 * kanban board. It has no result for keyboard dragging (no pointer), so fall
 * back to `closestCorners` then.
 */
export const boardCollisionDetection: CollisionDetection = args => {
  const pointerHits = pointerWithin(args);
  return pointerHits.length > 0 ? pointerHits : closestCorners(args);
};

/** Pointer + touch + keyboard sensors, matching production's activation thresholds. */
export function useBoardSensors() {
  return useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
}
