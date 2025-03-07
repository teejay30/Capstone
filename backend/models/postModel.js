const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema(
    {
        title: { type: String, required: true },
        body: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        featured: { type: Boolean, default: false }, 
        likes: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);