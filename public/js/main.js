const chatForm=document.getElementById('chat-form');
const socket=io();
const chatMessages=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true,
});

//console.log(username,room);

//Join chatroom
socket.emit('joinRoom',{username,room});
//Get all users and room name
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUser(users);
})
//Message from server
socket.on('message',message =>{
    console.log(message);
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight;
});
//Message submit
chatForm.addEventListener('submit',(e) =>{
    e.preventDefault();
    //Message text
    const msg=e.target.elements.msg.value;
    //Emitting message to server
    socket.emit('chatMessage',msg);
    //clear message
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
})
//output message to dom
function outputMessage(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p><p class="text">${message.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}
function outputRoomName(room){
    roomName.innerHTML=room;
}
function outputUser(users){
    userList.innerHTML=`${users.map(user => `<li>${user.username}</li>`).join('')}`
}