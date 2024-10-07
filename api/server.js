import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from 'uuid';
import Player from "./Player";
import Game from "./Game";

const SOCKET_PORT = 8080;
const wss = new WebSocketServer({ port: SOCKET_PORT });

let games = new Map(); 
let players = new Map();  


wss.on("connection", async (ws) => {
    ws.uid = uuidv4(); 
    console.log(ws.uid); 

    ws.on("message", (msg) => {
        let req = JSON.parse(msg.toString('utf8'));
        console.log(req); 

        if (req.type === "create") { 
            let player = new Player({ws, gameId: ws.uid});
            let game = new Game(player); 

            games.set(ws.uid, game);
            players.set(ws.uid, player);

            ws.send(JSON.stringify({
                gameId: ws.uid
            })); 
        }
        
        if (req.type === "start") {
            if (games.has(ws.uid) && games.get(ws.uid).master === players.get(ws.uid)) {
                games.get(ws.uid).start(players.get(ws.uid)); 
            } 
        }

        if (req.type === "join") {
            const { gameId } = req;
            if (games.has(gameId) && games.get(gameId).state !== "running") {
                const player = new Player({ws, gameId}); 
                players.set(ws.uid, player); 
                games.get(gameId).add(player); 
            }
            
            ws.send(JSON.stringify({
                gameId
            })); 
        }

        if (req.type === "setProgress") {
            const { value } = req; 
            players.get(ws.uid).updateProgress(value); 
        }

        if (req.type === "sync") {
            const { gameId } = req; 
            const progress = games.get(players.get(ws.uid).gameId).getProgress(); 
            console.log("Sending progress:", JSON.stringify({ progress })); // Debugging line
            ws.send(JSON.stringify({ progress })); 
        }
    });
});