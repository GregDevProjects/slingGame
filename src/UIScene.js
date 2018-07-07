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

    }

    update(){
        //console.log(this.ourGame.getPlayerYPosition());
        this.distanceText.setText('Distance: ' + this.ourGame.getPlayerDistance());
    }
}