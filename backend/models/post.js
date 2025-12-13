const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    caption: { 
        type: String 
    },
    imageUrl: { 
        type: [String],
        default: []
    },
    like: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    unlike: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            comment: String
        }
    ],
    send: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User"
        }
    ], 
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    }
}, {timestamps: true});

module.exports = mongoose.model("Post", PostSchema);
