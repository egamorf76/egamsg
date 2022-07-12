const config = require("../config/config").get(process.env.NODE_ENV);
const roomctrl = require("./roomctrl");
const jwt = require("jsonwebtoken");
const WebSocket = require("ws");

const wss = new WebSocket.Server({ noServer: true })

wss.on('connection', function (ws, req, client) {
    ws.send(JSON.stringify({
        author: 0,
        time: new Date().toJSON(),
        message: "Bienvenue",
    }));

    ws.on('message', function (data, isBinary) {
        wss.clients.forEach(function (client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    })
});

exports.upgradeWs = function (req, socket, head) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, config.SECRET, function (err, decoded) {
            if (err) {
                throw err;
            }
            req.auth = decoded
            console.log(decoded);
        });

        wss.handleUpgrade(req, socket, head, socket => {
            wss.emit('connection', socket, req);
        });
    } catch(err) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    }
}


exports.onconnectionws = function onconnectionws(room) {
    room.wss.on('connection', function (ws, req, client) {
        ws.on('message', function (data, isBinary) {
            wss.clients.forEach(function (client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(data, { binary: isBinary });
                }
            });
        })
    });
}

var rooms = roomctrl.getrooms();
for (const room of rooms) {
    onconnectionws(room);
}

exports.upgradeWs2 = function (req, socket, head) {
    try {
        const token = req.headers.authorization.split(' ')[1];

        jwt.verify(token, config.SECRET, function (err, decoded) {
            if (err) {
                throw err;
            }
            req.auth = { userid: decoded.userid };
            console.log(decoded);
        });

        rooms = roomctrl.getrooms();
        console.dir(rooms)
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
        console.log(err);
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    }
}

exports.createfile = function (req, res, next) {

}