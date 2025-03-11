const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    street: {
        type: String,
        required: true
    },
    neighborhood: {
        type: String,
        required: true
    },
    cep: {
        type: String,
        required: true
    },
    city: {
        type: String, 
        required: true
    },
    state: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Address', Schema)