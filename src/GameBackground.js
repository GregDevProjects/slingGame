import { throws } from "assert";

export class GameBackground extends Phaser.GameObjects.TileSprite {
    constructor(scene){
        // debugger;
        super(scene, 0, 0, window.innerWidth*10, window.innerHeight*10, 'bg'); //FIXME: calculate this using camera zoom
        scene.add.existing(this);
        this.scene = scene;
       // debugger;
    }   

    changeBackground() {
        if (this.texture.key === "bg") {
            this.scene.textures.setTexture(this, 'gridBg');
            return;
        }
        this.scene.textures.setTexture(this, 'bg');
    }

    update() {
        this.x=this.tilePositionX = this.scene.player.x;
        this.y=this.tilePositionX = this.scene.player.y;
        this.tilePositionX = this.scene.player.x; //change this to a value suited for your needs change - to + to change direction
        this.tilePositionY = this.scene.player.y; //change this to a value suited for your needs change - to + to change direction
    }
}