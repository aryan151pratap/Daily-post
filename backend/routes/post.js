const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');

router.get('/getPost/:email', async (req, res) => {
    try {
        const { email } = req.params;
        console.log(email);

		if(!email) return res.status(500).json({message: "user  not found"});

		const post = await Post.find()
		.populate("userId", "username email").sort({ createdAt: -1 })
		.populate("like unlike", "email")
		;

		if(!post) return res.status(500).json({message: "user  not found"});
        return res.status(200).json({
			result: post
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/savePost/:email', async (req, res) => {
    try {
        const { email } = req.params;
		const { post , image } = req.body;
        if(!email) return res.status(500).json({message: "user  not found"});

		const user = await User.findOne({email});
		if(!user) return res.status(500).json({message: "user  not found"});

		console.log(user);

		const newPost = await Post.create({
			caption: post,
			imageUrl: image,
			userId: user._id
		})

		console.log("post save");

        return res.status(200).json({
            result: "post sucessfully",
			post: newPost
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/react/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email, action } = req.body;
		console.log(action);
        if (!id) return res.status(400).json({ message: "Post ID missing" });
        if (!email) return res.status(400).json({ message: "User email missing" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        let updateQuery = {};

        if (action === "like") {
            updateQuery = {
                $addToSet: { like: user._id },
                $pull: { unlike: user._id }
            };
        } else if (action === "unlike") {
            updateQuery = {
                $addToSet: { unlike: user._id },
                $pull: { like: user._id }
            };
        } else if (action === "remove-like") {
            updateQuery = { $pull: { like: user._id } };
        } else if (action === "remove-unlike") {
            updateQuery = { $pull: { unlike: user._id } };
        }

        const post = await Post.findByIdAndUpdate(id, updateQuery, { new: true })
            .populate("like unlike", "email username");

        return res.status(200).json({ post });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/comment/:id', async (req, res) => {
	try {
		const {id} = req.params;
		const {email, comment} = req.body;
		console.log(comment);
		if (!id) return res.status(400).json({ message: "Post ID missing" });
        if (!email) return res.status(400).json({ message: "User email missing" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

		const post = await Post.findByIdAndUpdate(
			id, 
			{ $push: 
				{ comments: { user: user._id, comment } }
			}, 
			{ new: true }
		).populate("comments.user", "email");

		res.status(200).json({
			post
		});

	} catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

router.get('/getComment/:id', async (req, res) => {
	try{
		const {id} = req.params;
		console.log(id);
		if(!id) return res.status(400).json({message: "post id not found!"});
		const post = await Post.findById(id).populate("comments.user", "email username").select("comments");
		console.log("show");
		if(!post) return res.status(400).json({message: "post not found!"});
		return res.status(200).json({
			post
		});
	} catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

router.get('/deleteComment/:id/:commentId', async (req, res) => {
	try{
		const {id, commentId} = req.params;
		if(!id || !commentId) return res.status(400).json({message: "post and comment id not found!"});
		const post = await Post.findByIdAndUpdate(id,
			{ $pull: 
				{ comments: {_id: commentId}}
			},
			{ new: true }
		)
		console.log(post);
		res.status(200).json({post});
	} catch(err){
		console.log(err);
	}
})

module.exports = router;
