const mongoose = require('mongoose')

const BlogSchema = new mongoose.Schema({
    title:{type:String, required:true},
    content:{type:String, required:true},
    author:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
    assignedEditor:{type: mongoose.Schema.Types.ObjectId, ref:'user', default:null},
})

const blogModel = mongoose.models.blog || mongoose.model('blog',BlogSchema)

module.exports = blogModel