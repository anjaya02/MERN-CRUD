const express = require("express");
const Posts = require("../models/post");

const router = express.Router();

// SAVE POSTS
router.post("/post/save", async (req, res) => {
  try {
    let newPost = new Posts(req.body);
    let savedPost = await newPost.save(); // Save the post and store the saved object
    return res.status(200).json({
      success: "Post Saved Successfully",
      post: savedPost, // Return the saved post
    });
  } catch (err) {
    return res.status(400).json({
      error: "Error encountered while saving Post: " + err,
    });
  }
});


// GET SINGLE POST BY ID
router.get("/posts/:id", async (req, res) => {
  try {
    const postId = req.params.id; // Get the post ID from the URL parameter
    const post = await Posts.findById(postId); // Find the post by ID

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      post: post,
    });
  } catch (err) {
    return res.status(400).json({
      error: "Error fetching post",
    });
  }
});

// GET POSTS
router.get("/posts", async (req, res) => {
  try {
    const posts = await Posts.find({});
    return res.status(200).json({
      success: true,
      posts: posts,
    });
  } catch (err) {
    return res.status(400).json({
      error: "Error fetching posts",
    });
  }
});

// UPDATE A POST
router.put("/post/update/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedPost = await Posts.findByIdAndUpdate(postId, req.body, {
      new: true,
    });

    if (!updatedPost) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    return res.status(200).json({
      success: "Post updated successfully",
      post: updatedPost,
    });
  } catch (err) {
    return res.status(400).json({
      error: "Error updating post",
    });
  }
});

// DELETE A POST
router.delete("/post/delete/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const deletedPost = await Posts.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    return res.status(200).json({
      success: "Post deleted successfully",
      post: deletedPost,
    });
  } catch (err) {
    return res.status(400).json({
      error: "Error encountered while deleting post: " + err,
    });
  }
});

module.exports = router;
