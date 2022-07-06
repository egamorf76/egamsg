const express = require("express");
const WebSocket = require("ws");
const path = require('path');
const { stringify } = require("querystring");

const wss = new WebSocket.Server({ noServer: true });
const app = express();
const port = process.env.PORT || 3000;

wss.on('connection', function (ws, req, client) {

    ws.send(JSON.stringify({
        author: { id: 0, name: "server"},
        time: new Date().toJSON(),
        message: "Hello world",
    }));

    ws.on('message', function (data, isBinary) {

        var msg = JSON.parse(data);
        console.dir(msg);

        wss.clients.forEach(function (client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    })
})

app.use(express.static(path.join(__dirname, "../public")));
app.use('/jq', express.static(path.join(__dirname, "../node_modules/jquery/dist")));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/views" ,"/index.html"));
})

const server = app.listen(port, function () {
    console.log(`Server run at: http://localhost:${port}`);
})

server.on('upgrade', function (req, socket, head) {
    wss.handleUpgrade(req, socket, head, socket => {
        wss.emit('connection', socket, req);
    });
})