import {
  getLatestCommentId,
  getLatestComments,
  getLatestPosts,
  getLatestPostSlug,
  getPostMeta,
  setLatestCommentId,
  setLatestPostSlug,
} from "$lib/server/database";
import { globalConfig } from "$lib/util/config";
import { fireCommentHook, firePostHook } from "$lib/server/webhooks.discord";
import type { CommentMeta, PostMeta } from "$lib/util/types";

export const latestPostHook = async () => {
  const latestPostSlug = await getLatestPostSlug();
  if (!latestPostSlug) return;
  const latestPosts = (await getLatestPosts()).sort((a, b) => a.date.getTime() - b.date.getTime());
  const latestPost = latestPosts.find((post) => post.slug === latestPostSlug);
  if (!latestPost) return;
  const announcedPosts = latestPosts.filter(
    (post) => post.date.getTime() > latestPost.date.getTime(),
  );
  for (const post of announcedPosts) {
    for (const hook of globalConfig.webhooks.newPost) {
      if (!(await firePostHook(hook, post))) console.error("Failed to fire webhook", hook.url);
    }
  }
  if (announcedPosts.length > 0)
    await setLatestPostSlug(announcedPosts[announcedPosts.length - 1].slug);
};

export const latestCommentHook = async () => {
  let latestCommentId = await getLatestCommentId();
  if (!latestCommentId) return;
  console.log("latestCommentId", latestCommentId);
  const latestComments = (await getLatestComments()).sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );
  let latestComment: CommentMeta | undefined;
  while (!latestComment) {
    latestComment = latestComments.find((comment) => comment._id === latestCommentId);
    console.log("latestComment", latestComment, latestCommentId);
    latestCommentId = latestCommentId - 1;
  }
  const announcedComments = await Promise.all(
    latestComments
      .filter((comment) => comment.date.getTime() > (<CommentMeta>latestComment).date.getTime())
      .map(async (comment) => {
        return {
          comment: comment,
          post: (await getPostMeta(comment.postSlug)) as PostMeta,
        };
      }),
  );
  for (const announcedComment of announcedComments) {
    for (const hook of globalConfig.webhooks.newComment) {
      console.log("announcedComment", announcedComment);
      if (!(await fireCommentHook(hook, announcedComment.post, announcedComment.comment)))
        console.error("Failed to fire webhook", hook.url);
    }
  }
  if (announcedComments.length > 0)
    await setLatestCommentId(announcedComments[announcedComments.length - 1].comment._id);
};
