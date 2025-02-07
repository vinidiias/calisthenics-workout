const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    rua: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    complement: {
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