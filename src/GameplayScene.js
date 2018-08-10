import { Background } from './background/Background'
import { Matter } from './matter/MatterHelper'
import { Player } from './Player'
import { SectionContainer } from './SectionContainer'
import { PointOfNoReturn } from './PointOfNoReturn'
import { moveObjectToPoint } from './Helper'
import { CollisionHandler } from './matter/CollisionHandler'

export class GameplayScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GamePlay',
            active: true
        });
    }

    preload() {
        this.load.image('player', 'assets/img/player.png');
        this.load.image('bg', 'assets/img/bg.png');
        this.load.image('gridBg', 'assets/img/Grid.png');
        this.load.image('space_rock', 'assets/img/asteroid.png');
        this.load.image('red', 'assets/img/red.png');
        this.load.image('end', 'assets/img/endOfLine.png');
        this.load.image('blackhole', 'assets/img/p5.png');
        this.load.image('cargo_1', 'assets/img/ship_1.png');
        this.load.image('cargo_2', 'assets/img/ship_2.png');
        this.load.image('cargo_3', 'assets/img/ship_3.png');
        this.load.image('cargo_4', 'assets/img/ship_4.png');
        this.load.image('cargo_5', 'assets/img/ship_5.png');
        this.load.image('cargo_6', 'assets/img/ship_6.png');
        this.load.image('cargo_7', 'assets/img/ship_7.png');
        this.load.image('cargo_8', 'assets/img/ship_8.png');
        this.load.image('thrustFlame', 'assets/img/thrustFlame.png');
        this.load.spritesheet('explosion', 'assets/img/explosion.png', { 'frameWidth': 96, 'frameHeight': 96 });
        this.load.image('spinner', 'assets/img/spinner.png');
        this.load.image('planet_1', 'assets/img/planet_19.png');
        this.load.image('planet_2', 'assets/img/planet_20.png');
        this.load.image('planet_3', 'assets/img/planet_29.png');
        this.load.image('planet_4', 'assets/img/planet_24.png');
        this.load.image('planet_5', 'assets/img/planet_22.png')
    }

    create() {

        this.matterHelper = new Matter({ scene: this });

        this.anims.create({
            key: 'kaboom',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 11 }),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });

        this.cameras.main.setZoom(0.4);
        this.matter.world.setBounds(0, 0, 0, 0);

        this.background = new Background({scene:this});
        // this.matterPhysics();
        this.createGameObjects();

        this.playerInvinsible = false;

        CollisionHandler.startCollisionDetection({ scene: this });
    }

    deleteGameObjects() {
        this.player.destroy();
        this.activeSections.deleteAllSections();
        this.background.deletePlanet();
    }

    getPlayerStats() {
        if (this.player) {
            return { 
                'distance' : Math.floor(-this.player.y / 100),
                'power' : this.player.power,
                'isTurningLeft' : this.player.isTurningLeft,
                'isTurningRight' : this.player.isTurningRight
            };
        }
    }

    onPlayerPowerThrustStart(){
        this.activeSections.setAllSectionObstaclesSensors(true);
        this.background.setSimulationBackground();
        this.activeSections.setAllSectionObstaclesTintWhite(true);
    }

    onPlayerPowerThrustEnd(){
        this.background.setRealityBackground();
        this.activeSections.setAllSectionObstaclesTintWhite(false);
        this.activeSections.setAllSectionObstaclesSensors(false);
    }


    createGameObjects() {
        this.player = new Player({ scene: this, x: 280, y: 0, matterHelper: this.matterHelper });
        this.activeSections = new SectionContainer({
            scene: this,
            x: 0,
            y: 0,
            difficulty: 1,
            width: 1000,
            matterHelper: this.matterHelper
        });

        this.activeSections.addAnotherSectionContainerAbove();
        this.createNewPointOfNoReturn();
    }

    createNewPointOfNoReturn() {
        if (this.pointOfNoReturn) {
            this.pointOfNoReturn.delete();
        }
        this.pointOfNoReturn = new PointOfNoReturn({
            scene: this, x: this.activeSections.getOldestSection().x,
            y: this.activeSections.getOldestSection().y,
            width: this.activeSections.getOldestSection().width
        });
    }

    update() {
        if (this.player.isDead()) {
            this.activeSections.updateSections();
            return;
        }
        this.activeSections.updateSections();
        if (this.isPlayerPastActiveSection()) {
            this.deleteAndAddSections();
            this.activeSections.difficulty++;
        }
        this.player.update();
        this.background.update();
        this.moveCamera();

        if (this.isPlayerPastPointOfNoReturn()) {
            moveObjectToPoint(this.player, this.pointOfNoReturn.blackHoleImg, 5);
            this.player.disableEngine();
            this.player.addToCurrentAngle(10);
        }
    }

    deleteAndAddSections() {
        this.activeSections.addAnotherSectionContainerAbove();
        if (this.activeSections.activeSectionsArray.length >= 4) {
            this.activeSections.deleteOldestSection();
            this.createNewPointOfNoReturn();
        }
    }

    isPlayerPastActiveSection() {
        return this.player.y <= this.activeSections.getTopOfSectionContainerThePlayerIsIn();
    }

    isPlayerPastPointOfNoReturn() {
        return this.player.y > this.pointOfNoReturn.getPointOfNoReturn();
    }

    moveCamera() {
        this.cameras.main.setScroll(this.player.x - this.cameras.main.width / 2, this.player.y - this.cameras.main.height - 200);
    }

}