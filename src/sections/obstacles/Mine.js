export class Mine extends Phaser.Physics.Matter.Sprite  {
    constructor(x,y,scene) {
        super(scene.matter.world, x, y, 'mine');
       // this.setCollidesWith(this.scene.matterHelper.getMainCollisionGroup());
        
       
     // debugger;
        this.scene.add.existing(this);
        this.setDepth(4);
        this.play('pulse');
        this.setCircle(100);
        this.body.key = this.constructor.name;
        this.body.isSensor = true;
    }

    delete(){
        this.destroy();
    }
   
}