import { getGameWidth, getGameHeight } from './Helper'

export class MainMenu extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'MainMenu', active: false });
    }

    preload()
    {

    }

    create ()
    {
        this.tileBackground = this.add.tileSprite(getGameWidth()/2, getGameHeight()/2, 1000, 1000, 'bg');
        this.add.image(getGameWidth()/2,50, 'title');
        this.add.image(getGameWidth()/2, 200, 'campaign').setInteractive().on('pointerdown', (event) => {   
            this.scene.stop();
            this.scene.start('GamePlay');
            this.scene.start('UIScene');
        }, this);
        this.add.image(getGameWidth()/2, 300, 'endless').setInteractive().on('pointerdown', (event) => {   
            this.scene.stop();
            this.scene.start('GamePlay');
            this.scene.start('UIScene');
        }, this);
        this.add.image(getGameWidth()/2, 400, 'options');
        this.add.image(getGameWidth()/2, 500, 'credits');
 
    }


    update(){
        this.tileBackground.tilePositionY+=1;
    }

}