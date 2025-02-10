const { Router } = require('express')

const UserController = require('../Controller/UserController')
const AddressController = require('../Controller/AddressController')

const routes = Router()

// User
routes.post('/user', UserController.create)
routes.post('/user/auth', UserController.auth)

// Address
routes.post('/address/create', AddressController.create)
routes.get('/address', AddressController.getAll)

module.exports = routes