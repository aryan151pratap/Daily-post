const User = require("../models/user");
const Post = require("../models/post");
const express = require("express");
const router = express.Router();

router.get('/user/:id', async (req, res) => {
	try{
		const {id} = req.params;
		if(!id) return res.status(400).json({message: "user id not found"});
		const user = await User.findById(id);
		
		const [posts, count] = await Promise.all([
			Post.find({ userId: id })
				.sort({ createdAt: -1 })
				.skip(0)
				.limit(1)
				.populate("like unlike", "email"),

			Post.countDocuments({ userId: id })
		]);

		res.status(200).json({user, post: posts, count});
	} catch(err){
		console.log(err);
	}
});

router.post('/edit/:id', async (req, res) => {
	try{
		const {id} = req.params;
		const data = req.body;
		if(!id || !data) return res.status(400).json({message: "user id not found"});
		const user = await User.findByIdAndUpdate(id,
			{ $set: data },
			{ new: true, runValidators: true }
		)

		res.status(200).json({user});
	} catch(err){
		console.log(err);
	}
})

router.get('/postByIndex/:id/:index', async (req, res) => {
	try{
		const {id, index} = req.params;
		if(!id) return res.status(400).json({message: "user id not found"});
		const user = await User.findById(id);
		
		const [posts, count] = await Promise.all([
			Post.find({ userId: id })
				.sort({ createdAt: -1 })
				.skip(index)
				.limit(1)
				.populate("like unlike", "email"),

			Post.countDocuments({ userId: id })
		]);

		res.status(200).json({ post: posts, count});
	} catch(err){
		console.log(err);
	}
});



module.exports = router;