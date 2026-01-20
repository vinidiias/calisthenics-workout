const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  outdoorGym: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OutdoorGym",
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  date: { type: Date, required: true },
  expiresAt: { type: Date },
  isExpired: { type: Boolean, default: false },   
});

// Atualiza `expiresAt` ao salvar
WorkoutSchema.pre('save', function(next) {
    if (this.date) {
        this.expiresAt = new Date(this.date.getTime() +  60 * 1000);
    }
    next();
});

module.exports = mongoose.model('Workout', WorkoutSchema);
