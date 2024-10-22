import React from 'react';

const ProgressBar = ({ progress, myWPM }) => {
    return (
        <div className="mb-2">
            <div className="relative w-full h-2 bg-gray-200 rounded-full">
                <div
                    className="absolute h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${progress * 100}%` }}
                />
                {/* <span > {"WPM: " + myWPM} </span> */}
            </div>
        </div>
    );
};

export default ProgressBar;