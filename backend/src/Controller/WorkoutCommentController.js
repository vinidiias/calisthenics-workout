const Workout = require('../Models/Workout');
const User = require('../Models/User');
const WorkoutComment = require('../Models/WorkoutComment');

module.exports = {
  async create(req, res) {
    const { workoutId: workout_id } = req.params;
    const { user_id, comment } = req.body;

    try {
      const workout = await Workout.findById(workout_id);

      if (!workout) {
        return res
          .status(404)
          .json({ data: null, errorMessage: 'Workout not found' });
      }

      const user = await User.findById(user_id);

      if (!user) {
        return res
          .status(404)
          .json({ data: null, errorMessage: 'User not found' });
      }

      if (!comment || comment.trim().length === 0) {
        return res
          .status(400)
          .json({ data: null, errorMessage: 'Invalid comment' });
      }

      const workoutCommentResponse = await WorkoutComment.create({
        user_id,
        workout_id,
        comment,
        likes: [],
      });

      if (!workoutCommentResponse) {
        return res
          .status(500)
          .json({ data: null, errorMessage: 'Error to create comment' });
      }

      return res
        .status(201)
        .json({ data: workoutCommentResponse, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
  async fetchCommentsByWorkout(req, res) {
    const { id } = req.params;

    try {
      const workout = await Workout.findById(id);

      if (!workout) {
        return res
          .status(404)
          .json({ data: null, errorMessage: 'Workout not found' });
      }

      const comments = await WorkoutComment.find()
        .where('workout_id')
        .equals(id);

      if (!comments) {
        return res
          .status(500)
          .json({ data: null, errorMessage: 'Error to fetch comments' });
      }

      return res.status(200).json({ data: comments, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
  async deleteCommentByWorkout(req, res) {
    const { id } = req.params;

    try {
      const comment = await WorkoutComment.findById(id);

      if(!comment) {
        return res
          .status(404)
          .json({ data: null, errorMessage: 'Comment not found ' });
      }

      const commentDeleted = await WorkoutComment.findByIdAndDelete(id);

      if (!commentDeleted) {
        return res
          .status(500)
          .json({ data: null, errorMessage: 'Error to delete comment' });
      }

      return res.status(200).json({ data: commentDeleted, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
};
