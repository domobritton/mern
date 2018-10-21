const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    text: {
        type: String,
        required: true 
    },
    name: {
        type: String,

    },
    date: {
        type: Date,
        default: Date.now 
    }
});

const Event = mongoose.model('event', EventSchema);

module.exports = Event;