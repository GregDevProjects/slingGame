import { Missle } from './sections/obstacles/Missle'

//container for game objects that don't get deleted with the sections
export class GlobalObstacleContainer {
    constructor(config) {
        this.matterHelper = config.matterHelper;
        this.scene = config.scene;
        this.allObstaclesTypes = [ Missle ];
        this.obstaclesInGame = [];
        this.isSpawnedWhite = false;
    }

    addObstacle(config) {
        let newObstacle = new this.allObstaclesTypes[0]({ 
            scene: this.scene, 
            x:  config.x, 
            y: config.y, 
            matterHelper: this.matterHelper, 
            player: config.player 
        });

        if (this.isSpawnedWhite) {
            newObstacle.tintWhite();
        }

        this.obstaclesInGame.push(newObstacle);
    }

    setAllObstaclesTintWhite(isWhite){

        this.obstaclesInGame.forEach((anObstacle) => {
            if (isWhite){
                this.isSpawnedWhite = true;
                anObstacle.tintWhite();
            } else {
                this.isSpawnedWhite = false;
                anObstacle.clearTint();
            }
        });
    }

    deleteAllObstacles() {
        this.obstaclesInGame.forEach((anObstacle) => {
            if (anObstacle.active)
                anObstacle.delete(false); 
        });
        this.obstaclesInGame = [];
    }
    
    update() {
        this.obstaclesInGame.forEach((anObstacle) => {
            if (anObstacle.active)
                anObstacle.update();
        })
    }
}