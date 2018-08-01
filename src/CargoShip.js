import { getRandomInt } from './Helper'
import { destroyObject } from './matter/MatterHelper'

export class CargoShip extends Phaser.Physics.Matter.Sprite {
    constructor(config) {
        super(config.scene.matter.world, config.startPostion.x, config.startPostion.y, 'cargo_' + config.cargoKeyNumber);
        this.setDepth(1);
        this.body.key = this.constructor.name;
        this.scene.add.existing(this);
        this.velocity = 1;
        this.setStatic(true);
        this.removeShipAfterTween = false;
        this.body.delete = this.delete.bind(this);
        this.moveSpeed = {y:4, x:1};
        this.warpOutPositionY = config.warpOutPositionY;
        this.warpToPostionY = config.warpToPostionY;
        this.straighPathPostion = config.straighPathPostion;
        this.startPostion = config.startPostion;
        this.veerOff =  config.veerOff;
        this.matterHelper = config.matterHelper;
        this.currentTween = false;
        this.isWarping = false;
        this.body.done = this.onPowerThrustCollision.bind(this);
        this.setCollisionCategory(config.scene.matterHelper.getMainCollisionGroup());
    }


    update() {

        this.moveX();
        this.moveY();

    }

    moveY() {
        if (this.y >= this.warpOutPositionY) {
            this.y -= this.moveSpeed.y;
        } else {
            this.warpToLocation(this.startPostion.x, this.warpToPostionY);
        }
    }
    moveX() {
       // debugger;
        if(this.y < this.veerOff.postionY){
            this.x+= this.moveSpeed.x * this.veerOff.xDirection;
            return;
        }

        if (this.x > this.straighPathPostion.x) {
            this.x-=this.moveSpeed.x;
        } else if (this.x < this.straighPathPostion.x) {
            this.x+=this.moveSpeed.x;
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
    }


    warpToLocation(x, y) {
        this.x = x;
        this.y = y;
    }


    getDimensions() {
        //get demensions before creating 
        this.scene.textures.get('cargo_1').getSourceImage().width
    }

}