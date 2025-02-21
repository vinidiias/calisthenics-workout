const Workout = require('../Models/Workout')
const OutdoorGym = require('../Models/OutdoorGym')

module.exports = {
    async create(req, res) {
        const { title, description, outdoorGym } = req.body
        const { auth } = req.headers

        console.log(title , description, outdoorGym, auth)
        try {
            const outdoorGymExists = await OutdoorGym.findById(outdoorGym)
            if(!outdoorGymExists) {
                return res.status(401).send('Outdoor Gym does not exist')    
            }

            const workoutCreated = await Workout.create({
                title,
                description,
                outdoorGym: outdoorGym,
                creator: auth,
                participants: []
            })

            if(!workoutCreated) {
                return res.status(400).status('Error to create workout', workoutCreated)
            }
            const newWorkout = await workoutCreated.populate('outdoorGym')
            console.log(newWorkout)
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

          console.log(`userID: ${auth} & workoutID: ${id}`)
        
          if (workoutExist.participants.includes(auth)) {
            console.log(`ja inscrito`)
            return res
              .status(400)
              .send("You are already subscribed to this workout");
          }
          
          workoutExist.participants.push(auth)
          workoutExist.save()

          return res.status(200).send({
            message: "You have been subscribed to this workout",
            workout: workoutExist,
          });
        } catch(err) {
            return res.status(500).send({ error: err.message })
        }
    },
    async deleteAll(req, res) {
        try {
            const allWorkouts = await Workout.deleteMany()

            return res.status(200).send('Delete all workouts')
        } catch(err) {
            return res.status(500).send({ error: err.message })
        }
    }
}