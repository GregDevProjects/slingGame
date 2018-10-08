import { getGameWidth, getGameHeight } from '../Helper'

export class Stars extends Phaser.GameObjects.TileSprite {
    constructor(scene){
        super(scene, getGameWidth() / 2, getGameHeight() / 2, getGameWidth()*3, getGameHeight()*5, 'bg'); //FIXME: calculate this using camera zoom
        scene.add.existing(this);
        this.gridBackground = scene.add.tileSprite(
            getGameWidth() / 2, 
            getGameHeight() / 2, 
            getGameWidth()*3, 
            getGameHeight()*5, 
            'gridBg'
        ).setVisible(false).setDepth(-2);
        this.scene = scene;
        this.setDepth(-2);
    }   

    setGridTexture() {
        this.gridBackground.setVisible(true);
    }

    setStarsTexture() {
        this.gridBackground.setVisible(false);
    }

    update() {
        this.followPlayerWithTileSprite(this);
        this.followPlayerWithTileSprite(this.gridBackground);
    }

    followPlayerWithTileSprite(tileSprite) {
        if(this.scene.player.dead) {
            return;
        }
        tileSprite.x=this.scene.player.x
        tileSprite.tilePositionX = this.scene.player.x;
        tileSprite.y=this.scene.player.y
        tileSprite.tilePositionY = this.scene.player.y;        
    }
}