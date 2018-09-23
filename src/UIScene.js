import { getGameWidth, getGameHeight, placeTextInCenter, addGlowingTween } from './Helper'
import { LocalStorageHandler } from './LocalStorageHandler'
import { Levels } from './sections/Levels'

export class UIScene extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'UIScene', active: false });

       this.score = 0;
    }

    preload()
    {

    }

    create ()
    {
        //  Our Text object to display the Score
        this.distanceText = this.add.text(0, 10, 'Distance: 0', { font: '30px Arial', fill: '#ffffff' });

        //  Grab a reference to the Game Scene
        this.ourGame = this.scene.get('GamePlay');

        this.progress = this.add.graphics();

       let offset = 50;
       this.leftArrow = this.getArrow('arrowLeft', offset);
       this.rightArrow = this.getArrow('arrowRight', getGameWidth() - offset);
       this.isLevelComplete = false;;

       
    }

    setLevelComplete() {
        this.isLevelComplete = true;
        this.showLevelComplete();
    }

    getArrow(key, x) {
        return this.add.image(
            x,
            getGameHeight() - 80,
            key
         ).setAlpha(0.5)
    }

    update() {

        if(this.isLevelComplete) {
            return;
        }

        let stats = this.ourGame.getPlayerStats();
        if(!stats){
            return;
        }

        this.distanceText.setText(
            'Distance: ' + stats.distance + ' Time: ' + Phaser.Math.RoundTo(stats.time, -2)
        );

        
       // debugger;
        this.progress.clear();
        this.progress.fillStyle(0xffffff, 1);
        this.progress.fillRect(0, 60,stats.power * getGameWidth(), 60);

        //TODO: use event handler for this
        if (stats.isTurningLeft) {
            this.leftArrow.setAlpha(0.5);
        } else {
            this.leftArrow.setAlpha(0.1);
        }
        if (stats.isTurningRight) {
            this.rightArrow.setAlpha(0.5);
        } else {
            this.rightArrow.setAlpha(0.1);
        }

    }
    
    showLevelComplete() {
        this.leftArrow.destroy();
        this.rightArrow.destroy();
        this.distanceText.destroy();
        this.progress.destroy();

        const levelTime =  Phaser.Math.RoundTo(this.ourGame.getPlayerStats().time, -2);

        LocalStorageHandler.saveLevelCompletionTime(this.ourGame.level, levelTime);

        this.add.image(getGameWidth()/2, 100, 'level_complete');
        placeTextInCenter(
            this.add.text(0, 200, levelTime + ' SECONDS', { font: '25px Arial', fill: '#ffffff' })
        )

        //this.add.image(getGameWidth()/2, 300, 'medal_bronze');
        this.addMedalImage(levelTime);

        addGlowingTween(
            this.add.image(getGameWidth() - 90, getGameHeight() - 50, 'replay').setInteractive().on('pointerdown', (event) => {
                //replay
                this.scene.restart();
                this.ourGame.scene.restart();
            }, this)
        );
        addGlowingTween(
            this.add.image(90, getGameHeight() - 50, 'nah').setInteractive().on('pointerdown', (event) => {
                //back
                this.scene.start('LevelSelect');
                this.scene.stop('GamePlay');
                this.scene.stop('UIScene');
               
            }, this)
        );



    }

    addMedalImage(levelTime) {
        const medalEarned = Levels.getMedalForTime(
            this.ourGame.level, 
            levelTime
        );

        if (medalEarned !== null) {
            this.add.image(getGameWidth()/2, 300, medalEarned);
        } 
    }


}