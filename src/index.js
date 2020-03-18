const express = require("express")
const path = require("path")
const http = require("http")
const socketio = require("socket.io")
const filter = require("bad-words")
const { generateMessage } = require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))



io.on('connection',(socket)=>{
    

    //socket.broadcast.emit('message',generateMessage('new user added !'))
    socket.on('sendmessage',(message,callback)=>{
//        const filter = new Filter()
//        if(filter.isProfane(message)){
//            return (callback("mind your lengueaz!!"))
//        }
        const user1 = getUser(socket.id)
        io.to(user1.room).emit('message',generateMessage(user1.username,message))
        callback() // this goes to acknowledgement   
    }) 

    socket.on('join',({username,room},callback)=>{
        const {error,user} = addUser({id:socket.id,username,room})
        if (error){
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message',generateMessage('welcome'))
        socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined !`))

        io.to(user.room).emit('roomData',{
            room : user.room,
            users : getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message',generateMessage(`a ${user.username} has left!!!`))
            io.to(user.room).emit('roomData',{
                room : user.room,
                users : getUsersInRoom(user.room)
            })
        }   

        
    })
})

server.listen(3000,()=>{
    console.log(`server is running on post ${port}`)
})