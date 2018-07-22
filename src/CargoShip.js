import { getRandomInt } from './Helper'
import { destroyObject } from './matter/MatterHelper'

export class CargoShip extends Phaser.Physics.Matter.Sprite {
    constructor(config) {
        super(config.scene.matter.world, config.x, config.y, 'cargo_' + config.cargoKeyNumber);
        this.setDepth(1);
        this.body.key = this.constructor.name;
        this.scene.add.existing(this);
        this.velocity = 1;
        this.setStatic(true);
        this.removeShipAfterTween = false;
       // this.warpIn().then(() => { this.moveSpeed = 3; this.isWarping = false; });
        this.body.delete = this.delete.bind(this);
        this.moveSpeed = 3;
        this.warpOutPositionY = config.warpOutPositionY;
        this.warpToPostionY = config.warpToPostionY;
        this.matterHelper = config.matterHelper;
        this.currentTween = false;
        this.isWarping = false;
        this.body.done = this.onPowerThrustCollision.bind(this);
        this.setCollisionCategory(config.scene.matterHelper.getMainCollisionGroup());
    }


    update() {
        if (this.y >= this.warpOutPositionY) {
            this.y -= this.moveSpeed;
        } else {
            if (!this.isWarping) {
                this.warpToLocation(this.x, this.warpToPostionY);
            }

        }
    }

    getTop() {
        return this.y - this.height / 2;
    }

    getRight() {
        return this.x + this.width / 2;
    }

    onPowerThrustCollision(){
        if(this.isWarping){
            return;
        }
        this.delete();
    }

    delete(isExploding) {
        destroyObject(this, isExploding);
        return;
        //phaser freaks out if a matter object gets destroyed while tweening 
        //so force current tween to complete and delete when it's done
        if (this.currentTween) {
            this.removeShipAfterTween = true;
            this.currentTween.complete();
            return;
        }
        
        return;//this.destroy();
    }


    warpToLocation(x, y) {

        this.x = x;
        this.y = y;
        return;
        this.moveSpeed = 0;
        this.setCollisionCategory(this.scene.matterHelper.getNonCollisionGroup());

        this.warpOut().then(() => {
            this.x = x;
            this.y = y;
            this.warpIn().then(() => {
                this.moveSpeed = 3;
                this.setCollisionCategory(this.scene.matterHelper.getMainCollisionGroup());
                this.isWarping = false;
            });
        })
    }

    warpIn() {
        this.isWarping = true;
        return new Promise((resolve, reject) => {
            this.setAlpha(0);
            this.currentTween = this.scene.tweens.add({
                targets: this,
                alpha: 1,
                duration: 3000,
                onComplete: function () {
                    if (this.removeShipAfterTween) {
                        this.destroy();
                    } else {
                        resolve();
                    }
                }.bind(this)
            });

        });
    }

    warpOut(action) {
        this.isWarping = true;
        return new Promise((resolve, reject) => {
            this.currentTween = this.scene.tweens.add({
                targets: this,
                alpha: 0,
                duration: 3000,
                onComplete: function () {
                    if (this.removeShipAfterTween) {
                        this.destroy();
                    } else {
                        resolve();
                    }
                }.bind(this)
            });
        });
    }

    getDimensions() {
        //get demensions before creating 
        this.scene.textures.get('cargo_1').getSourceImage().width
    }

}