const express = require("express");
const router = express.Router();

const Post = require("../models/post");
const requireLogin = require("../middlewares/requireLogin");

router.get("/allPosts", requireLogin, (req, res) => {
  Post.find()
    .sort({ _id: -1 })
    .populate("postedBy", "_id name email")
    .populate("comments.postedBy", "_id name")
    .then((posts) => {
      return res.status(200).json({ message: posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/createPost", requireLogin, (req, res) => {
  const { body, pic } = req.body;
  console.log(body, pic);
  if (!body || !pic) {
    res.status(422).json({ error: "Please fill all the required fields" });
  }

  const post = new Post({
    body,
    photo: pic,
    postedBy: req.user, //req.user from requireLogin middleware
  });

  post
    .save()
    .then((savedPost) => {
      res.status(200).json({ message: savedPost });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/deletePost/:postId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => res.json(result))
          .catch((err) => console.log(err));
      }
    });
});

router.get("/myposts", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((mypost) => {
      return res.status(200).json({ mypost });
    })
    .catch((err) => console.log(err));
});

router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: error });
    } else {
      res.json(result);
    }
  });
});

router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    { new: true }
  )
    .populate("comments.postedBy", "_id name")
    .populate("posteBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

module.exports = router;
