const { route } = require("./users");

const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
// create a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }
    catch (err) {
        res.status(500).json(err);
    }
})
// update a post
router.put("/:id", async (req, res) => {
    try {
        const post = Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("Post Updated!");
        }
        else {
            res.status(403).json("You can update only your post");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});
// delete post
router.delete("/:id", async (req, res) => {
    try {
        const post = Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("Post Deleted!");
        }
        else {
            res.status(403).json("You can delete only your post");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});
//   like,dislike post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("You liked this post");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("Disliked");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//get post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
//timeline
router.get("/timeline/all", async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        //here we use promise because we are using map,so it that it can fetch all the posts.
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );
        res.json(userPosts.concat(...friendPosts));
    }
    catch (err) {
        res.status(500).json(err);
    }
});
module.exports = router;