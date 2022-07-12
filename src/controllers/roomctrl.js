const WebSocket = require("ws");
const Room = require("../models/room");
const User = require("../models/user");
const messagectrl = require("./messagectrl");

var rooms = Array();

// Instance room for WSS
Room.find({}, function (err, docs) {
    if (err) {
        console.log(err);
        return;
    }
    if (!docs) {
        return;
    }
    for (const doc of docs) {
        var room = createroomsws(doc)
        rooms.push(room);
        messagectrl.onconnectionws(room)
    }
})

// Getter to export
function getrooms() {
    return rooms;
}
exports.getrooms = getrooms;

// Reformat of room
function createroomsws(room) {
    return {
        _id: room._id,
        name: room.name,
        users: room.users,
        messages: room.messages,
        pinmessages: room.pinmessages,
        wss: new WebSocket.Server({ noServer: true })
    };
}

// Create a room
exports.createroom = function(req, res, next) {
    var newroom = new Room({
        name: req.body.name
    });

    Room.findOne({ name: newroom.name }, function(err, doc) {
        if (err) {
            console.log(err);
            next();
            return
        }
        if (doc) {
            return res.status(400).json({message: "Name already exits"});
        }
    });

    User.findById(req.auth.userid, function(err, doc) {
        if (err) {
            console.log(err);
            next();
            return;
        }

        newroom.users = Array(doc);
        newroom.save(function (err, doc2) {
            if (err) {
                console.log(err);
                return;
            }
            res.status(200).json(doc2);

            var room = createroomsws(doc)
            rooms.push(room);
            messagectrl.onconnectionws(room);
        });
    })
}

// Get a room
exports.readrooms = function(req, res, next) {
    Room.find({}, function (err, docs) {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.status(400).json(docs);
    })
}

exports.updateroom = function(req, res, next) {
    
}

exports.deleteroom = function(req, res, next) {
    
}