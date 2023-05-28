const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    id: { type: ObjectId },
    fullname: { type: String },
    username: { type: String },
    password: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    role: { type: Number, default: 1 }
});

module.exports = mongoose.model.user || mongoose.model('user', userSchema);