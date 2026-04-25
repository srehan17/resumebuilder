const mongoose = require('mongoose')

const profileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: [true, 'Please add your name']
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    email: {
        type: String,
    },
    location: {
        type: String,
    },
    linkedIn: {
        type: String,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Profile', profileSchema)
