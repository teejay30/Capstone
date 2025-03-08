const Post = require("../models/postModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

// Get All posts of user
const getPostsId = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Find all posts for the user
        const posts = await Post.find({ user: userId }).populate(
            "user",
            "username email"
        );

        if (!posts || posts.length === 0) {
            return res
                .status(404)
                .json({ message: "No posts found for this user" });
        }

        const totalPosts = await Post.countDocuments({ user: userId });

        res.json({ totalPosts, posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Create post that's tied to the userid
const createPostId = async (req, res) => {
    try {
        const { title, body, userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newPost = new Post({
            title,
            body,
            user: userId,
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get a single post
const getPost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such Post" });
    }
    const post = await Post.findById(id);

    if (!post) {
        return res.status(404).json({ error: "No such Post" });
    }

    res.status(200).json(post);
};

// Create new post
const createPost = async (req, res) => {
    const { title, body, author } = req.body;

    //  add doc to db
    try {
        const posts = await Post.create({ title, body, author });
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a post
const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such Post" });
    }

    const post = await Post.findOneAndDelete({ _id: id });

    if (!post) {
        return res.status(404).json({ error: "No such Post" });
    }

    res.status(200).json(post);
};

// Update a Post
const updatePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such Post" });
    }

    const post = await Post.findByIdAndUpdate(
        { _id: id },
        {
            ...req.body,
        }
    );
    if (!post) {
        return res.status(404).json({ error: "No such Post" });
    }
    res.status(200).json(post);
};

// Get Featured Posts
const getFeaturedPosts = async (req, res) => {
    try {
        const featuredPosts = await Post.find({ featured: true }).sort({ createdAt: -1 });
        res.status(200).json(featuredPosts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching featured posts", error });
    }
};

// Get Recent Posts
const getRecentPosts = async (req, res) => {
    try {
        const recentPosts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(recentPosts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching recent posts", error });
    }
};

// Get Most Popular Posts
const getMostPopularPosts = async (req, res) => {
    try {
        const popularPosts = await Post.find().sort({ likes: -1 });
        res.status(200).json(popularPosts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching popular posts", error });
    }
};

// Get All Posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }); // Fetch all posts and sort by creation date
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching all posts", error });
    }
};

// Sort Posts by Date (Week, Month, Year)
const sortPostsByDate = async (req, res) => {
    const { period } = req.params; // 'week', 'month', or 'year'
    const currentDate = new Date();
    let startDate;

    switch (period) {
        case "week":
            startDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
            break;
        case "month":
            startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
            break;
        case "year":
            startDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
            break;
        default:
            return res.status(400).json({ message: "Invalid period" });
    }

    try {
        const sortedPosts = await Post.find({ createdAt: { $gte: startDate } }).sort({ createdAt: -1 });
        res.status(200).json(sortedPosts);
    } catch (error) {
        res.status(500).json({ message: "Error sorting posts by date", error });
    }
};

module.exports = {
    createPost,
    getPost,
    deletePost,
    updatePost,
    getPostsId,
    createPostId,
    getFeaturedPosts,
    getRecentPosts,
    getMostPopularPosts,
    sortPostsByDate,
    getAllPosts,
};