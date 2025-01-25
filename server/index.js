const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('./models/userSchema')
const nodemailer = require('nodemailer')
const blogModel = require('./models/blogSchema')
const commentModel = require('./models/commentScheme')

dotenv.config()
const app=express()
app.use(express.json())
app.use(cors())

mongoose
.connect(process.env.MONGODB_URL)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error(err))

const sendVerificationEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port:587,
        auth: {
            user: process.env.SMTP_USER, 
            pass: process.env.SMTP_PASS 
        }
    });
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Email Verification for Blog Management',
        text: `Your OTP for email verification is: ${otp}`
    };

    try {
        await transporter.sendMail(mailOptions)
        return {success:true}
    } catch (error) {
        console.error('Error sending email:', error)

        if (error.response && error.response.includes('550 5.1.1')) {
            return {success:false, message:'Invalid email address'}
        }

        return {success:false, message:'Failed to send email. Please try again.'}
    }
}

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token){
    return res.json({error:'Access denied. No token provided.'})
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userModel.findById(decoded.id)

    if (!user || !user.isAccountVerified){
      return res.json({error:'Email verification required.'})
    }

    req.user = decoded

    next()
  } catch (error) {
    res.json({error:'Invalid token.'})
  }
}

function roleMiddleware(role) {
  return async(req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userModel.findById(decoded.id)
    if (!user || user.role !== role) {
      return res.json({error: 'Access denied.'})
    }
    next()
  }
}

app.post('/signup', async(req,res) => {

    const {name,userName,email,password} = req.body
    const existingUser = await userModel.findOne({userName})
    const existingEmail = await userModel.findOne({ email }) 

    try{
        if(existingUser){
            return res.json({success:'false', message:'User already exists'})
        }

        if (existingEmail) {
            return res.json({success:'false', message:'Email already exists'})
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        const otpExpireAt = Date.now() + 10 * 60 * 1000

        const user = new userModel({name, userName, email, password:hashedPassword, verifyOtp:otp, verifyOtpExpireAt:otpExpireAt})

        const emailResult = await sendVerificationEmail(email, otp)

        if (!emailResult.success) {
            return res.json({success:'false', message:emailResult.message})
        }

        await user.save()

        const token=jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'})

        return res.json({ success: 'true', message: 'OTP sent to email. Please verify.', token:token})

    }catch(error){
        res.json({success:'false',message:error.message})
    }
})

app.post('/login', async(req,res) => {

    const {userName, password} = req.body

    try{
        const user = await userModel.findOne({userName})

        if(!user){
            return res.json({success:'false',message:'Invalid username'})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect){
            return res.json({success:'false',message:'Invalid username'})
        }

        const token=jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'})

        return res.json({success:'true', token:token})

    }catch(error){
        res.json({success:'false',message:error.message})
    }
})

app.post('/verify-email',async(req, res) => {

    const { email, otp } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.json({success:'false', message:'User not found'})
    }

    if (user.verifyOtp !== otp) {
        return res.json({success:'false', message:'Invalid OTP'});
    }

    if (user.verifyOtpExpireAt < Date.now()) {
        return res.json({success:'false', message:'OTP has expired'})
    }

    user.isAccountVerified = true
    user.verifyOtp = ''
    user.verifyOtpExpireAt=0
    await user.save()

    return res.json({success:'true', message:'Email verified successfully'})
});

app.get('/blogs',authMiddleware,async(req,res)=>{
    try{
        const data = await blogModel.find({})
        return res.json({success:'true',data:data})
    }catch(error){
        return res.json({success:'false',message:error})
    }
})

app.get('/user',async(req,res)=>{
    const token = req.headers.authorization?.split(' ')[1]
    if (!token){
        return res.status(401).json({error:'Access denied. No token provided.'})
    }

     try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.id)

        if (!user || !user.isAccountVerified){
        return res.status(403).json({error:'Email verification required.'})
        }

        return res.json({success:'true',data:user})
    } catch (error) {
        res.status(400).json({error:'Invalid token.'})
    }
})

app.get('/blogs/:id',async(req,res)=>{
    try{
        const blog = await blogModel.findById(req.params.id)
        if(!blog){
            return res.json({success:'false',message:'Blog Not Found'})
        }
        return res.json({success:'true',data:blog})
    }catch(error){
        return res.json({success:'false',message:error})
    }
})

app.delete('/blogs/:id',authMiddleware,roleMiddleware('Admin'),async(req,res)=>{
    try{
        await blogModel.deleteOne({_id:req.params.id})
        return res.json({success:'true',message:'successfully Deleted'})
    }catch(error){
        return res.json({success:'false',message:'failed delete blog'})
    }
})

app.put('/blogs/:id',authMiddleware,roleMiddleware('Admin'),async(req,res)=>{
    const {title, content} = req.body
    try{
        const blog = await blogModel.findById(req.params.id)
        const filter = {_id: req.params.id}
        const update = {$set: {title:title!==blog.title?title:blog.title,
            content:content!==blog.content?content:blog.content}}

        await blogModel.updateOne(filter, update)
        return res.json({success:'true',message:'updated successfully'})
    }catch(error){
        return res.json({success:'false',message:error})
    }
})

app.post('/:id/comments', authMiddleware, async(req,res)=>{
    try {
        const { id } = req.params
        const { content } = req.body

        if (!content) {
            return res.json({message:'Content is required.'})
        }

        const comment = new commentModel({content:content, blog:id, user: req.user.userName})

        await comment.save()
        res.json({success:'true',message:'Comment added successfully.',comment})
    } catch (error) {
        res.json({success:'false',message:'Error adding comment.',error: error.message})
    }
})

app.delete('/comments/:commentId', authMiddleware, async(req,res)=>{
    try {
        const { commentId } = req.params

        const comment = await commentModel.findById(commentId)
        if (!comment) {
            return res.json({success:'false',message:'Comment not found.'})
        }

        if (comment.user.toString() !== req.user.id) {
            return res.json({success:'false',message:'You can only delete your own comments.'})
        }

        await comment.deleteOne()
        res.json({success:'true',message:'Comment deleted successfully.'})
    } catch (error) {
        res.json({message:'Error deleting comment.', error: error.message})
    }
})

app.get('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params

        const comments = await commentModel.find({ blog:id })
        if (!comments.length) {
            return res.json({
                success: true,
                message: 'No comments found.',
                data: []
            })
        }

        res.json({success:'true', message:'Comments fetched successfully.',data:comments});
    } catch (error) {
        res.json({success:'false',message:'Error fetching comments.', error: error.message });
    }
})

app.post('/blogs',authMiddleware,roleMiddleware('Admin'),async(req,res)=>{
    const {title,content} = req.body
    try{
        const blog = new blogModel({title:title, content:content})
        await blog.save()
        return res.json({success:'true',message:"Add Blog Successfully"})
    }catch(error){
        return res.json({success:'false',message:error})
    }
})

app.listen(process.env.PORT || 3001, () => console.log(`Server running on port ${process.env.PORT}`))
