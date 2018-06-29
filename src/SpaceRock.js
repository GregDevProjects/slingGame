import { getRandomInt } from './Helper';
export class SpaceRock extends Phaser.Physics.Matter.Image{
    constructor(config){
        super(config.scene.matter.world, config.x, config.y, 'space_rock');
        this.body.key=this.constructor.name; 
        this.body.changeDirection = this.changeDirection.bind(this);
        this.scene.add.existing(this);
        this.velocity = 1;
        this.floatsLeft = getRandomInt(0,1);
    }
    //TODO
    //setType()

    changeDirection(){
        this.velocity = -this.velocity;
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
}