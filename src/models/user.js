const mongoose = require('mongoose');
const { Schema } = mongoose;

const user = new Schema({
    username: String,
    score: Number,
    playerID: Number // you may want to give unique IDs to players ingame in case multiple players have the same name
});

module.exports = mongoose.model('users', user);