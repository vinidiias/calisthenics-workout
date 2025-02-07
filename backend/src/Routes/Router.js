const { Router } = require('express')

const UserController = require('../Controller/UserController')

const routes = Router()

routes.post('/user', UserController.create)
routes.post('/user/auth', UserController.auth)

module.exports = routes