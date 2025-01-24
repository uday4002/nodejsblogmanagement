const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    userName:{type:String, required:true},
    email:{type:String, require:true, unique: true },
    password:{type:String, require:true},
    role: {type:String, enum:['Admin', 'Editor', 'User'], default:'User'},
    verifyOtp:{type:String, default:''},
    verifyOtpExpireAt:{type:Number, default:0},
    isAccountVerified:{type:Boolean, default:false}
})

const userModel = mongoose.models.user || mongoose.model('user',userSchema)

module.exports = userModel