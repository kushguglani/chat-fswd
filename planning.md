chatting app

* Why ? which used in most of the project 
    reusable project
    resume (as a stand alone project)
    resume (as a reusable project)
    resume (as a client project)
* Process:   signup/login 
    authentication/ authorization
    chatting feature
    +additional features (encrypted)

*Approach
    Backward approcah (BE first)

* Tech stack
    FE: React ....
    BE: NodeJs Express Mongoose JWT SocketIO bcryptjs
    DB: MongoDB
    Deployemnt: (time + HR) Mlab

Node steps
    npm i packages ...(npm i dotenv express mongoose cors socket.io bcryptjs)
    dotenv setup
    server create
    mongoose connect
    cors
    body-parser
    socketIO setup
    routes
    api

Routes
    model
        User
            Name
            Username
            Passowrd
            Date:



username unique
    2 ways
        1 unique:true
        2 write own logic
ecrypt password
    bcrypt
        salt and rounds
            hash

jwt token
    sign
        3 arg
            token
hide pwd
    send only use ful information



login api

-----------------------------------
user list api
    jwt verify
    send all the user(Except login one)


model
    Coversation (old chat coversation)  
        last person
    Global 
    Message (all messages)

-----------------------------------
api
    send global message
    send personal message
    get global message list
    get personal message
    get conversation


    all required validation

-----------------------------------


4 and 5 class (node js done)


6 and 7 class(react is done)

8 class erveryone creatred there projec
interview as a fresher 
and experience
resume update
