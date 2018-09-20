import { getGameWidth, getGameHeight } from '../Helper'
import { LocalStorageHandler } from '../LocalStorageHandler'

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
        this.highestLevelUnlocked = LocalStorageHandler.getGameProgress();

        this.tileBackground = this.add.tileSprite(getGameWidth()/2, getGameHeight()/2, getGameWidth(), getGameHeight(), 'bg');


        this.upArrow = this.add.image(getGameWidth()-50, 100, 'arrow_up').setAlpha(unselectedButtonAlpha).setInteractive().on('pointerdown', (event) => {   
            this.textMoveDirection = moveDirection[1];
            this.upArrow.setAlpha(selectedButtonAlpha);
        }, this)

        this.downArrow = this.add.image(getGameWidth()-50, getGameHeight()-100, 'arrow_down').setAlpha(unselectedButtonAlpha).setInteractive().on('pointerdown', (event) => {   
            this.textMoveDirection = moveDirection[2];
            this.downArrow.setAlpha(selectedButtonAlpha);
        }, this);

    
        this.input.on('pointerup', function () {
            this.textMoveDirection = moveDirection[0];
            this.downArrow.setAlpha(unselectedButtonAlpha);
            this.upArrow.setAlpha(unselectedButtonAlpha);
        }.bind(this));

        this.add.image( 70, getGameHeight() - 40, 'nah').setInteractive().on('pointerdown', (event) => {   
            this.scene.stop();
            this.scene.start('MainMenu');
        }, this);

        this.addLevelButtons();


    }

    addLevelButtons() {
        dummyLevels.forEach(function(element, index) {      
            
            let text = this.add.text(
                10, 
                100 + 100*index + 1, 
                element.level + ' ' + element.name.toUpperCase(), 
                { font: '30px Arial', fill: '#ffffff' }
            ).setInteractive().on('pointerdown', function(event) {   
              //  debugger;
                if (this.passedProps.level > this.scene.highestLevelUnlocked){
                    return;
                }
                this.scene.scene.stop();
                this.scene.scene.start('LevelPreview', {passedProps: this.passedProps});
            });

            text.passedProps = element

            if (text.passedProps.level > this.highestLevelUnlocked ) {
                text.setAlpha(0.5);
            }

            this.allText.push(text);

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

const dummyLevels = [
    { 
        name: 'Highway',
        level: 1,
        description: 'Use your thruster to push off walls and maintain speed',
        objective: 'Reach the finish line '
    },
    {
        name: 'Asteroid Tube',
        level: 2
    },
    { 
        name: 'Windy Roads',
        level: 3
    },
    {
        name: 'Rush Hour',
        level: 4
    },
    { 
        name: 'Missile Run',
        level: 5
    },
    {
        name: 'Duel',
        level: 6
    }
]

const moveDirection = [
    'STOPPED',
    'UP',
    'DOWN'
]

const unselectedButtonAlpha = 0.6;
const selectedButtonAlpha = 1;