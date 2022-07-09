const User = require("../models/user")

exports.readuser = function(req, res) {
    User.findById(req.params.id, function (err, user) {
        res.status(200).json({
            _id: user._id,
            login: user.login,
            lastconn: user.lastconn
        })
    })
}