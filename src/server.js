const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const staticPath = path.join(__dirname, "../public");

app.use(express.static(staticPath))


app.get("/", function (req, res) {
    res.send("test");
})

app.listen(port, function () {
    console.log(`Server run on port ${port}`)
})