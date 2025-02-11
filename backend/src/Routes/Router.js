const { Router } = require('express')

const UserController = require('../Controller/UserController')
const AddressController = require('../Controller/AddressController')
const OutdoorGymController = require('../Controller/OutdoorGymController')
const WorkoutController = require('../Controller/WorkoutController')

const routes = Router()

// User
routes.post('/user', UserController.create)
routes.post('/user/auth', UserController.auth)
routes.get('/user', UserController.getUsers)

// Address
routes.post('/address/create', AddressController.create)
routes.get('/address', AddressController.getAll)

//OutdoorGym
routes.post('/outdoorgym/create', OutdoorGymController.create)
routes.get('/outdoorGym', OutdoorGymController.getAll)

//Workout
routes.post('/workout/create', WorkoutController.create)
routes.get('/workout', WorkoutController.getAll)

module.exports = routes