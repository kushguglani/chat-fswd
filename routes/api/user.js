const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login')
const Users = require('../../models/User');

// localhost:5000/api/user/register

// app.post('/api/user/register',(req,res)=>{

// })


router.post("/login", async (req, res) => {
    // debugging
    console.log("login come ........")
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
                            username: user.username,
                            token: "Bearer " + token
                        })
                    }))
            }
        })
})


router.post('/register', async (req, res) => {
    // Form Validation
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    // Check validation
    let user = await Users.findOne({ username: req.body.username });
    console.log({ user })
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
            console.log(hash);
            console.log(req.body.password);
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
                        res.json({
                            success: true,
                            id: user._id,
                            username: user.username,
                            token: "Bearer " + token
                        })
                    }
                )
            })
        });
    });




})

module.exports = router;