const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema for Users
const UserSchema = new Schema(
    {
        name:{
            type:String,
            require:true
        },
        username:{
            type:String,
            require:true,
            unique:true
        },
        email:{
            type:String
        },
        password:{
            type:String,
            require:true,
        },
        date:{
            type:String,
            default: Date.now,
        },
    }
);
const Users =  mongoose.model('users', UserSchema) ;
module.exports = Users;