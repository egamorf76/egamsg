const express = require("express");
const WebSocket = require("ws");
const path = require("path");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const { stringify } = require("querystring");
require("./db/conn");

const auth = require("./middleware/auth");
const messagectrl = require("./controllers/messagectrl")
const authctrl = require("./controllers/authctrl")
const userctrl = require("./controllers/userctrl")

const wss = new WebSocket.Server({ noServer: true });
const app = express();
const port = process.env.PORT || 3000;

wss.on('connection', messagectrl.connectWs);

app.use(express.static(path.join(__dirname, "../public")));
app.use('/jq', express.static(path.join(__dirname, "../node_modules/jquery/dist")));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieparser());

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/views" ,"/index.html"));
});

app.post("/api/auth/signup", authctrl.signup);
app.post("/api/auth/signin", authctrl.signin);

app.get("/api/profils/:id", auth, userctrl.getuser);

const server = app.listen(port, function () {
    console.log(`Server run at: http://localhost:${port}`);
});

server.on('upgrade', function (req, socket, head) {
    wss.handleUpgrade(req, socket, head, socket => {
        wss.emit('connection', socket, req);
    });
});