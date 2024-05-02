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

  router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
        return res.status(422).json({ error: "Please add all the fields." });
    }
    try {
        const savedUser = await User.findOne({ email: email });
        if (savedUser) {
            return res.status(422).json({ error: "User already exists." });
        }
        const hashedpassword = await bcrypt.hash(password, 12);
        const user = new User({
            email,
            password: hashedpassword,
            name
        });
        await user.save();
        await sendWelcomeEmail(user.email);
        res.json({ message: "Saved Successfully." });
    } catch (error) {
        console.error("Error during user registration:", error);
        return res.status(500).json({ error: "An error occurred during user registration. Please try again later." });
    }
});

// Function to send welcome email
async function sendWelcomeEmail(email) {
    try {
        await transporter.sendMail({
            from: "hellosafarnamaaa@gmail.com",
            to: email,
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
    } catch (error) {
        console.error("Error sending welcome email:", error);
        throw error;
    }
}


router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Please provide both email and password" });
    }
    try {
        const savedUser = await User.findOne({ email: email });
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid email or password" });
        }
        const doMatch = await bcrypt.compare(password, savedUser.password);
        if (doMatch) {
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            const { _id, name, email } = savedUser;
            return res.json({ token, user: { _id, name, email } });
        } else {
            return res.status(422).json({ error: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Error during user signin:", error);
        return res.status(500).json({ error: "An error occurred during user signin. Please try again later." });
    }
});


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