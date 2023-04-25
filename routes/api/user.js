const express = require('express');
// to hash (encrypy password etc) 
const bcrypt = require('bcryptjs');
//authorizaton
const jwt = require('jsonwebtoken');
const router = express.Router();
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login')
const Users = require('../../models/User');

// localhost:5000/api/user/

// app.post('/api/user/register',(req,res)=>{

// })

// verify user jwt
// list of user except login
router.get('/', async (req, res) => {
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
    let user = await Users.aggregate()
        .match({ _id: { $not: { $eq: jwtUser.id } } })
        .project({
            password: 0,
            date: 0,
            __v: 0
        })
        .exec();
    res.send(user)
})

router.post("/login", async (req, res) => {
    // debugging
    // console.log("login come ........")
    // validation
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    // validate user name
    let password = req.body.password;
    let user = await Users.findOne({ username: req.body.username });
    if (!user) {
        return res.status(400).json("Invalid Credentials");
    }
    bcrypt.compare(password, user.password)
        .then((isMatch) => {
            if (!isMatch) {
                return res.status(400).json("Invalid Credentials");
            } else {
                const payload = {
                    id: user._id,
                    username: user.username
                }
                jwt.sign(
                    payload,
                    process.env.SECRET_JWT,
                    { expiresIn: 31556926 },
                    ((err, token) => {
                        res.json({
                            success: true,
                            id: user._id,
                            name: user.username,
                            token: "Bearer " + token
                        })
                    }))
            }
        })
})


router.post('/register', async (req, res) => {
    // Form Validation
    try {
        const { errors, isValid } = validateRegisterInput(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }
        // Check validation for existing user (unique user name)
        let user = await Users.findOne({ username: req.body.username });
        if (user) {
            return res.status(400).json("Username alredy exist");
        }
        const newUser = new Users({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
        })
        bcrypt.genSalt(Number(process.env.SALT_ROUNDS) || 10, function (err, salt) {
            bcrypt.hash(req.body.password, salt, function (err, hash) {
                // Store hash in your password DB.
                newUser.password = hash;
                newUser.save().then(user => {
                    // authentication is done
                    // start authorization
                    // res.json(user)
                    const payload = {
                        id: user._id,
                        username: user.username
                    }
                    jwt.sign(
                        payload,
                        process.env.SECRET_JWT,
                        {
                            expiresIn: 31556926, // 1 year in seconds
                        },
                        (err, token) => {
                            if (err) console.log(err)
                            req.io.sockets.emit("users", user.username);
                            res.json({
                                success: true,
                                id: user._id,
                                name: user.username,
                                token: "Bearer " + token
                            })
                        }
                    )
                })
            });
        });

    }
    catch (e) {
        console.log(e);
    }
})

module.exports = router;