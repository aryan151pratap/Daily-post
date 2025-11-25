const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String },
  bio: { type: String },
  bgColor: { type: String },
  recent: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User"
    }
  ]
});

module.exports = mongoose.model("User", UserSchema);
