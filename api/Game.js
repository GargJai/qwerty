import { WAITING } from './constants.js'

class Game {
    
    constructor(id) {
        this.id = id
        this.players = []
        this.state = WAITING
        this.progress = []
        this.accepting = true
        this.WPMS = []
        this.ranks = [] 
        this.nextRank = 1; 
        this.sockets = []
    }

    setRank(index) {
        this.ranks[index] = this.nextRank; 
        this.nextRank += 1; 
    }

    getState() {
        return {
            id: this.id,
            cnt: this.sockets.length, 
            progress: this.progress, 
            WPMS: this.WPMS, 
            ranks: this.ranks, 
            state: this.state, 
        }
    }

}

export default Game; 