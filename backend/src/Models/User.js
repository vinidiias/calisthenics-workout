const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    photo: {
        type: String,
        required: true
    },
    backgroundPhoto: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    biography: {
        type: String,
        default: ''
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    history: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Workout'
    }],
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', Schema)