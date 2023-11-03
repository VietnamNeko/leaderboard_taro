const mongoose = require('mongoose');
const { Schema } = mongoose;

const user = new Schema({
    username: String,
    score: Number
});

module.exports = mongoose.model('users', user);