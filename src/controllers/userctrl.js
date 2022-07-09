const User = require("../models/user")

exports.getuser = function(req, res) {
    User.findById(req.params.id, function (err, user) {
        res.status(200).json(user)
    })
}