const User = require("../models/user");
const config = require("../config/config").get(process.env.NODE_ENV);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fixsalt = 10;

exports.signup = function (req, res) {
    var newuser = new User(req.body);

    if (newuser.password != newuser.password2) {
        return res.status(400).json({message: "Password not match"});
    }

    User.findOne({login: newuser.login}, function(err,user) {
        if (user) {
            return res.status(400).json({message: "Login exits"});
        }
    });
    
    var salt = bcrypt.genSaltSync(fixsalt);
    var hash = bcrypt.hashSync(newuser.password, salt);
    newuser.password2 = newuser.password = hash;

    newuser.save(function (err,doc) {
        if (err) {
            console.log(err);
            return;
        }
        res.status(200).json({ user: doc });
    });
}

exports.signin = function (req, res) {
    User.findOne({ login: req.body.login }, function (err, user) {
        if (err) {
            console.log(err);
            return;
        }

        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }

        var valid = bcrypt.compareSync(req.body.password, user.password);
        
        if (!valid) {
            res.status(401).json({ message: "Password incorrect" });
            return;
        }

        user.lastconn = new Date().toISOString();
        user.save(function (err,doc) {
            if (err) {
                console.log(err);
                return;
            }
        });
        
        var token = jwt.sign({ userid: user._id.toHexString() }, config.SECRET, { expiresIn: config.EXPIRE * 60 });

        res.status(200).json({
            userid: user._id.toHexString(),
            token: token
        });
    });
}