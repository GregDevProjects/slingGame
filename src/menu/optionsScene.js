import { getGameWidth, getGameHeight, placeTextInCenter } from '../Helper'
import { LocalStorageHandler } from '../LocalStorageHandler'


const TURN_ARROW = {
    enabled : 'TURN ARROWS ENABLED',
    disabled : 'TURN ARROWS DISABLED'
}

const MUSIC = {
    enabled : 'MUSIC ON',
    disabled : 'MUSIC OFF'
}

export class Options extends Phaser.Scene {

    constructor() {
        super({ key: 'Options', active: false });
    }

    preload() {

    }

    create() {
        this.tileBackground = this.add.tileSprite(getGameWidth() / 2, getGameHeight() / 2, getGameWidth(), getGameHeight(), 'bg');
        this.add.image(getGameWidth() / 2, 50, 'options').setScale(1.4, 1.4);
        placeTextInCenter(this.add.text(
                getGameWidth()/2,
                150,
                LocalStorageHandler.getIsMusicEnabled() ? MUSIC.enabled : MUSIC.disabled,
                { font: '30px Arial', fill: '#ffffff' }
            ).setInteractive().on('pointerdown', function() {  
                let newValue = !LocalStorageHandler.getIsMusicEnabled()
                LocalStorageHandler.setIsMusicEnabled(newValue); 
                this.setText(newValue ? MUSIC.enabled : MUSIC.disabled);
        }));

        placeTextInCenter(
            this.text = this.add.text(
                getGameWidth()/2,
                250,
                LocalStorageHandler.getIsTurnArrowEnabled() ? TURN_ARROW.enabled : TURN_ARROW.disabled,
                { font: '30px Arial', fill: '#ffffff', align: 'center', wordWrap: { width: getGameWidth(), useAdvancedWrap: true } }
            ).setInteractive().on('pointerdown', function() {  
                let newValue = !LocalStorageHandler.getIsTurnArrowEnabled()
                LocalStorageHandler.setIsTurnArrowEnabled(newValue); 
                this.setText(newValue ? TURN_ARROW.enabled : TURN_ARROW.disabled);
        }));


        this.add.image( 70, getGameHeight() - 40, 'nah').setInteractive().on('pointerdown', (event) => {   
            this.scene.stop();
            this.scene.start('MainMenu');
        }, this);
    }

    update() {
        this.tileBackground.tilePositionY += 1;
    }

}