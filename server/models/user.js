const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profilepic:{
        type:String
    },
    currlocation:{
        type:String
    },
    aboutme:{
        type:String
    },
    birthdate:{
        type:Date
    },
    instahandle:{
        type:String
    },
    resetToken:String,
    expireToken:Date

})

mongoose.model("User" , userSchema)