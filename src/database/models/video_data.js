const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
   video_id: { type: String, required: true },
   uploaded_by: { type: String, required: true },
   date: { type: String, required: true },
   likes: { type: Number, required: true },
   saved: { type: Number, required: true },
   description: { type: String, required: true },
   matrix: { type: Number, required: true },
});

const UserData = module.exports = mongoose.model('UserData', UserSchema);