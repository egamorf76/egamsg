exports.connectWs = function (ws, req, client) {

    ws.send(JSON.stringify({
        author: { id: 0, name: "Serveur"},
        time: new Date().toJSON(),
        message: "Bienvenue",
    }));

    ws.on('message', function (data, isBinary) {

        var msg = JSON.parse(data);
        console.log(msg);

        wss.clients.forEach(function (client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    })
}