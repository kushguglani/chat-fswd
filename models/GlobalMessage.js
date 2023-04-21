const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema for Users
const GlobalMessageSchema = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    body: {
        type: String
    },
    date: {
        type: String,
        default: Date.now
    }
})
const GlobalMessage = mongoose.model('global_messages', GlobalMessageSchema);
module.exports = GlobalMessage;