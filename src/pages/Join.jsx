import useSocket from "../hooks/useSocket";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Join = () => {
	const [waiting, setWaiting] = useState(true);
	const socket = useSocket();
	const location = useLocation();
	const gameId = location.state?.gameId;

	useEffect(() => {
		if (socket.current) {
			socket.current.onopen = () => {
				const msg = {
					type: "join",
					gameId: gameId,
				};

				socket.current.send(JSON.stringify(msg));
				console.log("Sent join request");
			};

			socket.current.onmessage = (e) => {
				if (e.data.type === "start") {
					setWaiting(true); 
				}

				console.log(`Received: ${e.data}`);
			};
		}
		
		
		
	}, [socket, gameId]); 

	return (
		<div className="h-screen w-screen bg-neutral-700">
			<div> Game Id: {gameId} </div>
			<div>
				{ waiting ? <p>waiting....</p> : <Race socket={socket} / > }
			</div>
		</div>
	);
};

export default Join; 
