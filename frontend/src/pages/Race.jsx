import { useState, useEffect } from "react";
import useSocket from "../hooks/useSocket.js";
import {
    SYNC,
    CREATE,
    JOIN,
    SET_PROGRESS,
    START,
    RUNNING,
    WAITING,
} from "../constant.js";
import { useSearchParams } from "react-router-dom";
import ProgressBar from "../components/ProgressBar.jsx";
import Test from "../components/Test.jsx";
import { getRank, getStateMsg } from "../utils.js";

const SOCKET_URL = "localhost:5173";

const Race = ({ master }) => {
    const [searchParams] = useSearchParams();

    const [raceState, setRaceState] = useState({
        master: master,
        myProgress: 0,
        progress: [],
    });

    const socket = useSocket();

    useEffect(() => {
        if (socket.current.readyState === WebSocket.OPEN) {
            socket.current.send(
                JSON.stringify({
                    type: SET_PROGRESS,
                    myProgress: raceState.myProgress,
                    myWPM: raceState.myWPM,
                })
            );
        }
    }, [raceState.myProgress]);

    useEffect(() => {
        socket.current.onopen = () => {
            if (raceState.master) {
                socket.current.send(JSON.stringify({ type: CREATE }));
            } else {
                const id = searchParams.get("id");
                socket.current.send(JSON.stringify({ type: JOIN, id }));
            }

            socket.current.onmessage = (e) => {
                const msg = JSON.parse(e.data);
                const EVENT = msg.type;

                if (EVENT === "UID") {
                    setRaceState((prev) => ({
                        ...prev,
                        myInd: msg.ind,
                    }));
                }

                if (EVENT === JOIN || EVENT === SYNC || EVENT === CREATE) {
                    setRaceState((prev) => ({
                        ...prev,
                        id: msg.id,
                        cnt: msg.cnt,
                        progress: msg.progress,
                        WPMS: msg.WPMS,
                        state: msg.state || WAITING,
                        master: EVENT === CREATE ? true : prev.master,
                        ranks: msg.ranks,
                    }));
                } else if (EVENT === START) {
                    setRaceState((prev) => ({
                        ...prev,
                        startTime: Date.now(),
                        state: msg.state,
                    }));
                }
            };

            setRaceState((prev) => ({
                ...prev,
                socket: socket.current,
            }));
        };
    }, []);

    const onStartRace = () => {
        socket.current.send(JSON.stringify({ type: START }));
    };

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-slate-700">
            <div className="p-6 bg-slate-200 rounded-lg shadow-md">
                {raceState.master &&
                    (raceState.state != RUNNING ? (
                        <button
                            onClick={onStartRace}
                            className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                        >
                            Start Race
                        </button>
                    ) : (
                        ""
                    ))}
                <h1 className="font-semibold mb-4">
                    {getStateMsg(raceState.state)}
                </h1>
                <div className="mb-2 font-medium">Join URL:</div>
                <div className="border border-gray-300 p-2 rounded bg-gray-50 mb-4">
                    {" "}
                    {SOCKET_URL + "/join?id=" + raceState.id}{" "}
                </div>

                {Array.from({ length: raceState.cnt }).map((_, index) => (
                    <div key={index} className="mb-1">
                        <div className="flex justify-between">
                            <span className="font-medium">
                                Player {index}:{" "}
                                {index === raceState.myInd ? "(YOU)" : ""}{" "}
                            </span>
                            <span>{"WPM : " + raceState.WPMS[index]}</span>
                            {raceState.ranks[index] !== null ? (
                                <span>{getRank(raceState.ranks[index])}</span>
                            ) : null}
                        </div>

                        <ProgressBar progress={raceState.progress[index]} />
                    </div>
                ))}

                <Test raceState={raceState} setRaceState={setRaceState} />
            </div>
        </div>
    );
};

export default Race;
