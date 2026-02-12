const mongoose = require('mongoose');

const WorkoutCommentSchema = new mongoose.Schema({
  workout_id: {
    type: mongoose.Types.ObjectId,
    ref: "Workout",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  comment: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('WorkoutComment', WorkoutCommentSchema);
