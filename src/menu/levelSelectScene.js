import { getGameWidth, getGameHeight } from '../Helper'
import { LocalStorageHandler } from '../LocalStorageHandler'
import { Levels } from '../sections/Levels'

export class LevelSelect extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'LevelSelect', active: false });
    }

    preload() {

    }

    create () {
        this.textMoveDirection = moveDirection[0];
        this.allText = [];

        this.tileBackground = this.add.tileSprite(getGameWidth()/2, getGameHeight()/2, getGameWidth(), getGameHeight(), 'bg');

        this.add.image( 70, getGameHeight() - 40, 'nah').setInteractive().on('pointerdown', (event) => {   
            this.scene.start('MainMenu');
            this.scene.stop('LevelSelect');
        }, this);

        this.addLevelButtons();
        this.addArrowButtons();
    }

    addArrowButtons() {
        this.upArrow = this.add.image(getGameWidth()-50, 100, 'arrow_up').setAlpha(unselectedButtonAlpha).setInteractive().on('pointerdown', (event) => {   
            this.textMoveDirection = moveDirection[1];
            this.upArrow.setAlpha(selectedButtonAlpha);
        }, this)

        this.downArrow = this.add.image(getGameWidth()-50, getGameHeight()-100, 'arrow_down').setAlpha(unselectedButtonAlpha).setInteractive().on('pointerdown', (event) => {   
            this.textMoveDirection = moveDirection[2];
            this.downArrow.setAlpha(selectedButtonAlpha);
        }, this);

        this.input.on('pointerup', function() {
            this.textMoveDirection = moveDirection[0];
            this.downArrow.setAlpha(unselectedButtonAlpha);
            this.upArrow.setAlpha(unselectedButtonAlpha);
        }.bind(this));
    }

    addLevelButtons() {
        Levels.getAllLevels().forEach(function(element, index) {      
            const levelDetails = element.getDecription();
            let text = this.add.text(
                10, 
                50 + 100*index + 1, 
                levelDetails.level + ' ' + levelDetails.name.toUpperCase(), 
                { font: '30px Arial', fill: '#ffffff' }
            ).setInteractive().on('pointerdown', function(event) {   
                if (!Levels.isLevelUnlocked(levelDetails.level)){
                    return;
                }
                this.scene.scene.start('LevelPreview', {passedProps: this.passedProps});
                this.scene.scene.stop('LevelSelect');
            });

            text.passedProps = levelDetails;

            this.allText.push(text);

            if (!Levels.isLevelUnlocked(levelDetails.level)) {
                text.setAlpha(0.5);
                return;
            }

            const medalEarned = Levels.getMedalForTime(
                levelDetails.level, 
                LocalStorageHandler.getLevelCompleteTime(levelDetails.level)
            );

            if (medalEarned !== null) {
                this.allText.push(
                    this.add.image(text.x + text.width +25, text.y + 20, medalEarned)
                );
            }      

        }.bind(this));
    }


    moveAllTextUp() {
        this.moveAllText(true);
    }

    moveAllTextDown() {
        this.moveAllText(false);
    }

    moveAllText(isMovingUp) {
        this.allText.forEach((text) => {
            if (isMovingUp) {
                text.y-=3;
            } else {
                text.y+=3;
            }
        })
    }

    update() {
        if (this.textMoveDirection === moveDirection[1]) {
            this.moveAllTextUp();
        } else if (this.textMoveDirection === moveDirection[2]) {
            this.moveAllTextDown();
        }

        this.tileBackground.tilePositionY+=1;
    }

}

const moveDirection = [
    'STOPPED',
    'UP',
    'DOWN'
]

const unselectedButtonAlpha = 0.6;
const selectedButtonAlpha = 1;