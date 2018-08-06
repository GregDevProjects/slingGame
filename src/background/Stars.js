export class Stars extends Phaser.GameObjects.TileSprite {
    constructor(scene){
        // debugger;
        super(scene, 0, 0, window.innerWidth*10, window.innerHeight*8, 'bg'); //FIXME: calculate this using camera zoom
        scene.add.existing(this);
        this.scene = scene;
        this.setDepth(-2);
    }   

    setGridTexture() {
        this.scene.textures.setTexture(this, 'gridBg');
    }

    setStarsTexture() {
        this.scene.textures.setTexture(this, 'bg');
    }

    update() {
        this.x=this.scene.player.x
        this.tilePositionX = this.scene.player.x;
        this.y=this.scene.player.y
        this.tilePositionY = this.scene.player.y;
    }
}