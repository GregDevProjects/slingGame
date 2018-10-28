import { getGameWidth, getGameHeight, placeTextInCenter, addGlowingTween } from '../Helper'
import { LocalStorageHandler } from '../LocalStorageHandler'


const description = 'Randomly generated level that goes on forever \
 and gets more difficult the longer it\'s played \
 . Be warned - this isn\'t even remotely fair';

export class Endless extends Phaser.Scene {

    constructor() {
        super({ key: 'Endless', active: false });
    }

    preload() {

    }

    create() {
        const bestDistance = LocalStorageHandler.getLevelCompleteTime(0);
        const textStart = 125;

        this.tileBackground = this.add.tileSprite(getGameWidth() / 2, getGameHeight() / 2, getGameWidth(), getGameHeight(), 'bg');
        this.add.image(getGameWidth() / 2, 50, 'endless').setScale(1.4, 1.4);

        this.description = placeTextInCenter(this.add.text(
            0, 
            textStart, 
            description, 
            { font: '25px Arial', fill: '#ffffff', wordWrap: { width: getGameWidth(), useAdvancedWrap: true } },
        ));

        placeTextInCenter(
            this.add.text(
                getGameWidth()/2, 
                this.description.y + this.description.height + 75, 
                'Farthest Distance: ' + bestDistance,
                { font: '20px Arial' }
            )
        );  

        this.add.image( 70, getGameHeight() - 40, 'nah').setInteractive().on('pointerdown', (event) => {   
            this.scene.stop();
            this.scene.start('MainMenu');
        }, this);

        addGlowingTween(this.add.image(getGameWidth() - 60, getGameHeight() - 40, 'go').setInteractive().on('pointerdown', (event) => { 
            this.play();
        }, this));
    }

    play() {
        this.scene.stop();
        this.scene.start('GamePlay', {level : 0});
        this.scene.start('UIScene', {level : 0});
    }

    update() {
        this.tileBackground.tilePositionY += 1;
    }

}