const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  photo: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
});

module.exports = mongoose.model("OutdoorGym", Schema);
