const Workout = require('../Models/Workout')
const OutdoorGym = require('../Models/OutdoorGym');
const User = require('../Models/User');

async function markExpiredWorkouts() {
    const now = new Date();
    
    try {
      await Workout.updateMany(
        { expiresAt: { $lt: now }, isExpired: false }, // Treinos expirados ainda não marcados
        { $set: { isExpired: true } } // Marca como expirado
      );
    } catch (error) {
      console.error("Erro ao atualizar treinos expirados:", error);
    }
}

// Roda essa função a cada 10 minutos
setInterval(markExpiredWorkouts, 60 * 1000);

module.exports = {
    async create(req, res) {
        const { title, description, outdoorGym, date } = req.body
        const { auth } = req.headers

        try {
            const user = await User.findById(auth)

            if (!user) {
              return res.status(401).json({ message: "User not found" });
            }

            const outdoorGymExists = await OutdoorGym.findById(outdoorGym)

            if(!outdoorGymExists) {
                return res.status(401).send('Outdoor Gym does not exist')    
            }

            const workoutCreated = await Workout.create({
                title,
                description,
                outdoorGym: outdoorGym,
                creator: auth,
                participants: [],
                date: date
            })

            if(!workoutCreated) {
                return res.status(400).status('Error to create workout', workoutCreated)
            }

            user.history.push(workoutCreated._id)
            await user.save()

            const newWorkout = await workoutCreated.populate('outdoorGym')
            return res.status(201).send(newWorkout)

        } catch(err) {
            return res.status(500).send({ message: err.message })
        }
    },
    async getAll(req, res) {
        try {
            const allWorkouts = await Workout.find().populate([
                { path: 'creator', select: '-password'},
                { path: 'outdoorGym'},
            ])

            if(allWorkouts.lenght === 0) {
                return res.status(204).send('No workouts found')
            }

            return res.status(200).send(allWorkouts)
        } catch(err) {
            return res.status(500).send({ error: err.message })
        }
    },
    async getAllWorkoutNotSubscribed(req, res) {
        const { auth } = req.headers

        try {
            const workoutNotSubscribed = await Workout.find({
              participants: { $nin: [auth] },
              isExpired: false
            }).populate([
              { path: "creator", select: "-password" },
              { path: "outdoorGym" },
              { path: "participants", select: "-password" }
            ]);
            if(workoutNotSubscribed.length === 0) {
                console.log('No workouts found')
                return res.status(204).send('No workouts found')
            }
            return res.status(200).send(workoutNotSubscribed)
        } catch(err) {
            return res.status(500).send({ error: err.message })
        }
    },
    async getAllWorkoutSubscribed(req, res) {
        const { auth } = req.headers
        try {
            const workoutNotSubscribed = await Workout.find({
              participants: { $in: [auth] },
              isExpired: false
            }).populate([
              { path: "creator", select: "-password" },
              { path: "outdoorGym" },
              { path: "participants", select: "-password" }
            ]);
            if(workoutNotSubscribed.length === 0) {
                console.log('No workouts found')
                return res.status(204).send('No workouts found')
            }
            return res.status(200).send(workoutNotSubscribed)
        } catch(err) {
            return res.status(500).send({ error: err.message })
        }
    },
    async subscribeToWorkout(req, res) {
        const { id }  = req.body
        const { auth } = req.headers
        try {
          const workoutExist = await Workout.findById(id);
          if (!workoutExist) {
            return res.status(404).send("Workout not found");
          }
        
          if (workoutExist.participants.includes(auth)) {
            return res
              .status(400)
              .send("You are already subscribed to this workout");
          }
          
          workoutExist.participants.push(auth)
          await workoutExist.save()

          return res.status(200).send({
            message: "You have been subscribed to this workout",
            workout: workoutExist,
          });
        } catch(err) {
            return res.status(500).send({ error: err.message })
        }
    },
    async unsubscribeToWorkout(req, res) {
        const { id } = req.params
        const { auth } = req.headers

        console.log(id, auth)

        try {
            const workoutExist = await Workout.findById(id)
            if (!workoutExist) {
                return res.status(404).send('Workout not found')
            }

            if(!workoutExist.participants.includes(auth)) {
                return res
                  .status(400)
                  .send("You are not subscribed to this workout");
            }

            workoutExist.participants = workoutExist.participants.filter(participant => String(participant._id) !== String(auth))
            await workoutExist.save()

            return res.status(200).send({
                message: 'Unsubscribed succesfully!',
                workout: workoutExist
            })
        } catch(err) {
            return res.status(500).send({ error: err.message })
        }
    },
    async deleteAll(req, res) {
        try {
            await Workout.deleteMany()

            return res.status(200).send('Delete all workouts')
        } catch(err) {
            return res.status(500).send({ error: err.message })
        }
    }
}