import { getGameWidth, getGameHeight, placeTextInCenter, addGlowingTween } from '../Helper'
import { Levels } from '../sections/Levels'
import { LocalStorageHandler } from '../LocalStorageHandler'
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

        const titleText = placeTextInCenter(this.add.text(
            0, 
            20, 
            this.props.name.toUpperCase(), 
            { font: '40px Arial', fill: '#ffffff' }
        ));

        placeTextInCenter(this.add.text(
            0, 
            titleText.y+ 75, 
            this.props.description, 
            { font: '18px Arial', fill: '#ffffff', wordWrap: { width: getGameWidth(), useAdvancedWrap: true } },
        ));

        const objectiveText = placeTextInCenter(this.add.text(
            0, 
            titleText.y+ 200, 
            this.props.objective, 
            { font: '30px Arial', fill: '#ffffff', wordWrap: { width: getGameWidth(), useAdvancedWrap: true } },
        ));
        
        this.addMedals(objectiveText);

        addGlowingTween(this.add.image(getGameWidth() - 60, getGameHeight() - 40, 'go').setInteractive().on('pointerdown', (event) => { 
            this.scene.stop();
            this.scene.start('UIScene', {level: this.props.level});
            this.scene.start('GamePlay', {level: this.props.level});
        }, this));

        this.add.image( 70, getGameHeight() - 40, 'nah').setInteractive().on('pointerdown', (event) => {   
            this.scene.stop();
            this.scene.start('LevelSelect');
        }, this);

    }

    addMedals(objectiveText) {
        const medalOffset = 100;
        const medalSpacing = 100;
        const medalTextPosition = 380;

        this.addMedal(getGameWidth()/2 - medalSpacing, objectiveText.y + medalOffset, 'medal_bronze', 'bronze');
        this.addMedal(getGameWidth()/2, objectiveText.y + medalOffset, 'medal_silver', 'silver');
        this.addMedal(getGameWidth()/2 + medalSpacing, objectiveText.y + medalOffset, 'medal_gold', 'gold');

        const completeTime = LocalStorageHandler.getLevelCompleteTime(this.props.level);
        if (completeTime == 0) {
            return;
        }

        placeTextInCenter(
            this.add.text(
                getGameWidth()/2, 
                medalTextPosition + 70, 
                'Best Time: ' + completeTime,
                { font: '20px Arial' }
            )
        );
    }

    addMedal(x, y, imageKey, medalKey) {
        this.add.image(x, y, imageKey)
        this.add.text(x - 35, 380, 
        Levels.getLevel(this.props.level).getDecription().medalTimes[medalKey]+"\nSeconds",
        {align : 'center'});       
    }

    update() {
        this.tileBackground.tilePositionY+=1;
    }


}