const mongoose = require("mongoose");
const config=require('../config/config').get(process.env.NODE_ENV);

mongoose.connect(config.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("connection successful");
}).catch((e) => {
    console.log("connection failed");
})