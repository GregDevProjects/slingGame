import { getGameWidth } from './Helper'

export class UIScene extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'UIScene', active: true });

       this.score = 0;
    }

    create ()
    {
        //  Our Text object to display the Score
        this.distanceText = this.add.text(0, 10, 'Distance: 0', { font: '30px Arial', fill: '#ffffff' });

        //  Grab a reference to the Game Scene
        this.ourGame = this.scene.get('GamePlay');

        this.progress = this.add.graphics();

    }

    update(){
        //console.log(this.ourGame.getPlayerYPosition());
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
    }
}