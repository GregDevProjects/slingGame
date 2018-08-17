import { getGameWidth, getGameHeight } from './Helper'

export class UIScene extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'UIScene', active: true });

       this.score = 0;
    }

    preload()
    {
       this.load.image('arrowLeft', 'assets/img/arrow_left.png');
       this.load.image('arrowRight', 'assets/img/arrow_right.png')
    }

    create ()
    {
        //  Our Text object to display the Score
        this.distanceText = this.add.text(0, 10, 'Distance: 0', { font: '30px Arial', fill: '#ffffff' });

        //  Grab a reference to the Game Scene
        this.ourGame = this.scene.get('GamePlay');

        this.progress = this.add.graphics();

       // this.add.image(0,0,'planet');
       let offset = 50;
       this.leftArrow = this.getArrow('arrowLeft', offset);
       this.rightArrow = this.getArrow('arrowRight', getGameWidth() - offset);
    }

    getArrow(key, x) {
        return this.add.image(
            x,
            getGameHeight() - 80,
            key
         ).setAlpha(0.5)
    }

    update(){
        let stats = this.ourGame.getPlayerStats();
        if(!stats){
            return;
        }

        this.distanceText.setText(
            'Distance: ' + stats.distance
        );

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


}