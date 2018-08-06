import { getRandomInt } from './Helper';
import { destroyObject } from './matter/MatterHelper'

export class Spinner extends Phaser.Physics.Matter.Sprite {
    constructor(config){
        super(config.scene.matter.world, config.x, config.y, 'spinner');
        this.body.key=this.constructor.name; 
        this.body.changeDirection = this.changeDirection.bind(this);
        this.scene.add.existing(this);
        this.body.delete = this.delete.bind(this);
        this.velocity = 1;
        this.floatsLeft = getRandomInt(0,1);
        this.setSensor(true);
        this.setCollisionCategory(this.scene.matterHelper.getMainCollisionGroup());
    }
    //TODO
    //setType()

    changeDirection(){
        this.velocity = -this.velocity;
    }

    update(){   
        if(this.floatsLeft){   
          //  this.x+=this.velocity;
            this.angle+=0.9;
        } else {
           // this.x-=this.velocity;
            this.angle-=0.9;
        }

       // this.y -= 1;    
    }

    delete(isExploding){
        destroyObject(this, isExploding);       
    }

    tintWhite(){
        this.setTintFill(0xff0000);
    }

    removeTint() {
        this.clearTint();
    }
}