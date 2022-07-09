const config = require("../config/config").get(process.env.NODE_ENV);
const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, config.SECRET, function (err, decoded) {
            if (err) {
                res.status(401).json(err);
                return;
            }
            req.auth = { userid: decoded.userid };
            next();
        });
};