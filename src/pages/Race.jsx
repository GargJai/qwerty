import { useState, useEffect } from "react";
import useSocket from "../hooks/useSocket";
import {
    CLOSE,
    SYNC,
    CREATE,
    JOIN,
    CONNECTION,
    SET_PROGRESS,
    START,
    RUNNING,
    WAITING,
    MESSAGE,
} from "../constant.js";
import { parseString } from "../utils.js";
import { useParams, useSearchParams } from "react-router-dom";

const SOCKET_URL = "localhost:5173"; 

const Test = ({ raceState, setRaceState }) => {
    const [testState, setTestState] = useState({
        input: "",
        words: parseString(raceState.targetString),
        currInd: 0,
        progress: 0,
    });

    const updateInput = (e) => {
        const newInput = e.target.value;
        setTestState((prev) => ({ ...prev, input: newInput }));

        if (newInput === testState.words[testState.currInd]) {
            setTestState((prev) => ({
                ...prev,
                input: "",
                currInd: prev.currInd + 1,
            }));

            const newProgress = (testState.currInd + 1) / testState.words.length;
            setRaceState((prev) => ({ ...prev, myProgress: newProgress }));
        }
    };

    return (
        <div className="mt-4">
            <div className="flex flex-wrap space-x-2">
                {testState.words.map((el, ind) => (
                    <span
                        className={`text-lg ${ind < testState.currInd ? "text-green-600" : "text-gray-800"}`}
                        key={ind}
                    >
                        {el}
                    </span>
                ))}
            </div>
            {raceState.state === RUNNING && (
                <input
                    value={testState.input}
                    onChange={updateInput}
                    className="mt-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Type here..."
                />
            )}
        </div>
    );
};

const Race = ({ master }) => {
    const [searchParams] = useSearchParams(); 

    const [raceState, setRaceState] = useState({
        master: master,
        targetString: "this is the text.",
        id: "",
        myProgress: 0,  
        progress: [], 
    });

    const socket = useSocket();
   
    useEffect(() => {
        if (socket.current.readyState === WebSocket.OPEN) {
            socket.current.send(JSON.stringify({
                type: SET_PROGRESS, 
                value: raceState.myProgress,
            }));
        }
    }, [raceState.myProgress]);

    useEffect(() => {
        socket.current.onopen = () => {
            if (raceState.master) {
                socket.current.send(JSON.stringify({ type: CREATE }));
            } else {
                const id = searchParams.get('id');
                socket.current.send(JSON.stringify({ type: JOIN, id }));
            }

            socket.current.onmessage = (e) => {
                const msg = JSON.parse(e.data);
                const EVENT = msg.type;

                if (EVENT === JOIN || EVENT === SYNC || EVENT === CREATE) {
                    setRaceState((prev) => ({
                        ...prev, 
                        id: msg.id, 
                        cnt: msg.cnt, 
                        progress: msg.progress, 
                        state: msg.state || WAITING,
                        master: EVENT === CREATE ? true : prev.master,
                    }));
                } else if (EVENT === START) {
                    setRaceState((prev) => ({
                        ...prev, 
                        state: msg.state, 
                    }));
                }
            };
        };

        setRaceState((prev) => ({
            ...prev,  
            socket: socket.current, 
        }));

    }, []);

    
    const onStartRace = () => {
        socket.current.send(JSON.stringify({ type: START })); 
    }

    return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-700">

        <div className="p-6 bg-white rounded-lg shadow-md">
            {raceState.master && (
                raceState.state != RUNNING ? <button onClick={onStartRace} className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200">Start Race</button>
                : ""
            )}
            <p className="text-xl font-semibold mb-4">{raceState.state}</p>

            <div className="mb-2 font-medium">Join URL:</div>

            <div className="border border-gray-300 p-2 rounded bg-gray-50 mb-4">
                {SOCKET_URL + '/join?id=' + raceState.id} 
            </div>

            <div className="mb-2">My Progress: <span className="font-bold">{(raceState.myProgress * 100).toFixed(2)}%</span></div>

            {Array.from({ length: raceState.cnt }).map((_, index) => (
                <div key={index} className="mb-1">
                    <span className="font-medium">Player {index}: </span>
                    <span>{raceState.progress[index]}</span>
                </div>
            ))}

            <Test raceState={raceState} setRaceState={setRaceState} />
        </div>

    </div>        

    );
};

export default Race;