const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireSignin");
const Post = mongoose.model("Post");
const ContactUs = mongoose.model("ContactUs");
const Notification = mongoose.model("Notification");
const nodemailer = require("nodemailer");
const { EMAIL, GPASS } = require("../config/keys");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hellosafarnamaaa@gmail.com",
    pass: "dnoevwrblknojobh",
  },
});

router.get("/allpost", requireLogin, async (req, res) => {
  try {
    const currentDate = new Date();

    const posts = await Post.find({ dateto: { $gte: currentDate } })
      .populate("postedBy", "id name email profilepic")
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/createpost", requireLogin, async (req, res) => {
  const {
    source,
    destination,
    itstop1,
    itstop2,
    itstop3,
    itstop4,
    itstop5,
    itstop6,
    datefrom,
    dateto,
    traveltype,
    accomodationpref,
    budget,
    needhelp,
    tags,
    instahandle,
  } = req.body;

  if (
    !source ||
    !destination ||
    !datefrom ||
    !dateto ||
    !traveltype ||
    !accomodationpref ||
    !budget ||
    !needhelp ||
    !instahandle
  ) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  try {
    const post = new Post({
      source,
      destination,
      itstop1,
      itstop2,
      itstop3,
      itstop4,
      itstop5,
      itstop6,
      datefrom,
      dateto,
      traveltype,
      accomodationpref,
      budget,
      needhelp,
      tags,
      instahandle,
      postedBy: req.user,
    });

    const result = await post.save();
    res.json({ post: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

router.get("/mypost", requireLogin, async (req, res) => {
  try {
    const mypost = await Post.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "id name email"
    );
    res.json({ mypost });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch user's posts" });
  }
});

router.put("/like", requireLogin, async (req, res) => {
  try {
    const postId = req.body.postId;

    const post = await Post.findById(postId).populate({
      path: "postedBy",
      select: "_id name",
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const alreadyLiked = post.likes.some((userId) =>
      userId.equals(req.user._id)
    );
    if (alreadyLiked) {
      return res
        .status(400)
        .json({ error: "You have already liked this post" });
    }

    post.likes.push(req.user._id);
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: "Failed to like the post" });
  }
});

router.put("/unlike", requireLogin, async (req, res) => {
  try {
    const postId = req.body.postId;
    const userId = req.user._id;

    const post = await Post.findById(postId).populate({
      path: "likes",
      select: "_id name",
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const likedByUser = post.likes.find((user) => user._id.equals(userId));
    if (!likedByUser) {
      return res.status(400).json({ error: "You have not liked this post" });
    }

    post.likes.pull(likedByUser._id);
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: "Failed to unlike the post" });
  }
});

router.get("/likedPosts", requireLogin, async (req, res) => {
  try {
    const posts = await Post.find({ likes: req.user._id }).populate({
      path: "postedBy",
      select: "name email _id profilepic currlocation",
    });
    res.json(posts);
  } catch (err) {
    res.status(422).json({ error: err });
  }
});

router.post("/sendemail", requireLogin, async (req, res) => {
  const { postId } = req.body;
  const { _id: userId } = req.user;

  try {
    const post = await Post.findById(postId).populate({
      path: "postedBy",
      select: "id name email",
    });

    if (!post) {
      return res.status(422).json({ error: "Post not found" });
    }

    const receiverEmail = post.postedBy.email;
    const senderEmail = "hellosafarnamaaa@gmail.com";

    post.connectedBy.push(userId);
    await post.save();

    const mailOptions = {
      from: senderEmail,
      to: receiverEmail,
      subject: "Knock Knock !!",
      text: `Who's there?? There's someone trying to reach out to you! You should totally check it out!`,
    };

    await transporter.sendMail(mailOptions);

    const notification = new Notification({
      user: post.postedBy,
      post: postId,
      message: " connected with your post!",
      isRead: false,
      connectedBy: userId,
    });

    const savedNotification = await notification.save();
    res.json({ message: "Email sent successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch(
  "/notifications/:notificationId",
  requireLogin,
  async (req, res) => {
    try {
      const notificationId = req.params.notificationId;
      const updatedNotification = await Notification.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true }
      );

      if (!updatedNotification) {
        return res.status(404).json({ error: "Notification not found" });
      }

      res.json(updatedNotification);
    } catch (err) {
      res.status(500).json({ error: "Failed to update notification" });
    }
  }
);

router.post("/notifications", requireLogin, async (req, res) => {
  try {
    const { postId, message, connectedBy } = req.body;

    const post = await Post.findById(postId);
    const postAuthorId = post.postedBy;

    const notification = new Notification({
      user: postAuthorId,
      post: postId,
      message,
      isRead: false,
      likedBy: req.user._id,
      connectedBy,
    });

    const savedNotification = await notification.save();
    res.json(savedNotification);
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: "Failed to create notification" });
  }
});

router.get("/notifications", requireLogin, async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [{ user: req.user._id }, { connectedBy: req.user._id }],
    })
      .populate({
        path: "post",
        populate: {
          path: "postedBy",
          select: "_id name profilepic",
        },
      })
      .populate("likedBy", "_id name profilepic")
      .populate("connectedBy", "_id name profilepic")
      .sort({ createdAt: -1 });

    res.json({ notifications });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

//contact route
router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  try {
    // Create a new contact object
    const newContact = new ContactUs({
      name,
      email,
      message,
      user: req.user, // Assuming you have user authentication and have access to the user object in the request
    });

    // Save the contact object to the database
    await newContact.save();

    // Send email notification
    const mailOptions = {
      from: "hellosafarnamaaa@gmail.com",
      to: "hellosafarnamaaa@gmail.com", // Replace with the actual destination email address
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    // Send the response with success status
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
