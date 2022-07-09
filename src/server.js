// Dependency
const express = require("express");
const WebSocket = require("ws");
const path = require("path");
const bodyparser = require("body-parser");
require("./db/conn");

const auth = require("./middleware/auth");
const messagectrl = require("./controllers/messagectrl")
const authctrl = require("./controllers/authctrl")
const userctrl = require("./controllers/userctrl")
const roomctrl = require("./controllers/roomctrl")

// Global variable
const wss = new WebSocket.Server({ noServer: true });
const app = express();
const port = process.env.PORT || 3000;

// Configure express
app.use(express.static(path.join(__dirname, "../public")));
app.use('/jq', express.static(path.join(__dirname, "../node_modules/jquery/dist")));

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Front end
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/views" ,"/index.html"));
});

// Authentification
app.post("/api/auth/signup", authctrl.signup);
app.post("/api/auth/signin", authctrl.signin);

// User
app.get("/api/profils/:id", auth, userctrl.readuser);

// Message
wss.on('connection', messagectrl.connectWs); // Need to authenticate to use web socket
//app.post("/api/message", auth, message.createfile) 

// Room
//app.get("/api/room/:id", auth, roomctrl.readroom);
//app.post("/api/room", auth, roomctrl.createroom);
//app.put("/api/room/:id", auth, roomctrl.updateroom);
//app.delete("/api/room/:id", auth, roomctrl.removeroom);

// Run server on port (config.js)
const server = app.listen(port, function () {
    console.log(`Server run at: http://localhost:${port}`);
});

// Upgrade http request to Websocket
server.on('upgrade', function (req, socket, head) {
    wss.handleUpgrade(req, socket, head, socket => {
        wss.emit('connection', socket, req);
    });
});