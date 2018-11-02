import {getRandomInt} from '../Helper'

export class Shield {
    constructor(scene, player) {
        this.startSpinOut = false;
        this.scene = scene;
        this.player = player;

        this.image = this.scene.add.image(this.player.x,this.player.y,'00').setVisible(false);

     
    }

    onShieldHit(dmg, collidedWith) {
        if (this.startSpinOut) {
            return;
        }

        this.player.boostHandler.decrementPower(dmg);
        
        if (!this.doesCollidingWithThisObjectBouncePlayer(collidedWith.key)) {
            return;
        }

        this.player.thruster.hideImage();
        this.doAddToAngleOnSpin = getRandomInt(0,1);
        this.startSpinOut = true;
        this.player.thruster.hideImage();
        this.player.setVelocityX(-5);
        this.image.setVisible(true);

        this.scene.time.addEvent({ 
            delay: 500, 
            callback: function () { 
                this.startSpinOut = false
                this.player.thruster.showImage();
                this.image.setVisible(false);
            }, 
            callbackScope: this, 
            startAt: 0 
        }); 

       
    }

    doesCollidingWithThisObjectBouncePlayer(objectKey) {
        return objectKey !== 'Mine'
    }
    
    update() {
        this.image.x = this.player.x;
        this.image.y = this.player.y;
        if ( this.startSpinOut ) {
            this.player.angle+= this.doAddToAngleOnSpin ? 10 : -10
        }
    }
}