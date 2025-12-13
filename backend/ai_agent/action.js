const {
  savePost,
  deletePost,
  reactPost,
  addComment,
  deleteComment,
  getComments,
  deleteAllPost,
  editPost
} = require("../services/postService");

const Post = require("../models/post");

async function runAction(result, id) {
  const action = result?.action?.action;
  const args = result?.action?.args || {};

  if (!action) {
    return { status: false, message: "No action" };
  }

  const userId = args.userId || args.userID || null;
  const postId = args.postId || args.postID || null;
  const email = args.email;

  if (
    ["savePost", "editPost"].includes(action) &&
    (!args || Object.keys(args).length === 0)
  ) {
    return { status: false, message: "Post data missing" };
  }

  let content = args.caption ? args.caption + "\n\n" : "";

  if (Array.isArray(args.tags)) {
    for (const tag of args.tags) {
      content += `<a href="/tag/${tag}" class="text-rose-600 font-semibold hover:underline">#${tag}</a> `;
    }
  }

  try {
    switch (action) {
      case "savePost": {
        if (!email || !args.title) return { status: false, message: "Required post data missing" };

        const newPost = await savePost(
          email,
          args.title,
          content,
          args.image || []
        );

        return { status: true, message: "Post created", post: newPost };
      }

      case "editPost": {
        if (!postId || !email) return { status: false, message: "Post ID or email missing" };

        const updatedPost = await editPost(
          postId,
          email,
          args.title,
          content,
          args.image || []
        );

        return { status: true, message: "Post updated", post: updatedPost };
      }

      case "deletePost": {
        if (!postId) return { status: false, message: "Post ID missing" };

        const deleted = await deletePost(postId);
        return {
          status: true,
          message: "Post deleted",
          count: deleted.deletedCount
        };
      }

      case "deleteAllPost": {
        if (!userId && !id) return { status: false, message: "User ID missing" };

        const deleted = await deleteAllPost(userId || id);
        return {
          status: true,
          message: "All posts deleted",
          count: deleted.deletedCount
        };
      }

      case "reactPost": {
        if (!postId || !email || !args.reaction) return { status: false, message: "Reaction data missing" };

        const updated = await reactPost(postId, email, args.reaction);
        return { status: true, message: "Reaction updated", post: updated };
      }

      case "addComment": {
        if (!postId || !email || !args.comment) return { status: false, message: "Comment data missing" };

        const updated = await addComment(postId, email, args.comment);
        return { status: true, message: "Comment added", post: updated };
      }

      case "deleteComment": {
        if (!postId || !args.commentId) return { status: false, message: "Comment ID missing" };

        const updated = await deleteComment(postId, args.commentId);
        return { status: true, message: "Comment deleted", post: updated };
      }

      case "getComments": {
        if (!postId) return { status: false, message: "Post ID missing" };

        const comments = await getComments(postId);
        return {
          status: true,
          message: "Comments fetched",
          post: comments
        };
      }

      case "getPosts": {
        const posts = await Post.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .populate("userId", "username")
          .select("title userId createdAt");

        return { status: true, post: posts };
      }

      case "userPost": {
        if (!userId) return { status: false, message: "User ID missing" };

        const posts = await Post.find({ userId }).select("title userId createdAt");

        return { status: true, post: posts };
      }

      default:
        return { status: false, message: "Unknown action" };
    }
  } catch (err) {
    return { status: false, message: err.message };
  }
}

module.exports = { runAction };
