import { Mine } from '../Mine'
import {getRandomInt} from '../../../Helper'

const soonestTimeToDropMine = 1500;
const longestTimeToDropMine = 10000;

export class MineHandler {
    constructor(target, scene) {
        this.target = target;
        this.scene = scene;
        this.mines = [];
    }

    dropMinesAtRandomUntilTargetOrSceneIsDestroyed() {
        this.randomlyDropMines();
        return this;
    }

    delete() {
        this.mines.forEach(function(mine){
            mine.delete();
        })
    }

    randomlyDropMines() {
        this.scene.time.delayedCall(getRandomInt(soonestTimeToDropMine, longestTimeToDropMine), function(){
            if(!this.scene || !this.target.body) {
                return;
            }
         
            this.target.startWarningPulse(function(){
                    this.mines.push(new Mine(
                        this.target.x,
                        this.target.y,
                        this.scene
                    ))
                    
                }.bind(this),
                'green'
            )

            this.randomlyDropMines();
            
        }.bind(this));
    }
}