import { GameBackground } from './GameBackground'
import { Player } from './Player'
import { SectionContainer, SECTION_TYPES } from './SectionContainer'

export class GameplayScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GamePlay',
            active: false
        });
    }

    preload() {
        this.load.image('player', 'assets/img/player.png');
        this.load.image('bg', 'assets/img/bg.png');
        this.load.image('space_rock', 'assets/img/asteroid.png');
        this.load.image('wall', 'assets/img/wall.png')
    }

    create() {
        this.cameras.main.setZoom(0.4);
        this.matter.world.setBounds(0, 0, 0, 0);

        new GameBackground(this);
        this.player = new Player({ scene: this, x: 0, y: 100 });
        this.activeSections = new SectionContainer({
            scene: this, 
            type: SECTION_TYPES[1],
            x: 0, 
            y: 0, 
            difficulty: 4,
            width: 1000
        });

        this.matterPhysics();
    }

    update() {
        this.activeSections.updateActiveSection();
        //when player reaches the top of the current container 
        if(this.player.y <= this.activeSections.getTopOfNewestSectionContainer()){
            this.activeSections.addAnotherSectionContainerAbove();
            this.activeSections.deleteOldestSection();
        }
        this.player.update();
        this.cameras.main.setScroll(this.player.x - this.cameras.main.width / 2, this.player.y - this.cameras.main.height);
    }


    matterPhysics() {
        this.matter.world.on('collisionactive', this.onCollisionActive.bind(this));
    }

    onCollisionActive(event, bodyA, bodyB) {
        //reaaaaly sucks that I have to do this
        //TODO: setup base class for matter objects that have a key 
        for (let aPair of event.pairs) {
            if (aPair.bodyA.key === "Wall" || aPair.bodyB.key === "Wall") {
                //call wall collision
               // console.log('wall');
            }
            if (aPair.bodyA.key === "Player" || aPair.bodyB.key === "Player") {
                console.log('DEAD');
            }

            if (aPair.bodyA.key === "Thruster" || aPair.bodyB.key === "Thruster") {
                this.player.queueBoostThrust();
            }
            if (aPair.bodyA.key === "SpaceRock" || aPair.bodyB.key === "SpaceRock") {
                //gotta find a better way to do this
                if(aPair.bodyA.key === "SpaceRock" && aPair.bodyB.key === "Wall"){
                    aPair.bodyA.changeDirection();
                } else if(aPair.bodyB.key === "SpaceRock" && aPair.bodyA.key === "Wall") {
                    aPair.bodyB.changeDirection();
                }
            }
        }
    }
}