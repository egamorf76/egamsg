const mongoose = require('mongoose');
const User = require("./user");

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        require: false,
        maxLength: 248
    },
    path: {
        type: String,
        require: false
    },
    date: {
        type: String,
        require: true,
        minLength: 24,
        maxLength: 24,
        validate(value) {
            var iso8601 = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;
            if (!iso8601.test(value)) {
                throw new Error("Invalid date format")
            }
        }
    },
    user: {
        type: User.schema,
        require: true
    }
});

const Message = mongoose.model("message", messageSchema);

module.exports = Message
