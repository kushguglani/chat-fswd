const express = require('express');
const router = express.Router();
const validateRegisterInput = require('../../validation/register');
const Users  = require('../../models/User');

// localhost:5000/api/user/register

// app.post('/api/user/register',(req,res)=>{

// })

router.post('/register', (req, res) => {
    // Form Validation
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const newUser = new Users({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
    })

    newUser.save().then(user => {
        res.json(user)
    })

})

module.exports= router;