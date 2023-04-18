//core module
const bodyParser = require('body-parser');

// 3rd party module
const express = require("express");
const dotenv = require("dotenv").config();
const cors = require('cors');
const mongoose = require('mongoose');

// own routes import
const users = require("./routes/api/user")

// constants 
const app = express();
const port = process.env.PORT || 5000;
const mongodbURI = process.env.MONGOOSE_URI;

//middlewares
// CORS middleware
app.use(cors());

// Body Parser middleware to parse request bodies
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(bodyParser.json());

// api routes
app.use("/api/users", users);


// localhost:5000/api/users/signup
// localhost:5000/api/admin/signup
// localhost:5000/api/message/
// localhost:5000/api/users/

// start server
const server = app.listen(port, () => {
    console.log("server is running on", port);
})

const io = require('socket.io')(server);

// Assign socket object to every request (middleware)
app.use(function (req, res, next) {
    req.io = io;
    next();
});

// Database configuration
console.log(process.env.MONGOOSE_URI);
mongoose.connect(mongodbURI)
    .then(() => console.log("MongoDB Successfully Connected"))
    .catch(err => console.log(err));