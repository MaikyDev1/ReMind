const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
   user_id: { type: String, required: true },
   posted_by: { type: String, required: true },
   post_date: { type: String, required: true },
   game: { type: String, required: true },
   likes: { type: [String], required: true },
   comments: { type: Array, required: true },
   content: { type: Array, required: true }
});

const UserData = module.exports = mongoose.model('posts-data', UserSchema);