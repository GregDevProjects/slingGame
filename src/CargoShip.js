import { getRandomInt } from './Helper'

export class CargoShip extends Phaser.Physics.Matter.Image{
    constructor(config){
        super(config.scene.matter.world, config.x, config.y, 'cargo_' + config.cargoKeyNumber);
        this.body.key=this.constructor.name; 
        this.body.changeDirection = this.changeDirection.bind(this);
        this.scene.add.existing(this);
        this.velocity = 1;
        this.setStatic(true);
    }

    changeDirection(){
        this.velocity = -this.velocity;
    }

    update(){
        this.y-=3;
    }

    getTop(){
        return this.y - this.height/2;
    }

    getRight(){
        return this.x + this.width/2;
    }

    getDimensions(){
        //get demensions before creating 
        this.scene.textures.get('cargo_1').getSourceImage().width
    }

}