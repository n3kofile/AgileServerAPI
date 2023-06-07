const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const reservationSchema = new Schema({
    reservationId: { type: ObjectId },
    tablePosition: { type: String },
    fullName: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    menuItemsSelected: [{ type: Object }]
});

module.exports = mongoose.model.reservation || mongoose.model('reservation', reservationSchema);