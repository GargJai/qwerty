import { WAITING } from './constants.js'

class Game {
    
    constructor(id) {
        this.id = id
        this.players = []
        this.state = WAITING
        this.progress = []
        this.accepting = true
    }

}

export default Game; 