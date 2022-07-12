const User = require("../models/user")

exports.readuser = function(req, res) {
    User.findById(req.auth, function (err, user) {
        res.status(200).json({
            _id: user._id,
            login: user.login,
            lastconn: user.lastconn
        })
    })
}

exports.updateuser = function(req, res, next) {

}

exports.deleteuser = function(req, res, next) {
    
}