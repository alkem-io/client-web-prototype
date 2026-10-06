/**
 * Importing a composition registers it. Add the import and it appears in the
 * gallery, in `mockup:build` and in `mockup:check` — there is no second list
 * to keep in sync.
 */
import './01-deliberation';

export { allCompositions, compositionById } from '../core/defineComposition';
