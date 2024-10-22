import { WAITING } from "./constant";

export function parseString(targetString) {
    const quote =
        "The only limit to our realization of tomorrow is our doubts of today.";
    const words = quote.split(" ");

    return words.map((word, index) =>
        index < words.length - 1 ? word + " " : word
    );
}

export function getWPM(startTime, words) {
    let timeSpent = (Date.now() - startTime) / 1000;
    let timeSpendMinutes = timeSpent / 60;

    return parseInt(words / timeSpendMinutes);
}

export function getRank(rank) {
    if (rank === 1) return "1st (winner)";
    else if (rank === 2) return "2nd";
    else if (rank === 3) return "3rd";
    else return rank + "th";
}

export function getStateMsg(state) {
    if (state === WAITING) {
        return "Waiting for more players to join"; 
    } else {
        return "The Race has started"
    }

}