import type { OrgResultCardData } from '@/crd/components/search/OrgResultCard';
import type { PostResultCardData } from '@/crd/components/search/PostResultCard';
import type { ResponseResultCardData } from '@/crd/components/search/ResponseResultCard';
import type { UserResultCardData } from '@/crd/components/search/UserResultCard';
import type {
  SearchOrgResult,
  SearchPostResult,
  SearchResponseResult,
  SearchUserResult,
} from '@/app/components/search/searchData';

/**
 * Search fixtures → the data types CRD's four result cards export.
 *
 * The shapes already line up almost exactly — the prototype's categories
 * (`spaces | posts | responses | users | organizations`) are CRD's
 * `SearchCategoryId` verbatim. Three differences are resolved here:
 *
 *  - `avatar` → `avatarUrl` / `logoUrl`, `bannerImage` → `bannerUrl`
 *  - `href` is built from the slug; the fixtures carry slugs, not links
 *  - `stats` (comment / reaction counts) is dropped — CRD's result cards do
 *    not render it, so it is not smuggled in
 *
 * Vocabulary note: a "post" here is a **callout** in client-web and a
 * "response" is a **contribution**; CRD's card names still use the older
 * search-domain words, so those are kept.
 */

const userHref = (name: string) => `/user/${name.toLowerCase().replace(/ /g, '-')}`;

export function toPostResult(post: SearchPostResult): PostResultCardData {
  return {
    id: post.id,
    title: post.title,
    snippet: post.snippet,
    type: post.type,
    bannerUrl: post.bannerImage,
    author: { name: post.author.name, avatarUrl: post.author.avatar },
    date: post.date,
    spaceName: post.spaceName,
    href: `/space/${post.spaceSlug}`,
  };
}

export function toResponseResult(response: SearchResponseResult): ResponseResultCardData {
  return {
    id: response.id,
    title: response.title,
    snippet: response.snippet,
    type: response.type,
    author: { name: response.author.name, avatarUrl: response.author.avatar },
    date: response.date,
    parentPostTitle: response.parentPostTitle,
    spaceName: response.spaceName,
    href: `/space/${response.spaceSlug}`,
  };
}

export function toUserResult(user: SearchUserResult): UserResultCardData {
  return {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatar,
    role: user.role,
    email: user.email,
    href: userHref(user.name),
  };
}

export function toOrgResult(org: SearchOrgResult): OrgResultCardData {
  return {
    id: org.id,
    name: org.name,
    logoUrl: org.avatar,
    type: org.type,
    tagline: org.tagline,
    href: `/org/${org.id}`,
  };
}
