const express = require('express');
const app = express();
const http = require('http'); 
const PORT = 3000;   
const { Server } = require('socket.io'); 

const httpServer = http.createServer(app); 

const io = new Server(httpServer, {
    cors: { origin: '*' }
}); 

io.on('connection', (socket) => {
    console.log(`${socket.id} connected`); 
}); 


httpServer.listen(3001);
io.listen(PORT);