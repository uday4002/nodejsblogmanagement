const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
  content:{type:String, required:true},
  blog: {type:mongoose.Schema.Types.ObjectId, ref:'blog'},
  user: {type:mongoose.Schema.Types.ObjectId, ref:'user'},
})

const commentModel = mongoose.models.comment || mongoose.model('comment',CommentSchema)

module.exports = commentModel