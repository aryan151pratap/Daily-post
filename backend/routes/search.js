const User = require("../models/user");
const Post = require("../models/post");
const express = require("express");
const router = express.Router();

router.get('/getRecent/:id', async (req, res) => {
	try{
		const {id} = req.params;
		const user = await User.findById(id).populate("recent", "username bio image");
		res.status(200).json({user});
	} catch(err){
		console.log(err);
	}
});

router.get('/search/:text', async (req, res) => {
	try{
		const { text } = req.params;
		if(!text) return res.status(400).json({message: "search text not found"});
		const user = await User.find({
			username: { $regex: `^${text}`, $options: "i" }
		}).select("username bio image");
		if(user.length == 0) return res.status(400).json({message: "No user ..."});
		res.status(200).json({user});
	} catch(err){
		console.log(err);
	}
});

router.get('/recent/:userId/:id', async (req, res) => {
	try{
		const {userId, id} = req.params;
		if(!id) return res.status(400).json({message: "recent user id not found to save the recent user"});
		const user = await User.findByIdAndUpdate(userId,
			{$addToSet: {recent: id}},
			{$new: true}
		);
		if(!user) return res.status(400).json({message: "user not found by id"});
		res.status(200).json({user});
	} catch(err){
		console.log(err);
	}
})

router.get('/deleteRecent/:userId/:id', async (req, res) => {
	try{
		const {userId, id} = req.params;
		if(!id) return res.status(400).json({message: "recent user id not found to save the recent user"});
		const user = await User.findByIdAndUpdate(userId,
			{$pull: {recent: id}},
			{$new: true}
		);
		if(!user) return res.status(400).json({message: "user not found by id"});
		res.status(200).json({user});
	} catch(err){
		console.log(err);
	}
})

module.exports = router;