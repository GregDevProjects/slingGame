const killTimer = 10000;


export class Mine extends Phaser.Physics.Matter.Sprite  {
    constructor(x,y,scene) {
        super(scene.matter.world, x, y, 'mine');
        this.scene.add.existing(this);
        this.setDepth(4);
        this.play('pulse');
        this.setCircle(100);
        this.body.key = this.constructor.name;
        this.body.isSensor = true;
        this.scene.time.addEvent({
            delay: killTimer, 
            callback: function () { 
                if(!this || !this.scene) {
                    return;
                }
                this.destroy();
            }, 
            callbackScope: this, 
            startAt: 0 
        })
    }

    delete(){
        this.destroy();
    }
   
}