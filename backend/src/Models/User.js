const mongoose = require('mongoose')

const Schema = mongoose.Schema({
  photo: {
    type: String,
    required: true,
  },
  backgroundPhoto: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    street: {
      type: String,
      default: "",
    },
    number: {
      type: String,
      default: "",
    },
    neighborhood: {
      type: String,
      default: "",
    },
    zipCode: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
  },
  biography: {
    type: String,
    default: "",
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  history: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workout",
    },
  ],
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', Schema)