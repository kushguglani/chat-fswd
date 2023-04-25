const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const mongoose = require('mongoose');
const GlobalMessage = require('../../models/GlobalMessage');
const Conversation = require('../../models/Conversation');
const Message = require('../../models/Message');
let jwtUser;

// token authorization middleware
router.use((req, res, next) => {
    let token = req.headers.auth;
    // token Bearer token......
    // check token is present
    if (!token) {
        return res.status(400).json("unauthorized");
    }
    // validating token
    jwtUser = jwt.verify(token.split(' ')[1], process.env.SECRET_JWT);
    // jwtUser is alooged in user
    if (!jwtUser) {
        return res.status(400).json("unauthorized");
    } else {
        next();
    }
})

// send global message
router.post("/global", async (req, res) => {
    let message = new GlobalMessage(
        {
            from: jwtUser.id,
            body: req.body.message
        }
    )
    req.io.sockets.emit('messages', req.body.message);
    let saveMessage = await message.save();
    res.send(saveMessage)
});

// pradeep message to a person  / hi
// praddep(friend) and vikas(new) How are you
router.post('/personal', async (req, res) => {
    let from = new mongoose.Types.ObjectId(jwtUser.id); // logged in person id  (kush)
    let to = new mongoose.Types.ObjectId(req.body.sender); // sender person id  (pradeep) (postman)

    let conversation = await Conversation.findOneAndUpdate(
        {
            recipients: {
                $all: [
                    { $elemMatch: { $eq: from } },
                    { $elemMatch: { $eq: to } },
                ],
            },
        },
        {
            recipients: [from, to],
            lastMessage: req.body.message
        },
        { upsert: true, new: true, setDefaultsOnInsert: true });

    // save message
    let message = new Message({
        body: req.body.message,
        from: from,
        conversation: conversation._id,
        to: to

    })
    req.io.sockets.emit('messages', req.body.message);
    let saveMessage = await message.save();
    res.send(saveMessage)
})


// get global message list 
router.get('/globalMessages', async (req, res) => {
    let globalMessage = await GlobalMessage.aggregate([
        {
            $lookup: { // fetch data from different collection
                from: 'users',  // collection name
                localField: 'from', // key from which you want to fetch a data
                foreignField: '_id', // collection table key
                as: 'fromObj',  // any name you can give wher you store user
            },
        }
    ])
        .project({
            'fromObj.password': 0,
            'fromObj.__v': 0,
            'fromObj.date': 0,
        }).exec();
    res.send(globalMessage);
})

// get conversation list
router.get('/conversationList', async (req, res) => {
    let from = new mongoose.Types.ObjectId(jwtUser.id);
    let conversationList = await Conversation.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'recipients',
                foreignField: '_id',
                as: 'recipientObj',
            },
        }
    ])
        .match({ recipients: { $all: [{ $elemMatch: { $eq: from } }] } })
        .project({
            'recipientObj.password': 0,
            'recipientObj.__v': 0,
            'recipientObj.date': 0,
        }).exec();
    res.send(conversationList);
})

// get conversation list
// from and to 
// get  => req.query
// post => req.body
router.get('/conversationByUser/query', async (req, res) => {
    let user1 = new mongoose.Types.ObjectId(jwtUser.id);
    let user2 = new mongoose.Types.ObjectId(req.query.userId);
    let conversationList = await Message.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'from',
                foreignField: '_id',
                as: 'fromObj',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'to',
                foreignField: '_id',
                as: 'toObj',
            },
        }
    ])
        .match({
            $or: [
                { $and: [{ to: user1 }, { from: user2 }] },
                { $and: [{ to: user2 }, { from: user1 }] },
            ]
        })
        .project({
            'toObj.password': 0,
            'toObj.__v': 0,
            'toObj.date': 0,
            'fromObj.password': 0,
            'fromObj.__v': 0,
            'fromObj.date': 0,
        }).exec();
    res.send(conversationList);
})

/*
 
        1  recipients : [kush rahul],
        lastMessage:"hi"
 
        2  recipients : [kush ahmed],
        lastMessage:"hi"
 
        3  recipients : [kush ritesh],
        lastMessage:"hi"
 
        4  recipients : [kush deepak],
        lastMessage:"hi"
 
        5  recipients : [kush pradeep],
        lastMessage:"how are you"
 
        6  recipients : [kush vikas],
        lastMessage:"hi"
     
        7  recipients : [rahul vikas],
        lastMessage:"hi"
 
 
 
 
    case1 : 1(rahul)
        from(kush)  to(rahul)
        last message
    case2 : Deepak
        from (kush)  to(deepak)
        from to lasst messahe
 
 
    Message
        conversation
        from
        to
        message
    
 
*/

module.exports = router;