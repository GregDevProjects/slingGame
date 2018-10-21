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
        this.ourGame = this.scene.get('GamePlay');
        //  Our Text object to display the Score
        this.distanceText = this.add.text(5, 10, '', { font: '30px Arial', fill: '#ffffff' });
        this.isTurnArrowEnabled = LocalStorageHandler.getIsTurnArrowEnabled(); 
        this.addTurnArrows();
        addGlowingTween(
            this.add.image(getGameWidth() - 50, 30, 'menu').setInteractive().on('pointerdown', (event) => {
                //replay
                this.ourGame.stopMusic();
                this.scene.start('MainMenu');
                this.scene.stop();
                this.ourGame.scene.stop();
            }, this)
        );

        //  Grab a reference to the Game Scene
        
        this.level = this.ourGame.level;
        this.progress = this.add.graphics();

        this.progressWrapper = this.add.rectangle(
            getGameWidth()/2, 
            getGameHeight() - 145,
            50, 
            10
        );
        this.progressWrapper.setStrokeStyle(2, 0xff33dc);
        this.isLevelComplete = false;
    }

    addTurnArrows() {
        if (this.isTurnArrowEnabled) {
            const offset = 50;
            this.leftArrow = this.getArrow('arrowLeft', offset);
            this.rightArrow = this.getArrow('arrowRight', getGameWidth() - offset);
        }
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

        const stats = this.ourGame.getPlayerStats();
        
        if(!stats){
            return;
        }
        if (this.isPowerThrustIncrementing(stats.power)) {
            this.hidePowerThrustBar();
        } else {
            this.setPowerThrustProgressBar(stats);
        }
        this.lastPower = stats.power;
        this.setLevelDistanceAndTime(stats);
        
        if (this.isTurnArrowEnabled) {
            this.lightUpTurnArrows(stats);
        } 
    }

    isPowerThrustIncrementing(currentPower) {
        return (this.lastPower && currentPower == this.lastPower) || currentPower == 0;
    }

    setLevelDistanceAndTime(stats) {
        let text = '';
        if (this.level === 0) {
            text = 'Distance: ' + stats.distance;
        } else {
            text = 'Time: ' + Phaser.Math.RoundTo(stats.time, -2);
        }

        this.distanceText.setText(
            text
        );
    }

    setPowerThrustProgressBar(stats) {
        this.progressWrapper.setVisible(true);
        this.progress.setVisible(true);
        const width = 50;
        this.progress.clear();
        this.progress.fillStyle(0xffffff, 1);

        this.progress.fillRect(
            getGameWidth()/2 - width/2, 
            getGameHeight() - 150,
            stats.power * width, 
            10
        );
    }

    hidePowerThrustBar() {
        this.progressWrapper.setVisible(false);
        this.progress.setVisible(false);
    }

    lightUpTurnArrows(stats) {
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
        if (this.isTurnArrowEnabled) {
            this.leftArrow.destroy();
            this.rightArrow.destroy();
        }
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