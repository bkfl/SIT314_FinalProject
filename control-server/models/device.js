const mongoose = require('mongoose')

module.exports = mongoose.model('Device', new mongoose.Schema({
    'nodeId': String,
    'name': String,
    'location': String,
    'currentState': Boolean,
    'requestedState': Boolean
}))