const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
   uuid: { type: String, required: true },
   email: { type: String, required: true },
   username: { type: String, required: true },
   password: { type: String, required: true },
   profile_picture: { type: String, required: true },
   settings: { type: Array, required: true },
   posts: { type: Array, required: false },
   clips: { type: Array, required: false },
   saved: { type: Array, required: false },
   liked: { type: Array, required: true },
   comments: { type: Array, required: true },
   theme: { type: Array, required: true }
});

const UserData = module.exports = mongoose.model('UserData', UserSchema);