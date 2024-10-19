import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from 'uuid';
import Game from "./Game.js";
import {
    CLOSE, SYNC, CREATE, JOIN, CONNECTION, SET_PROGRESS, START, RUNNING, WAITING, MESSAGE,
} from './constants.js';
import { SOCKET_PORT } from './config.js';

const wss = new WebSocketServer({ port: SOCKET_PORT });
const games = new Map();

console.log(`WebSocket server is running on ws://localhost:${SOCKET_PORT}`);

wss.on(CONNECTION, (socket) => {
    socket.uid = uuidv4();
    socket.game = null;
    console.log(`A user connected: ${socket.uid}`);

    const uemit = (msg) => {
        msg = JSON.stringify(msg);
        socket.send(msg);
        console.log(`Sent to ${socket.uid}:`, msg);
    };

    const ubroadcast = (msg) => {
        if (socket.game) {
            msg = JSON.stringify(msg);
            socket.game.sockets.forEach(s => {
                s.send(msg);
                console.log(`Broadcast to ${s.uid}:`, msg);
            });
        }
    };

    socket.uemit = uemit;
    socket.ubroadcast = ubroadcast;

    socket.on(MESSAGE, (data) => {
        let msg = JSON.parse(data.toString('utf8'))
        console.log('MSG : ' + msg)
        const EVENT = msg.type;

        console.log(`Received message from ${socket.uid}:`, msg);


        if (EVENT === CREATE) {
            const gameId = uuidv4();
            const game = new Game(gameId);
            game.sockets = [];
            game.progress = [];
        
            socket.game = game;
            socket.master = true;
            socket.ind = 0;
        
            game.sockets.push(socket);
            game.progress.push(0);
        
            games.set(gameId, game);
        
            console.log(`Game created by ${socket.uid}: ${gameId}`);

            socket.uemit({
                type: CREATE,
                id: gameId,
                cnt: 1, 
                progress: game.progress,
                state: game.state,
            });
        }

        else if (EVENT === START) {
            console.log("start race called"); 
            if (socket.game && socket.master) {
                const game = socket.game;
                game.state = RUNNING;
                game.accepting = false;

                console.log(`Game started by ${socket.uid}: ${game.id}`);

                socket.ubroadcast({
                    type: START,
                    state: RUNNING,
                });
            
            } else {
                console.warn(`Start event received but user ${socket.uid} is not a master or game does not exist.`);
            }

        } else if (EVENT === JOIN) {
            const { id } = msg;
            const game = games.get(id);

            if (game && game.accepting) {
                socket.game = game;
                socket.master = false;
                socket.ind = game.sockets.length;

                game.sockets.push(socket);
                game.progress.push(0);

                console.log(`User ${socket.uid} joined game: ${id}`);

                socket.ubroadcast({
                    type: SYNC,
                    id: id, 
                    cnt: game.sockets.length,
                    progress: game.progress,
                    state: game.state,
                });

            } else {
                console.warn(`Join event received but game ${id} does not exist or is not accepting.`);
            }

        } 
        
        else if (EVENT === SET_PROGRESS) {
            const { value } = msg;

            if (socket.game) {
                console.log("special Call : " + value); 
                socket.game.progress[socket.ind] = value;
                
                socket.ubroadcast({
                    type: SYNC,
                    id: socket.game.id,
                    cnt: socket.game.sockets.length,
                    progress: socket.game.progress,
                    state: socket.game.state,
                });
                

                console.log(`Progress set by ${socket.uid} in game ${socket.game.id}:`, value);
            } else {
                console.warn(`SET_PROGRESS received but user ${socket.uid} is not in a game.`);
            }

        } 
        
        else {
            console.warn(`Unknown event type received from ${socket.uid}:`, EVENT);
        }
    });

    socket.on(CLOSE, () => {
        console.log(`User disconnected: ${socket.uid}`);
        if (socket.game) {
            const game = socket.game;
            game.sockets = game.sockets.filter(s => s !== socket);
            console.log(`User ${socket.uid} removed from game: ${game.id}`);

            if (game.sockets.length === 0) {
                games.delete(game.id);
                console.log(`Game ${game.id} deleted due to no players.`);
            }
        }
    });
});
