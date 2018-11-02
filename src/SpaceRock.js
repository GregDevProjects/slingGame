import { getRandomInt } from './Helper';
import { destroyObject } from './matter/MatterHelper'

export class SpaceRock extends Phaser.Physics.Matter.Sprite{
    constructor(config){
        super(config.scene.matter.world, config.x, config.y, 'space_rock');   
        this.setBodyVertices();
        this.body.key=this.constructor.name; 
        this.body.changeDirection = this.changeDirection.bind(this);
        this.scene.add.existing(this);
        this.body.delete = this.delete.bind(this);
        this.velocity = 1;
        this.floatsLeft = getRandomInt(0,1);
        this.setCollisionCategory(this.scene.matterHelper.getMainCollisionGroup());
        this.setDepth(2);
    }

    setBodyVertices() {
        this.setPolygon(0,0, {
            vertices: [
                { x: 73, y: 20 }, 
                { x: 116, y: 36 },
                { x: 152, y: 91 }, 
                { x: 104, y: 141 },
                { x: 72, y: 144 }, 
                { x: 26, y: 124 }, 
                { x: 7, y: 99 }, 
                { x: 6, y: 63 }
            ]
        });
    }

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

    removeTint() {
        this.clearTint();
    }
}