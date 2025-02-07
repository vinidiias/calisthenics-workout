const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true
    }
})

module.exports = mongoose.model('OutdoorGym', Schema)