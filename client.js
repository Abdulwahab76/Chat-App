

const socket = io('http://localhost:8000');

//Get DOM elements in respective js variables

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

//Audio tha will play on recieving messages
let audio = new Audio('ting.mp3');

//Function that will append event info to the container

const append = (message, position) => {
    const messageElement = document.createElement('div')
    messageElement.innerHTML = message;
    messageElement.classList.add('message')
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
        audio.play()
        messageElement.style.backgroundColor = '#F2F3F5'
        messageElement.style.color = 'black'
    }

}

//Ask new user for his/her name and let the server know

let name = prompt('Enter your name for join chat');
socket.emit('new-user-joined', name);

//If a new user joins, receive his/her name from the server


socket.on('user-joined', name => {
    append(`${name} Join the chat`, 'right')
})

//if server sends a message, receive it

socket.on('receive', data => {
    append(`<b>${data.name}</b>: ${data.message}`, 'left')
})

//if a user leaves the chat, append the info to the container

socket.on('left', name => {
    append(`${name} left the chat`, 'right')
})

//if the form gets submitted, send server the message.

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`<b>You</b>: ${message}`, 'right')
    socket.emit('send', message);
    messageInput.value = "";
})