import Button from '../components/Button';
import useSocket from '../hooks/useSocket'; 
import { useState, useEffect } from 'react';

const Game = () => {
	const socket = useSocket();
	const [gameId, setGameId] = useState(null);

	useEffect(() => {
		console.log(socket.current);

		socket.current.onopen = () => {
			socket.current.send(JSON.stringify({ type: "create" }));
			console.log("Connected to WS server");
		};

		socket.current.onmessage = (e) => {
			const msg = JSON.parse(e.data);
			console.log(`Received: ${e.data}`);
			setGameId(msg.gameId);
		};

	}, []);

	return (
		<div className="h-screen w-screen bg-neutral-700 flex">
			<div> Game Id: {gameId} </div>
			<Button> Start Race </Button>
		</div>
		// <div className="h-screen w-screen bg-neutral-700 flex">
		// 	<div> Game Id: {gameId} </div>
		// 	<div className="m-20">
		// 		<button className="rounded-xl text-sm text-white bg-black h-26 w-28 flex items-center justify-center hover:bg-yellow-600">
		// 			Start Race
		// 		</button>
		// 		<div> </div>
		// 	</div>
		// </div>
	);
};

export default Game; 