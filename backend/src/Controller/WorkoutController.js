const Workout = require('../Models/Workout');
const OutdoorGym = require('../Models/OutdoorGym');
const User = require('../Models/User');
const WorkoutComment = require('../Models/WorkoutComment');
const { default: mongoose } = require('mongoose');

async function markExpiredWorkouts() {
  const now = new Date();

  try {
    await Workout.updateMany(
      { expiresAt: { $lt: now }, isExpired: false },
      { $set: { isExpired: true } },
    );
  } catch (error) {
    console.error('Erro ao atualizar treinos expirados:', error);
  }
}

setInterval(markExpiredWorkouts, 30 * 1000);

module.exports = {
  async create(req, res) {
    const { title, description, outdoorGym, date } = req.body;
    const { auth } = req.headers;

    try {
      const user = await User.findById(auth);

      if (!user) {
        return res.status(404).json({ data: null, errorMessage: "User not found" });
      }

      const outdoorGymExists = await OutdoorGym.findById(outdoorGym);

      if (!outdoorGymExists) {
        return res.status(404).json({ data: null, errorMessage: "Outdoor Gym does not exist" });
      }

      const today = new Date();
      const workoutDate = new Date(date);
      
      if(workoutDate.getTime() < today.getTime()) {
        return res.status(400).json({ data: null, errorMessage: "Workout date is earlier than the actual date."})
      }

      const workoutCreated = await Workout.create({
        title,
        description,
        outdoorGym: outdoorGym,
        creator: auth,
        participants: [],
        likes: [],
        date: date,
      });

      if (!workoutCreated) {
        return res
          .status(400)
          .json({ data: null, errorMessage: "Error to create workout" });
      }

      await user.save();

      const newWorkout = await workoutCreated.populate("outdoorGym");
      return res.status(201).json({ data: newWorkout, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
  async patchWorkout(req, res) {
    const { id } = req.params;
    const { auth } = req.headers;
    const { title, description, outdoorGym, date } = req.body;

    try {
      const workout = await Workout.findById(id);

      if (!workout) {
        return res
          .status(404)
          .json({ data: null, errorMessage: "Workout not found" });
      }

      if (String(workout.creator) !== String(auth)) {
        return res
          .status(403)
          .json({ data: null, errorMessage: "Only the creator can edit this workout" });
      }

      if (title) workout.title = title;
      if (description) workout.description = description;
      if (outdoorGym) workout.outdoorGym = outdoorGym;
      if (date) workout.date = date;

      await workout.save();

      const updated = await workout.populate("outdoorGym");
      return res.status(200).json({ data: updated, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
  async getWorkouts(req, res) {
    const { subscribed, creator, hasComments } = req.query;
    const { auth } = req.headers;

    try {
      const filter = {};
      const populateOptions = [
        { path: "creator" },
        { path: "participants" },
        { path: "outdoorGym" },
      ];

      if (subscribed === "true") {
        filter.participants = { $in: [auth] };
        filter.isExpired = false;
        populateOptions.push({ path: "participants", select: "-password" });
      } else if (subscribed === "false") {
        filter.participants = { $nin: [auth] };
        filter.isExpired = false;
        populateOptions.push({ path: "participants", select: "-password" });
      }

      if (creator) {
        filter.creator = creator;
      }

      let workouts = await Workout.find(filter).populate(populateOptions);

      if (hasComments === "true") {
        const workoutIds = workouts.map((w) => w._id);
        const comments = await WorkoutComment.find({ workout_id: { $in: workoutIds } });

        workouts = workouts.map((w) => {
          const commentsCount = comments.filter((c) => c.workout_id.equals(w._id)).length;
          return { ...w.toObject(), commentsCount };
        });
      }

      return res.status(200).json({ data: workouts, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
  async getAllWorkoutByUser(req, res) {
    const { id } = req.body;

    try {
      const user = await User.findById(id);

      if (!user) {
        return res
          .status(404)
          .json({ data: null, errorMessage: "User not found" });
      }

      const workouts = await Workout.find().where("creator").equals(id);

      if (!workouts) {
        return res
          .status(400)
          .json({
            data: null,
            errorMessage: "Error to fetch workouts by user",
          });
      }

      return res.status(200).json({ data: workouts, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
  async getWorkoutHistoryByUser(req, res) {
    const { id } = req.params;

    try {
      const user = await User.findById(id);

      if (!user) {
        return res
          .status(404)
          .json({ data: null, errorMessage: "User not found" });
      }

      const workouts = await Workout.find()
        .where("creator")
        .equals(id)
        .populate({ path: "outdoorGym" });

      const comments = await WorkoutComment.find().where("user_id").equals(id);
      if (!workouts) {
        return res
          .status(400)
          .json({ data: null, errorMessage: "Error to fetch workouts" });
      }

      if (!comments) {
        return res
          .status(400)
          .json({ data: null, errorMessage: "Error to fetch comments" });
      }

      const data = workouts.map((w) => {
        const commentsCount = comments.filter((c) =>
          c.workout_id.equals(w._id),
        );
        return {
          ...w.toObject(),
          commentsCount: commentsCount.length,
        };
      });

      return res.status(200).json({ data, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
  async deleteWorkout(req, res) {

  },
  async deleteAllWorkouts(req, res) {
    try {
      await Workout.deleteMany();

      return res.status(204).send();
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
  async subscribeToWorkout(req, res) {
    const { id } = req.params;
    const { auth } = req.headers;
    try {
      const userExist = await User.findById(auth);
      if(!userExist) {
        return res
          .status(404)
          .json({ data: null, errorMessage: "User not found" });
      }

      const workoutExist = await Workout.findById(id);
      if (!workoutExist) {
        return res
          .status(404)
          .json({ data: null, errorMessage: "Workout not found" });
      }

      if (workoutExist.participants.some(p => String(p) === String(auth))) {
        return res
          .status(409)
          .json({
            data: null,
            errorMessage: "You are already subscribed to this workout",
          });
      }

      workoutExist.participants.push(auth);
      await workoutExist.save();

      return res
        .status(201)
        .json({ data: { workout: workoutExist }, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
  async unsubscribeToWorkout(req, res) {
    const { id } = req.params;
    const { auth } = req.headers;

    try {
      const workoutExist = await Workout.findById(id);
      if (!workoutExist) {
        return res
          .status(404)
          .json({ data: null, errorMessage: "Workout not found" });
      }

      if (!workoutExist.participants.some(p => String(p) === String(auth))) {
        return res
          .status(400)
          .json({
            data: null,
            errorMessage: "You are not subscribed to this workout",
          });
      }

      workoutExist.participants = workoutExist.participants.filter(
        (participant) => String(participant._id) !== String(auth),
      );

      await workoutExist.save();

      return res
        .status(200)
        .json({ data: { workout: workoutExist }, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
  async postCommentWorkout(req, res) {
    const { id } = req.params;
    const { auth } = req.headers;

    try {
      const workoutExist = await Workout.findById(id);

      if (!workoutExist) {
        return res
          .status(404)
          .json({ data: null, errorMessage: "Workout not found" });
      }

      const hasLike = workoutExist.likes.includes(auth);

      if (hasLike) {
        workoutExist.likes = workoutExist.likes.filter(
          (l) => String(l) != String(auth),
        );
      } else {
        workoutExist.likes.push(auth);
      }

      await workoutExist.save();

      return res
        .status(200)
        .json({ data: { workout: workoutExist }, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
  async patchLikeWorkout(req, res) {
    const { id } = req.params;
    const { user_id } = req.body;

    try {
      const workout = await Workout.findById(id);

      if (!workout) {
        return res
          .status(404)
          .json({ data: null, errorMessage: "Workout not found" });
      }

      const index = workout.likes.findIndex(l => String(l) === String(user_id));

      if(index === -1) {
        workout.likes.push(mongoose.Types.ObjectId.createFromHexString(user_id));
      } else {
        workout.likes = workout.likes.filter(
          (l) => String(l) !== String(user_id),
        );
      }

      await workout.save();

      return res
        .status(200)
        .json({ data: { workout }, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
};