const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  avator: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  address: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
