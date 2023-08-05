const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireSignin");
const Post = mongoose.model("Post")
const User = mongoose.model("User")


router.post("/editprofile", requireLogin, (req, res) => {
    const {
        name,
        email,
        profilepic,
      currlocation,
      aboutme,
      birthdate,
      instahandle
    } = req.body;
  
    // Find the user by their ID
    User.findById(req.user._id)
      .then((user) => {
        if (user) {
          // Update the user's profile fields
          user.name = name;
          user.email = email;
          user.profilepic = profilepic;
          user.currlocation = currlocation;
          user.aboutme = aboutme;
          user.birthdate = birthdate;
          user.instahandle = instahandle;
  
          user
            .save()
            .then((updatedUser) => {
              res.json({ user: updatedUser });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({ error: "Failed to update profile" });
            });
        } else {
          res.status(404).json({ error: "User not found" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch user" });
      });
  });
  

  router.get('/myprofile', requireLogin, (req, res) => {
    User.findOne({ _id: req.user._id })
      .select('name email _id profilepic currlocation aboutme birthdate instahandle')
      .then(profile => {
        if (!profile) {
          return res.status(404).json({ error: 'Profile not found' });
        }
        res.json({ profile });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
      });
  });
  
  router.get('/userProfile/:id', requireLogin, (req, res) => {
    User.findOne({ _id: req.params.id })
      .select("-password")
      .then(user => {
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        Post.find({ postedBy: req.params.id })
          .populate("postedBy")
          .then(posts => {
            res.json({ user: user, posts: posts });
          })
          .catch(err => {
            console.log(err);
            return res.status(500).json({ error: "Internal server error" });
          });
      })
      .catch(err => {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
      });
  });
  
  
  

module.exports = router