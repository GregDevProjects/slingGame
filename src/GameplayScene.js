import { GameBackground } from './GameBackground'

export class GameplayScene extends Phaser.Scene {
    constructor() {
      super({
        key: 'GamePlay',
        active: false
      });
    }

    preload ()
    {
        this.load.image('player', 'assets/player.png');
        this.load.image('bg','assets/bg.png')
    }
    
    create ()
    {
        

        let z = new GameBackground(this);

        this.player = this.createPlayer();

        this.cameras.main.startFollow(this.player);

        this.matter.world.setBounds(0, 0, 0, 0);

    
    }

    update(){
        if (this.cursors.left.isDown)
        {
           // this.player.setAngularVelocity(-0.1);
           this.player.angle-=4;
        }
        else if (this.cursors.right.isDown)
        {
           // this.player.setAngularVelocity(0.1);
            
            this.player.angle+=4;
        }

       // this.player.thrust(0.08);
    
        if (this.cursors.up.isDown)
        {
            this.player.thrust(0.2);
        }

        this.player.thrust(0.01);
    }

    createPlayer(){
        let ship = this.matter.add.image(200, 200, 'player');

        ship.setFrictionAir(0.01);
        ship.setMass(30);
        ship.setFixedRotation();

    
        this.cursors = this.input.keyboard.createCursorKeys();
        return ship;
    }



}