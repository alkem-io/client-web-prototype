import { useRef, useCallback } from 'react';
import { PostCardData } from '@/app/components/space/PostCard';
import { MediaGalleryFeedThumbnail } from './MediaGalleryFeedGrid';

export const MOCK_CURRENT_USER = { id: 'current-user', name: 'You' };

interface UseMediaGalleryMockUploadParams {
  posts: PostCardData[];
  setPosts: (posts: PostCardData[]) => void;
  currentUser?: { id: string; name: string };
  isAdmin?: boolean;
}

export function useMediaGalleryMockUpload({
  posts,
  setPosts,
  currentUser = MOCK_CURRENT_USER,
  isAdmin = true,
}: UseMediaGalleryMockUploadParams) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingPostIdRef = useRef<string | null>(null);

  const openAddDialog = useCallback((postId: string) => {
    pendingPostIdRef.current = postId;
    fileInputRef.current?.click();
  }, []);

  const handleFilesSelected = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.currentTarget.files;
      if (!files || !pendingPostIdRef.current) return;

      const postId = pendingPostIdRef.current;
      const newThumbnails: MediaGalleryFeedThumbnail[] = [];

      Array.from(files).forEach((file) => {
        const url = URL.createObjectURL(file);
        const thumbnail: MediaGalleryFeedThumbnail = {
          id: `thumbnail-${Date.now()}-${Math.random()}`,
          url,
          alternativeText: file.name,
          uploadedBy: currentUser,
          canDelete: true, // Current user can always delete their own uploads
        };
        newThumbnails.push(thumbnail);
      });

      // Update the post's gallery
      const updatedPosts = posts.map((post) => {
        if (post.id === postId && post.type === 'mediaGallery' && post.framingMediaGallery) {
          return {
            ...post,
            framingMediaGallery: {
              thumbnails: [...post.framingMediaGallery.thumbnails, ...newThumbnails],
              totalCount: post.framingMediaGallery.totalCount + newThumbnails.length,
            },
          };
        }
        return post;
      });

      setPosts(updatedPosts);

      // Reset the input so the same file can be selected again
      event.currentTarget.value = '';
      pendingPostIdRef.current = null;
    },
    [posts, setPosts, currentUser]
  );

  const deleteImage = useCallback(
    (postId: string, thumbnailId: string) => {
      const updatedPosts = posts.map((post) => {
        if (post.id === postId && post.type === 'mediaGallery' && post.framingMediaGallery) {
          const filteredThumbnails = post.framingMediaGallery.thumbnails.filter((t) => t.id !== thumbnailId);
          return {
            ...post,
            framingMediaGallery: {
              thumbnails: filteredThumbnails,
              totalCount: Math.max(0, post.framingMediaGallery.totalCount - 1),
            },
          };
        }
        return post;
      });

      setPosts(updatedPosts);
    },
    [posts, setPosts]
  );

  return {
    fileInputRef,
    openAddDialog,
    handleFilesSelected,
    deleteImage,
  };
}
