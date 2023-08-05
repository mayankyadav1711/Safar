const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const postSchema = new mongoose.Schema({
    source:{
        type:String,
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    itstop1:{
        type:String,
    },
    itstop2:{
        type:String,
    },
    itstop3:{
        type:String,
    },
    itstop4:{
        type:String,
    },
    itstop5:{
        type:String,
    },
    itstop6:{
        type:String,
    },

    datefrom:{
        type:Date,
        required:true
    },
    dateto:{
        type:Date,
        required:true
    },
    traveltype:{
        type:String,
        required:true
    },
    accomodationpref:{
        type:String,
        required:true
    },
    budget:{
        type:Number,
        required:true
    },
    needhelp:{
        type:String,
        required:true
    },
    tags:{
        type:String,
        required:true
    },
   
    instahandle:{
        type:String,
        required:true
    },
    likes:[{
        type:ObjectId,
        ref:"User"
    }],
    connectedBy: [{
        type: ObjectId,
        ref: 'User'
      }],
    postedBy:{
        type:ObjectId,
        ref:"User"
    }
})
postSchema.pre('findOne', autoPopulateUser);
postSchema.pre('find', autoPopulateUser);

function autoPopulateUser(next) {
  this.populate('likes', 'name profilepic')
    .populate('connectedBy', 'name profilepic')
    .populate('postedBy', 'name profilepic email currlocation');
  next();
}

mongoose.model("Post",postSchema)