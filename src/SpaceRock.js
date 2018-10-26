import { getRandomInt } from './Helper';
import { destroyObject } from './matter/MatterHelper'

export class SpaceRock extends Phaser.Physics.Matter.Sprite{
    constructor(config){
        super(config.scene.matter.world, config.x, config.y, 'space_rock');
        this.body.key=this.constructor.name; 
        this.body.changeDirection = this.changeDirection.bind(this);
        this.scene.add.existing(this);
        //this.body.done = this.delete.bind(this);
        this.body.delete = this.delete.bind(this);
        this.velocity = 1;
        this.floatsLeft = getRandomInt(0,1);
        this.setCollisionCategory(this.scene.matterHelper.getMainCollisionGroup());
        this.setDepth(2);
    }
    //TODO
    //setType()

    changeDirection(){
        this.velocity = -this.velocity;
    }

    tintWhite() {
        this.setTintFill(0xffffff);
    }

    update(){   
        if(this.floatsLeft){   
            this.x+=this.velocity;
            this.angle+=0.2;
        } else {
            this.x-=this.velocity;
            this.angle-=0.2;
        }

        this.y -= 1;    
    }

    delete(isExploding){
        destroyObject(this, isExploding);       
    }

    tintWhite(){
        this.setTintFill(0xffffff);
    }

    removeTint() {
        this.clearTint();
    }
}