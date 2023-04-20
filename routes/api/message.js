const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const GlobalMessage = require('../../models/GlobalMessage');



router.post("/global", (req, res) => {
    let token = req.headers.auth;
    // token Bearer token......
    // check token is present
    if (!token) {
        return res.status(400).json("unauthorized");
    }
    // validating token
    let jwtUser = jwt.verify(token.split(' ')[1], process.env.SECRET_JWT);
    console.log({ jwtUser });
    // jwtUser is alooged in user
    if (!jwtUser) {
        return res.status(400).json("unauthorized");
    }

    let message = new GlobalMessage(
        {
            from: jwtUser.id,
            body: req.body.message
        }
    )
    req.io.sockets.emit('messages', req.body.message);
    let saveMessage = message.save();
    res.send(saveMessage)

})