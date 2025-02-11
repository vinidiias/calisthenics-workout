const Workout = require('../Models/Workout')
const OutdoorGym = require('../Models/OutdoorGym')

module.exports = {
    async create(req, res) {
        const { title, description, outdoorGym } = req.body
        const { auth } = req.headers

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

            return res.status(201).send(workoutCreated)

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
    }
}