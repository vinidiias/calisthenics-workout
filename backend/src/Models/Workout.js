const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    outdoorGym: {
        type: mongoose.Schema.Types.ObjectId, ref: 'OutdoorGym', required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }]
})

module.exports = mongoose.model('Workout', Schema)