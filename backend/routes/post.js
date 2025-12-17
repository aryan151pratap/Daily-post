const express = require('express');
const router = express.Router();
const postService = require('../services/postService');

router.get('/getPost/:email', async (req, res) => {
    try {
        const { skip = 0, limit = 3, search = "" } = req.query;
        const { post, hasMore } = await postService.getPosts(skip, limit, search);

        if (!post) return res.status(500).json({ message: "post not found" });

        return res.status(200).json({ post, hasMore });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get('/getPostById/:postId', async (req, res) => {
    try {
        const {postId} = req.params;
        const post = await postService.getPostById(postId);
        if (!post) return res.status(500).json({ message: "user not found" });

        return res.status(200).json(post);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get('/getPostImage/:postId/:index', async (req, res) => {
    try {
        const {postId, index} = req.params;
        const post = await postService.getPostImage(postId, index);
        if (!post) return res.status(500).json({ message: "user not found" });

        return res.status(200).json(post);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/savePost/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const { title, post, image } = req.body;

        const newPost = await postService.savePost(email, title, post, image);
        console.log("post save");

        return res.status(200).json({ result: "post sucessfully", post: newPost });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/react/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email, action } = req.body;

        const post = await postService.reactPost(id, email, action);
        return res.status(200).json({ post });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/comment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email, comment } = req.body;

        const post = await postService.addComment(id, email, comment);
        return res.status(200).json({ post });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get('/getComment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const post = await postService.getComments(id);

        if (!post) return res.status(400).json({ message: "post not found!" });
        return res.status(200).json({ post });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get('/deleteComment/:id/:commentId', async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const post = await postService.deleteComment(id, commentId);
        return res.status(200).json({ post });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get('/deletePost/:id', async (req, res) => {
	try{
		const {id} = req.params;
		const post = await postService.deletePost(id);
		return res.status(200).json({ message: "post deleted sucessfully" });
	} catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
