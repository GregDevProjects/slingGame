export class GameBackground extends Phaser.GameObjects.TileSprite {
    constructor(scene){
        super(scene, 0, 0, window.innerWidth *1000, window.innerHeight *1000, 'bg');
        scene.add.existing(this);
    }
}