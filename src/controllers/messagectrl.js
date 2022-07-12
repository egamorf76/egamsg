const config = require("../config/config").get(process.env.NODE_ENV);
const User = require("../models/user");
const Message = require("../models/message");
const Room = require("../models/room")
const roomctrl = require("./roomctrl");
const jwt = require("jsonwebtoken");
const WebSocket = require("ws");

// const wss = new WebSocket.Server({ noServer: true })

// wss.on('connection', function (ws, req, client) {
//     ws.send(JSON.stringify({
//         author: 0,
//         time: new Date().toJSON(),
//         message: "Bienvenue",
//     }));

//     ws.on('message', function (data, isBinary) {
//         wss.clients.forEach(function (client) {
//             if (client.readyState === WebSocket.OPEN) {
//                 client.send(data, { binary: isBinary });
//             }
//         });
//     })
// });

// exports.upgradeWs = function (req, socket, head) {
//     try {
//         const token = req.headers.authorization.split(' ')[1];
//         jwt.verify(token, config.SECRET, function (err, decoded) {
//             if (err) {
//                 throw err;
//             }
//             req.auth = decoded
//             console.log(decoded);
//         });

//         wss.handleUpgrade(req, socket, head, socket => {
//             wss.emit('connection', socket, req);
//         });
//     } catch(err) {
//         socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
//         socket.destroy();
//         return;
//     }
// }

// Send message to clients :
// At connection: { userid: "id", connected: true }
// On client send message, send to all: 
// { 
//     _id: "id"
//     text: "text"
//     user: new User()
//     date: "date"
//     path: "path"
// }
// Received message at format :
// From cient:
// {
//     text: "text",
//     date: "date"
// }
exports.onconnectionws = function onconnectionws(room) {
    room.wss.on('connection', function (ws, req, client) {
        room.wss.clients.forEach(function (client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    userid: req.auth.userid,
                    connect: true
                }), { binary: false });
            }
        });
        ws.on('message', function (data, isBinary) {
            var msg = JSON.parse(data); 
            User.findById(req.auth.userid, function(err, doc) {
                if (err) {
                    console.log(err);
                    return;
                }
                newmessage = new Message({
                    text: msg.text,
                    date: msg.date,
                    user: doc
                });
                room.wss.clients.forEach(function (client) {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(newmessage), { binary: false });
                    }
                });
                newmessage.save()
                Room.findByIdAndUpdate(room._id, { $push: { messages: newmessage } }, function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        });
    });
}

// Upgrade http request to web socket
// Check token if valid
exports.upgradeWs2 = function (req, socket, head) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, config.SECRET, function (err, decoded) {
            if (err) {
                throw err;
            }
            req.auth = { userid: decoded.userid };
        });

        rooms = roomctrl.getrooms();
        var valid = false;
        for (const room of rooms) {
            for (const user of room.users) {
                if (user._id.toHexString() == req.auth.userid) {
                    valid = true;
                    break;
                }
            }
        }
        if (!valid) {
            throw "User not in the room"
        }

        for (const room of rooms) {
            if ("/" + room._id.toHexString() == req.url) {
                room.wss.handleUpgrade(req, socket, head, socket => {
                    room.wss.emit('connection', socket, req);
                });
                return;
            }
            socket.write('HTTP/1.1 400 Not found\r\n\r\n');
            socket.destroy();
        }
    } catch(err) {
        console.log(err)
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    }
}

exports.createfile = function (req, res, next) {

}