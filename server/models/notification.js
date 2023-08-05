const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    likedBy: {
      type: ObjectId,
      ref: 'User'
    },
    connectedBy: {
      type: ObjectId,
      ref: 'User'
    },
    post: {
      type: ObjectId,
      ref: 'Post',
      select: false
    }
  },
  { timestamps: true }
);

notificationSchema.pre('findOne', autoPopulatePost);
notificationSchema.pre('find', autoPopulatePost);

function autoPopulatePost(next) {
  this.populate({
    path: 'post',
    populate: {
      path: 'postedBy',
      select: 'name profilepic'
    }
  })
    .populate({
      path: 'post.likes',
      populate: {
        path: 'postedBy',
        select: 'name profilepic'
      }
    })
    .populate({
      path: 'likedBy',
      select: 'name profilepic'
    });
  next();
}


mongoose.model("Notification", notificationSchema);



