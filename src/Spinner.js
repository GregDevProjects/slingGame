import { getRandomInt } from './Helper';
import { destroyObject } from './matter/MatterHelper'

export class Spinner extends Phaser.Physics.Matter.Sprite {
    constructor(config){
        super(config.scene.matter.world, config.x, config.y, 'spinner');
        this.setBodyVertices();
        this.body.key=this.constructor.name; 
        this.body.changeDirection = this.changeDirection.bind(this);
        this.scene.add.existing(this);
        this.body.delete = this.delete.bind(this);
        this.velocity = 1;
        this.floatsLeft = getRandomInt(0,1);
        //this.setSensor(true);
        this.setStatic(true);
        this.setCollisionCategory(this.scene.matterHelper.getMainCollisionGroup());
        this.setDepth(2);
    }

    setBodyVertices() {

        this.setPolygon(0,0, {
            vertices: [
                {x: 2, y: 30.5},
                {x: 289, y: 25.5},
                {x: 318, y: 0},
                {x: 449, y: 0},
                {x: 481, y: 30.5},
                {x: 765, y: 27.5},
                {x: 765, y: 148.5},
                {x: 480, y: 146.5},
                {x: 450, y: 174.5},
                {x: 315, y: 176.5},
                {x: 287, y: 147.5},
                {x: 2, y: 147.5}
            ]
        });


    }

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