import {getRandomInt} from '../Helper'

const powerGainedOnHit = 5;

//counts objects destroyed durring a boost and displays text if 2 kills or over
export class ComboCounter{
    constructor(scene, target) {
        this.scene = scene;
        this.player = target;
        this.comboCounter = 0;
        
    }

    resetCombo() {
        this.comboCounter = 0;
    }

    incrementCombo() {
        this.comboCounter++;
        this.player.boostHandler.incrementPowerOnCombo(powerGainedOnHit * this.comboCounter);
        if (this.comboCounter < 2) {
            return;
        }

        this.scene.tweens.add({
            targets:  this.scene.add.text(this.player.x, this.player.y - 100, 'COMBO ' + this.comboCounter, { font: '60px Arial', fill: '#ffffff' }),
            alpha: 0,
            duration: 1000,
            scaleX: this.comboCounter -1,
            scaleY:this.comboCounter - 1,
            y: getRandomInt(this.player.y-500, this.player.y -200),
            x: getRandomInt(this.player.x-500,this.player.x+500),
            onComplete: function (tween) {
                tween.targets[0].destroy();
            }
        });
    }
}