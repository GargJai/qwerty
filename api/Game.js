class Game {
    constructor(player) {
        this.master = player;
        this.players = [this.master];
        this.state = "waiting"; 
        this.pcount = 1; 
    }
    
    start(player) {
        if (player === this.master) {
            this.state = "running"; 
        }
    }
    
    add(player) {
        if (this.state !== "running") {
            if (!this.players.includes(player)) {
                this.players.push(player);
            }
            this.pcount += 1; 
        }
    }

    getProgress() {
        let progress = []; 

        this.players.forEach((player) => {
            progress.push(player.getProgress()); 
        }); 
        
        return progress; 
    }
}

export default Game; 