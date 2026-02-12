const Workout = require("../Models/Workout");
const User = require("../Models/User");

module.exports = {
  async create(req, res) {
    const { id } = req.params;
    const { auth } = req.headers;

    try {
      const user = await User.findById(auth);

      if (!user) {
        return res.status(401).json({ data: null, errorMessage: "User not found" });
      }

      const workoutExist = await Workout.findById(id);

      if (!workoutExist) {
        return res.status(404).json({ data: null, errorMessage: "Workout not found" });
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

      return res.status(200).json({ data: { workout: workoutExist }, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
  async delete(req, res) {
    const { id } = req.params;
    const { auth } = req.headers;

    try {
      const user = await User.findById(auth);

      if (!user) {
        return res.status(401).json({ data: null, errorMessage: "User not found" });
      }

      const workoutExist = await Workout.findById(id);

      if (!workoutExist) {
        return res.status(404).json({ data: null, errorMessage: "Workout not found" });
      }

      const hasLike = workoutExist.likes.includes(auth);

      if (hasLike) {
        workoutExist.likes = workoutExist.likes.filter(
          (l) => String(l) != String(auth),
        );
      }

      await workoutExist.save();

      return res.status(200).json({ data: { workout: workoutExist }, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
};
