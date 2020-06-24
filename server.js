const path=require('path');
const express=require('express');
const http=require('http');
const socketio=require('socket.io');
const { disconnect } = require('process');

const app=express();
const server=http.createServer(app);
const io=socketio(server);

//set static folder
app.use(express.static(path.join(__dirname,'public')));

//run when client connects
io.on('connection',socket =>{
    //welcome current user
    socket.emit('message','Welcome to Chatcord');//This only emits to the client connected
    //Broadcast when a user connects
    socket.broadcast.emit('message','A new user has joined the chat');//This emits to all other users except the connecting client
    //Runs when client disconnects
    socket.on(disconnect,() => {
        io.emit('message','The user has left the chat');
    })
    //Catching the emitted message
    socket.on('chatMessage',(msg =>{
        io.emit('message',msg);
    }))


});


const PORT=process.env.PORT || 3000;

server.listen(PORT,() => console.log('Server running on port :'+" "+PORT));
