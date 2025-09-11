const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userId: Number,
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // store hashed in production
  },
  { versionKey: false }    //Disables the __v field that Mongoose normally adds for versioning.
);

// force collection name to be "users"
const User = mongoose.model('User', userSchema, 'users');  

module.exports = User;
