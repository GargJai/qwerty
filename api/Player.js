class Player {
    constructor({ws, gameId}) {
        this.gameId = gameId; 
        this.socket = ws; 
        this.id = ws.uid; 
        this.progress = 0;
    }

    getProgress() {
        return this.progress; 
    }    

    updateProgress(value) {
        this.progress = value;
    }
}

export default Player; 