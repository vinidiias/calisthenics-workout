const mongoose = require("mongoose");

const Comment = new mongoose.Schema({
  senderId: { type: mongoose.Schema.ObjectId, ref: "User" },
  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  comment: { type: String },
});

module.exports = mongoose.model("Comment", Comment);
