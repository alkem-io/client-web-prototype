import type { CalloutDetailDialogData } from '@/crd/components/callout/CalloutDetailDialog';
import type { PostCardData } from '@/app/components/space/PostCard';

/**
 * Post fixture → `CalloutDetailDialogData`, the type CRD's dialog exports.
 *
 * Vocabulary note: what the prototype calls a **post** is a **callout** in
 * client-web, and what the prototype calls a **response** is a
 * **contribution**. The types here are production's; only the fixture shape is
 * the prototype's.
 *
 * CRD renders `description` through its own `MarkdownContent`, which is how
 * production shows a callout's framing text — so the snippet is passed straight
 * through rather than being wrapped in `<p>` by the caller.
 */
export function toCalloutDetail(post: PostCardData): CalloutDetailDialogData {
  return {
    id: post.id,
    title: post.title,
    author: post.author,
    description: post.snippet,
    timestamp: post.timestamp,
    commentCount: post.commentCount,
    references: post.references,
    tags: post.tags,
  };
}
