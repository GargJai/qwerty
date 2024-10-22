import { getWPM, parseString } from "../utils";
import { useState } from "react";

import {
    RUNNING
} from '../constant'


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
        
            if (raceState.progressg !== 1) {
                setRaceState((prev) => ({ ...prev, myProgress: newProgress, myWPM: getWPM(raceState.startTime, testState.currInd) }));
            } 
        }
    };

    return (
        <div className="mt-4">
            <div className="flex flex-wrap space-x-2">
                {testState.words.map((el, ind) => (
                    <span
                        className={`text-lg ${
                            ind < testState.currInd
                                ? "text-green-600"
                                : "text-gray-800"
                        }`}
                        key={ind}
                    >
                        {el}
                    </span>
                ))}
            </div>
            {raceState.state === RUNNING && (
                <div>
                    <input
                        value={testState.input}
                        onChange={updateInput}
                        className="mt-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Type here..."
                    />
                </div>

            )}
        </div>
    );
};


export default Test; 