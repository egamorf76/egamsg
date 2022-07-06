const express = require("express");
const WebSocket = require("ws");

const wss = new WebSocket.Server({ noServer: true });
const app = express();
const port = process.env.PORT || 3000;
const staticPath = path.join(__dirname, "../public");

wss.on('open', function (ws) {
    ws.send('Hello world');
})

wss.on('message', function (data) {
    console.log(`Received: ${data}`)
})

app.use(express.static(staticPath))

app.get("/", function (req, res) {
    res.send("test");
})

const server = app.listen(port, function () {
    console.log(`Server run on port ${port}`)
})

server.on('upgrade', function (req, socket, head) {
    const {pathname} = parse(req.url);

    if (pathname === '/wss') {
        wss.handleUpgrade(req, socket, head, function (ws) {
            wss.emit('connection', ws, req);
        });
    } else {
        socket.destroy();
    }
})

