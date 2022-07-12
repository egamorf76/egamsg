const mongoose = require('mongoose');
const User = require("./user");
const Message = require("./message");


const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, "Name already exist"],
        require: [true, "Name must be completed"]
    },
    users: [User.schema],
    messages: [Message.schema],
    pinmessages: [Message.schema]
});

const Room = mongoose.model("room", roomSchema);

module.exports = Room
