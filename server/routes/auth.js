const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt= require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireSignin')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const {EMAIL,GPASS} = require('../config/keys')


//

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "hellosafarnamaaa@gmail.com",
      pass: GPASS
    },
  });

router.post('/signup',(req,res)=>{
    const{name,email,password} = req.body
    if(!email || !password || !name){
         return  res.status(422).json({error:"Please add the fields."})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
         return  res.status(422).json({error:"User already exists."})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
                const user = new User({
                    email,
                    password:hashedpassword,
                    name
                })
                user.save()
                .then(user=>{
                    transporter.sendMail({
                        from: "hellosafarnamaaa@gmail.com",
                        to: user.email,
                        subject: "Welcome aboard Safarnamaaa!",
                        html: `
                          <h1>We are absolutely thrilled to have you join us at Safarnamaaa!</h1>
                          <p>Get ready to embark on an incredible journey with us.</p>
                          <p>Here's your pathway to proceed:</p>
                          <ol>
                            <li>Create your profile - it only takes 2 minutes!</li>
                            <li>Explore and search for your desired travel destinations.</li>
                            <li>Connect with your ideal travel companion using Connect+ and Instagram.</li>
                            <li>You're all set to embark on unforgettable life experiences!</li>
                          </ol>
                          <p>We can't wait to see you explore the world and make amazing memories.</p>
                          <p>So let’s start your Safar with Safarnamaaa and If you have any questions or need assistance, feel free to reach out to our team.</p>
                          <p>Enjoy the journey!</p>
                          <p>Best regards,</p>
                          <p>[Safarnamaaa Team]</p>
                        `,
                      });
                      
                    res.json({message:"Saved Successfully."})
                })
                .catch(err=>{
                    console.log(err)
                })

        })
       
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/signin', (req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"Please provide both email and password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error:"Invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"Successful SignIn!!"})
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const{_id,name,email} = savedUser
                res.json({token,user:{_id,name,email}})
            }
            else{
                return res.status(422).json({error:"Invalid email or password"})
            }
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/reset-password', (req,res)=>{
crypto.randomBytes(32,(err,buffer)=>{
    if(err){
        console.log(err)
    }
    const token = buffer.toString("hex")
    User.findOne({email:req.body.email})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"User dont exists with that email"})
        }
        user.resetToken = token
        user.expireToken = Date.now() + 3600000
        user.save().then((result)=>{
            transporter.sendMail({
                from:"hellosafarnamaaa@gmail.com",
                to:user.email,
                subject:"Reset Password (no reply) ",
                html:`<p>You requested for password reset</p>
                    <h5>Click on this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>`
            })
            res.json({message:"Check your email!!"})
        })
    })
})
})

router.post('/new-password', (req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
            user.password = hashedpassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save().then((savedUser)=>{
                res.json({message:"Password updated successfully!!"})
            })
        })
    }).catch(err=>{
        console.log(err)
    })
})
module.exports = router