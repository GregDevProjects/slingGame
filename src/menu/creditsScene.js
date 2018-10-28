import { getGameWidth, getGameHeight, placeTextInCenter, getRandomInt } from '../Helper'
import { LocalStorageHandler } from '../LocalStorageHandler'
import { MuisicPlayer } from '../Music'


export class Credits extends Phaser.Scene {

    constructor() {
        super({ key: 'Credits', active: false });
    }

    preload() {

    }

    create() {
        this.tileBackground = this.add.tileSprite(getGameWidth() / 2, getGameHeight() / 2, getGameWidth(), getGameHeight(), 'bg');
        this.add.image(getGameWidth() / 2, 50, 'credits').setScale(1.4, 1.4);
        
        this.music = new MuisicPlayer({scene : this}).playCreditsMusic();

        this.loopCredits(0);

        this.add.image( 70, getGameHeight() - 40, 'nah').setDepth(10).setInteractive().on('pointerdown', (event) => {   
            this.scene.stop();
            this.scene.start('MainMenu');
            this.music.destroyAudio();
        }, this);
        
        this.cargoShips = [new scrollingCargoShip(this)];
        this.spawnShipsRandomly();
    }

    update() {
        this.tileBackground.tilePositionY += 1;
        this.manageShips();
 
    }

    loopCredits(creditIndex) {
      
        this.tweens.add({
            targets: this.getCreditText(creditIndex),
            alpha: 1,
            duration: 1000,
            yoyo: true,
            hold: 2500,
            onComplete: function (tween) {
                this.parent.scene.loopCredits(this.parent.scene.isCreditLoopRestarted(creditIndex) ? 0 : creditIndex + 1)
            }
        });
    }

    isCreditLoopRestarted(currentIndex) {
        return currentIndex+1  > credits.length - 1 ? true : false;
    }

    getCreditText(index) {
        const allText = [];
        allText.push(placeTextInCenter(this.add.text(
            getGameWidth()/2,
            150,
            credits[index].role,
            { font: '30px Arial', fill: '#ffffff' }
        ).setAlpha(0)));
        
        credits[index].names.forEach(function(name, i){
            const startYPostion = 225;
            const spacing = 50;
            allText.push(placeTextInCenter(this.add.text(
                getGameWidth()/2,
                startYPostion + (spacing * i),
                name,
                { font: '20px Arial', fill: '#ffffff' }
            ).setAlpha(0)));
        }.bind(this))

        return allText;
    }

    manageShips() {
        this.cargoShips.forEach((ship, index, object) => {
            if(ship.isOffScreen()) {
                ship.kill();
                object.splice(index, 1);
            } else {
                ship.update();
            }
        })
    }

    spawnShipsRandomly() {
        this.time.delayedCall(
            getRandomInt(5000, 20000), 
            function() {
                this.cargoShips.push(new scrollingCargoShip(this));
                this.spawnShipsRandomly();
            }.bind(this)
        );
    }

}

class scrollingCargoShip extends Phaser.GameObjects.Image {
    constructor(scene) {
        super(scene, -200, getRandomInt(getGameHeight(), getGameHeight() - 300), 'cargo_' + getRandomInt(2,8));
        this.setAngle(90);
        scene.add.existing(this);
    }

    update() {
        this.x++;
    }

    isOffScreen() {
        return (this.x - this.height/2) >= getGameWidth();
    }   

    kill() {
        this.destroy();
    }
}

const credits = [
    {
        role : 'Gameplay Consultants',
        names : [
            'Michael \'Styles\' MacIsaac',
            'Veronica \'Ronni\' MacIsaac'
        ]  
    },
    {
        role : 'Music',
        names : [
            'Matthew Pablo',
            'Alexandr Zhelanov',
            'Alex \'http://cynicmusic.com\''
        ]
    },
    {
        role : 'Ship Art',
        names : [
            'Skorpio'
        ]
    },
    {
        role : 'Planet Art',
        names : [
            '\'Unnamed\''
        ]
    },   
    {
        role : 'Medals, Satellite',
        names : [
            'Kenney.nl'
        ]
    },
    {
        role : 'Explosion Animation',
        names : [
            'J-Robot'
        ]
    },
    {
        role : 'Asteroid Art',
        names : [
            'FunwithPixels'
        ]
    },
    {
        role : 'Missile Art',
        names : [
            'samoliver'
        ]
    },
    {
        role : 'Background',
        names : [
            'Ivan Voirol'
        ]
    },
    {
        role : 'Arrow Art',
        names : [
            'oglsdl'
        ]
    },
    {
        role : 'Thruster Art',
        names : [
            'Prinsu-Kun'
        ]
    },
    {
        role: 'Pursuer Mine Animation',
        names : [
            'ashishlko11'
        ]
    },
    {
        role : 'Everything Else',
        names : [
            'Greg McLean'
        ]
    },
]