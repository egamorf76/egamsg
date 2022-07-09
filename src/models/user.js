const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        require: [true, "Login must be completed"],
        unique: [true, "Login already exist"],
        maxLength: [38, "Login must be less than 38 characters"] 
    },
    password: {
        type: String,
        require: [true, "Password must be completed"]
    },
    password2: {
        type: String,
        require: [true, "Second password must be completed"]
    },
    lastconn: {
        type: String,
        require: false,
        minLength: 24,
        maxLength: 24,
        validate(value) {
            var iso8601 = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;
            if (!iso8601.test(value)) {
                throw new Error("Invalid date format")
            }
        }
    }
});

const User = mongoose.model("user", userSchema);

module.exports = User
