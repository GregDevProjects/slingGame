export class Wall extends Phaser.Physics.Matter.Image{
    constructor(config){
        super(config.scene.matter.world, config.x, config.y, 'wall');
        this.body.key=this.constructor.name; 
        this.scene.add.existing(this);
        this.setStatic(true);
    }

    static getHeight(){
        return 3000;
    }

    static getWidth(){
        return 200;
    }

    update(){
        //nothin doin
    }
}