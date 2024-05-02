const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireSignin");
const Post = mongoose.model("Post")
const User = mongoose.model("User")


router.post("/editprofile", requireLogin, async (req, res) => {
  try {
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
      const user = await User.findById(req.user._id);
      if (user) {
          // Update the user's profile fields
          user.name = name;
          user.email = email;
          user.profilepic = profilepic;
          user.currlocation = currlocation;
          user.aboutme = aboutme;
          user.birthdate = birthdate;
          user.instahandle = instahandle;
          
          const updatedUser = await user.save();
          res.json({ user: updatedUser });
      } else {
          res.status(404).json({ error: "User not found" });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update profile" });
  }
});

router.get('/myprofile', requireLogin, async (req, res) => {
  try {
      const profile = await User.findOne({ _id: req.user._id })
          .select('name email _id profilepic currlocation aboutme birthdate instahandle');
      
      if (!profile) {
          return res.status(404).json({ error: 'Profile not found' });
      }
      res.json({ profile });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/userProfile/:id', requireLogin, async (req, res) => {
  try {
      const user = await User.findOne({ _id: req.params.id }).select("-password");
      
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }
      
      const posts = await Post.find({ postedBy: req.params.id }).populate("postedBy");
      
      res.json({ user: user, posts: posts });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
  }
});

  
  
  

module.exports = router