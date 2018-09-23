import { getGameWidth, getGameHeight } from '../Helper'

export class Stars extends Phaser.GameObjects.TileSprite {
    //TODO: use two seprate tilesprites for grid/stars
    constructor(scene){
        // debugger;
        super(scene, getGameWidth() / 2, getGameHeight() / 2, getGameWidth()*3, getGameHeight()*5, 'bg'); //FIXME: calculate this using camera zoom
        scene.add.existing(this);
        this.scene = scene;
        this.setDepth(-2);
    }   

    setGridTexture() {
        return;
        this.scene.textures.setTexture(this, 'gridBg');
    }

    setStarsTexture() {
        return;
        this.scene.textures.setTexture(this, 'bg');
    }

    update() {
        this.x=this.scene.player.x
        this.tilePositionX = this.scene.player.x;
        this.y=this.scene.player.y
        this.tilePositionY = this.scene.player.y;
    }
}