export class GameBackground extends Phaser.GameObjects.TileSprite {
    constructor(scene){
        super(scene, 0, 0, window.innerWidth, window.innerHeight, 'bg');
        scene.add.existing(this);
    }   
}