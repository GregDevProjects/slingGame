import { getGameWidth, getGameHeight, placeTextInCenter, addGlowingTween } from './Helper'
import { LocalStorageHandler } from './LocalStorageHandler'
import { Levels } from './sections/Levels'

export class UIScene extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'UIScene', active: false });

       this.score = 0;
    }

    init(data) {
        this.level = data.level;
    }

    preload()
    {

    }

    create ()
    {
        this.ourGame = this.scene.get('GamePlay');
        //  Our Text object to display the Score
        
        this.isTurnArrowEnabled = LocalStorageHandler.getIsTurnArrowEnabled(); 
        this.addTurnArrows();
        addGlowingTween(
            this.add.image(getGameWidth() - 50, 30, 'menu').setInteractive().on('pointerdown', (event) => {
                this.ourGame.stopMusic();
                this.scene.start('MainMenu');
                this.scene.stop();
                this.ourGame.scene.stop();
            }, this)
        );

        addGlowingTween(
            this.add.image(50, 30, 'reset').setInteractive().on('pointerdown', (event) => {
                this.ourGame.stopMusic();
                this.ourGame.scene.restart();
                this.scene.restart();
            }, this)
        );

        const distanceText = this.distanceText = placeTextInCenter(
            this.add.text( getGameWidth()/2, 
            10, 
            '00.00', 
            { font: '30px Arial', fill: '#ffffff' }
            )
        );
        
        this.progress = this.add.graphics();

        this.progressWrapper = this.add.rectangle(
            getGameWidth()/2, 
            getGameHeight() - 145,
            50, 
            10
        );
        this.progressWrapper.setStrokeStyle(2, 0xff33dc);
        this.isLevelComplete = false;
        
        this.setLevelMedalTimesAndImage(distanceText);

        
    }

    setLevelMedalTimesAndImage(distanceText) {
        if (this.level != 0) {
            this.medalTimes = Levels.getLevel(this.level).getDecription().medalTimes
            this.timeMedalImage = this.add.image(
                distanceText.x - 20,
                distanceText.y,
                'medal_gold'
            )
            .setAlpha(0.6);
        } 
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
            this.hidePowerThrustBar();
            return;
        }

        const stats = this.ourGame.getPlayerStats();
        
        if(!stats){
            return;
        }

        if (stats.isBoostBarShown) {
            this.setPowerThrustProgressBar(stats);
            
        } else {
            this.hidePowerThrustBar();
        }
        this.lastPower = stats.power;
        this.setLevelDistanceAndTime(stats);
        
        if (this.isTurnArrowEnabled) {
            this.lightUpTurnArrows(stats);
        } 
    }


    isPowerThrustFull(currentPower) {
        return currentPower >= 100;
    }

    setLevelDistanceAndTime(stats) {
        let text = '';
        const time = Phaser.Math.RoundTo(stats.time, -2);
        if (this.level === 0) {
            text = stats.distance;
        } else {
            text = Phaser.Math.RoundTo(time, -2);
            this.setMedalImage(time);
        }

        this.distanceText.setText(
            text
        );
        
        
    }

    setMedalImage(time) {
        const timeMedalImage = this.timeMedalImage;

        if(!timeMedalImage.active) {
            return;
        }

        if (time <= this.medalTimes.gold) {
            if (timeMedalImage.texture.key !== 'medal_gold')
                timeMedalImage.setTexture('medal_gold');
        } else if (time <=  this.medalTimes.silver) {
            if (timeMedalImage.texture.key !== 'medal_silver')
                timeMedalImage.setTexture('medal_silver');
        } else if (time <=  this.medalTimes.bronze) {
            if (timeMedalImage.texture.key !== 'medal_bronze')
                timeMedalImage.setTexture('medal_bronze');
        } else {
            this.timeMedalImage.destroy();
        }
        
    }

    setPowerThrustProgressBar(stats) {
        if(stats.power < 0) {
            return;
        }
        this.progressWrapper.setVisible(true);
        this.progress.setVisible(true);
        const width = 50;
        this.progress.clear();
        this.progress.fillStyle(0xffffff, 1);

        this.progress.fillRect(
            getGameWidth()/2 - width/2, 
            getGameHeight() - 150,
            stats.power/100 * width, 
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

        this.addMedalImage(levelTime);

        addGlowingTween(
            this.add.image(getGameWidth() - 90, getGameHeight() - 50, 'replay').setInteractive().on('pointerdown', (event) => {
                this.scene.restart();
                this.ourGame.stopMusic();
                this.ourGame.scene.restart();
            }, this)
        );
        addGlowingTween(
            this.add.image(90, getGameHeight() - 50, 'nah').setInteractive().on('pointerdown', (event) => {
                this.ourGame.stopMusic();
                this.scene.stop('GamePlay');
                this.scene.stop('UIScene');
                this.scene.start('LevelSelect');
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