const Post = require("../models/post");
const User = require("../models/user");

async function getPosts(skip = 0, limit = 10, search) {
    const query = search && search.trim() !== ""
    ? { title: { $regex: search, $options: "i" } }
    : {};

    const post = await Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "username image bio")
        .populate("like unlike", "email");
    const count = await Post.countDocuments(query);
    return { post, hasMore: skip + limit < count };
}

async function getPostById(postId){
    const post = await Post.findById(postId).select("title caption comments");
    if(!post) return {message: "post not found..."};
    return post;
}

async function savePost(email, title, caption, images) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("user not found");

    const newPost = await Post.create({
		title,
        caption,
        imageUrl: images || [],
        userId: user._id
    });
    return newPost;
}

async function editPost(postId, email, title, caption, images) {
  const user = await User.findOne({ email });
  if (!user) return {message: "user not found"};

  const post = await Post.findOne({ _id: postId, userId: user._id });
  if (!post) return {message: "post not found"};

  if (title !== "") post.title = title;
  if (caption !== "") post.caption = caption;
  if (images.length > 0) post.imageUrl = images;

  await post.save();
  return post;
}


async function reactPost(id, email, action) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    let updateQuery = {};
    if (action === "like") updateQuery = { $addToSet: { like: user._id }, $pull: { unlike: user._id } };
    else if (action === "unlike") updateQuery = { $addToSet: { unlike: user._id }, $pull: { like: user._id } };
    else if (action === "remove-like") updateQuery = { $pull: { like: user._id } };
    else if (action === "remove-unlike") updateQuery = { $pull: { unlike: user._id } };

    const post = await Post.findByIdAndUpdate(id, updateQuery, { new: true })
        .populate("like unlike", "email username");
    return post;
}

async function addComment(id, email, comment) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const post = await Post.findByIdAndUpdate(
        id,
        { $push: { comments: { user: user._id, comment } } },
        { new: true }
    );
    return post;
}

async function getComments(id) {
    const post = await Post.findById(id)
        .populate("comments.user", "email username image")
        .select("comments");
    return post;
}

async function deleteComment(id, commentId) {
    const post = await Post.findByIdAndUpdate(
        id,
        { $pull: { comments: { _id: commentId } } },
        { new: true }
    );
    return post;
}

async function deleteAllPost(userID){
	const result = await Post.deleteMany({ userId: userID });
  	return result;
}

async function deletePost(postId){
	const result = await Post.findByIdAndDelete(postId);
  	return result;
}


module.exports = {
    getPosts,
    savePost,
    reactPost,
    addComment,
    getComments,
    deleteComment,
    deleteAllPost,
	deletePost,
    editPost,
    getPostById
};
