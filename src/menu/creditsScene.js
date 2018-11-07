import { getGameWidth, getGameHeight, placeTextInCenter, getRandomInt } from '../Helper'

export class Credits extends Phaser.Scene {

    constructor() {
        super({ key: 'Credits', active: false });
    }

    preload() {

    }

    create() {
        this.tileBackground = this.add.tileSprite(getGameWidth() / 2, getGameHeight() / 2, getGameWidth(), getGameHeight(), 'bg');
        this.add.image(getGameWidth() / 2, 50, 'credits').setScale(1.4, 1.4);
        this.loopCredits(0);

        this.add.image( 70, getGameHeight() - 40, 'nah').setDepth(10).setInteractive().on('pointerdown', (event) => {   
            this.scene.stop();
            this.scene.start('MainMenu');
            this.scene.get('Music').stopMusic();
        }, this);
        
        this.cargoShips = [new scrollingCargoShip(this)];
        this.spawnShipsRandomly();
        this.scene.get('Music').playCreditsMusic();
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
            ).setAlpha(0).setDepth(3)));
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
        super(scene, -200, getRandomInt(getGameHeight() - 100, getGameHeight() - 300), 'cargo_' + getRandomInt(2,8));
        this.setAngle(90);
        scene.add.existing(this);   
        this.setDepth(2)
        this.thrusterParticles = this.scene.add.particles('orange').setDepth(1);
        
        this.thruster = this.thrusterParticles.createEmitter({
            x: 0,
            y: 1000, 
            speed: 100,
            scale: { start:1.5, end: 0 },
            blendMode: 'ADD',
            lifespan :  400,
            angle: {min:160, max: 190}
        })
    }

    update() {
        this.x++;
        this.thruster.setPosition(this.x - 100, this.y);
    }

    isOffScreen() {
        return (this.x - this.height/2) >= getGameWidth() + 100;
    }   

    kill() {
        this.thrusterParticles.destroy();
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
        role : 'Ship Art, Player Shield',
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
        role : 'Game Framework',
        names : [
            'phaser.io'
        ]
    },
    {
        role : 'Everything Else',
        names : [
            'Greg McLean'
        ]
    },
]