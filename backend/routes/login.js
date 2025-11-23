const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed });

  res.json({ message: "Signup successful", user });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found\nSign up required", status: 400 });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid password" });

  res.status(200).json({ message: "Login sucessfull" });
});


router.get('/autologin/:email', async (req, res) => {
  try{
    const {email} = req.params;
    if(!email) return res.status(400).json({message: "user email not found"});

    const user = await User.findOne({email}).select("-password");

    res.status(200).json({
      user
    });
  } catch(err){
    console.log(err);
    res.status(500).json({error: "Internal server error"});
  }
})

module.exports = router;
