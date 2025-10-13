const { Router } = require('express')

const UserController = require('../Controller/UserController')
const AddressController = require('../Controller/AddressController')
const OutdoorGymController = require('../Controller/OutdoorGymController')
const WorkoutController = require('../Controller/WorkoutController')
const MessageController = require('../Controller/MessageController')

const routes = Router()

// User
routes.post('/user', UserController.create)
routes.post('/user/auth', UserController.auth)
routes.post('/user/:userTo', UserController.followUser)
routes.patch('/user/:id', UserController.updateUser)
routes.get('/user', UserController.getUsers)
routes.get('/user/:id', UserController.getUser)
routes.get('/user/:id/followers', UserController.getFollowersByUser)

// Address
routes.post('/address/create', AddressController.create)
routes.get('/address', AddressController.getAll)

//OutdoorGym
routes.post('/outdoorgym/create', OutdoorGymController.create)
routes.get('/outdoorGym', OutdoorGymController.getAll)

//Workout
routes.post('/workout/create', WorkoutController.create)
routes.post('/workout/subscribe', WorkoutController.subscribeToWorkout)
routes.delete('/workout/unsubscribe/:id', WorkoutController.unsubscribeToWorkout)
routes.get('/workout/not-subscribed', WorkoutController.getAllWorkoutNotSubscribed)
routes.get('/workout', WorkoutController.getAll)
routes.get('/workout/subscribed', WorkoutController.getAllWorkoutSubscribed)
routes.delete('/workout/delete', WorkoutController.deleteAll)

//Message
routes.post('/message', MessageController.create)
routes.get('/message/:conversationId', MessageController.getConversationMessages)
routes.patch('/message/read', MessageController.markAsRead)
routes.get('/message/unread/:userId', MessageController.getUnreadCount)

module.exports = routes