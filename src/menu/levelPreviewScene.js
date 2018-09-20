import { getGameWidth, getGameHeight, placeTextInCenter } from '../Helper'

export class LevelPreview extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'LevelPreview', active: false });
    }

    init(data) {
        this.props = data.passedProps;
    }

    preload() {

    }
    //►
    create () {

        this.tileBackground = this.add.tileSprite(getGameWidth()/2, getGameHeight()/2, getGameWidth(), getGameHeight(), 'bg');

        placeTextInCenter(this.add.text(
            0, 
            50, 
            this.props.name.toUpperCase(), 
            { font: '50px Arial', fill: '#ffffff' }
        ));

        placeTextInCenter(this.add.text(
            0, 
            150, 
            this.props.description, 
            { font: '30px Arial', fill: '#ffffff', wordWrap: { width: getGameWidth(), useAdvancedWrap: true } },
        ));

        placeTextInCenter(this.add.text(
            0, 
            300, 
            this.props.objective, 
            { font: '30px Arial', fill: '#ffffff', wordWrap: { width: getGameWidth(), useAdvancedWrap: true } },
        ));

        this.add.image(getGameWidth() - 60, getGameHeight() - 40, 'go')

        this.add.image( 70, getGameHeight() - 40, 'nah').setInteractive().on('pointerdown', (event) => {   
            this.scene.stop();
            this.scene.start('LevelSelect');
        }, this);

    }

    update() {
        this.tileBackground.tilePositionY+=1;
    }


}