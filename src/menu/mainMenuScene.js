import { getGameWidth, getGameHeight } from '../Helper'
import { LocalStorageHandler } from '../LocalStorageHandler'

const disabledAlphaValue = 0.5;

export class MainMenu extends Phaser.Scene {

    constructor() {
        super({ key: 'MainMenu', active: false });
    }

    preload() {

    }

    create() {
        // this.scene.stop();
        // this.scene.start('LevelSelect');

        this.isEndlessUnlocked = LocalStorageHandler.isEndlessUnlocked();

        this.tileBackground = this.add.tileSprite(getGameWidth() / 2, getGameHeight() / 2, getGameWidth(), getGameHeight(), 'bg');
        this.add.image(getGameWidth() / 2, 50, 'title');
        this.add.image(getGameWidth() / 2, 200, 'campaign').setInteractive().on('pointerdown', (event) => {
            this.scene.stop();
            this.scene.start('LevelSelect');
        }, this);

        this.endlessButton = this.add.image(getGameWidth() / 2, 300, 'endless').setInteractive().on('pointerdown', (event) => {
            this.onEndlessButtonClick();
        }, this);

        if (!this.isEndlessUnlocked) {
            this.endlessButton.setAlpha(disabledAlphaValue);
        }

        this.add.image(getGameWidth() / 2, 400, 'options').setInteractive().on('pointerdown', (event) => {
            this.scene.stop();
            this.scene.start('Options');
        }, this);

        this.add.image(getGameWidth() / 2, 500, 'credits');


    }

    onEndlessButtonClick() {
        if (!this.isEndlessUnlocked) {
            this.showErrorText();
            return;
        }
        this.scene.stop();
        this.scene.start('GamePlay');
        this.scene.start('UIScene');
    }

    showErrorText() {
        if (this.text) {
            this.text.destroy();
        }
        this.text = this.add.text(
            getGameWidth(),
            getGameHeight() - 30,
            'COMPLETE CAMPAIGN TO UNLOCK',
            { font: '30px Arial', fill: '#ffffff' }
        );

        this.tweens.add(
            { duration: 3000, x: -this.text.width, targets: this.text }
        )

        this.tweens.add(
            { 
                duration: 50, 
                alpha: 0, 
                targets: this.endlessButton,
                loop: 10,
                onComplete : function(tween, targets){
                    targets[0].setAlpha(disabledAlphaValue);
                } 
            }
        )

        
    }

    update() {
        this.tileBackground.tilePositionY += 1;
    }

}