import { GameBackground } from './GameBackground'
import { Player } from './Player'
import { SectionContainer, SECTION_TYPES } from './SectionContainer'
import { PointOfNoReturn } from './PointOfNoReturn' 
import { moveObjectToPoint } from './Helper'


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
        this.load.image('space_rock', 'assets/img/asteroid.png');
        this.load.image('red', 'assets/img/red.png');
        this.load.image('end', 'assets/img/endOfLine.png');
        this.load.image('blackhole', 'assets/img/p5.png');
        this.load.image('cargo_1','assets/img/ship_1.png');
        this.load.image('cargo_2','assets/img/ship_2.png');
        this.load.image('cargo_3','assets/img/ship_3.png');
        this.load.image('cargo_4','assets/img/ship_4.png');
        this.load.image('cargo_5','assets/img/ship_5.png');
        this.load.image('cargo_6','assets/img/ship_6.png');
        this.load.image('cargo_7','assets/img/ship_7.png');
        this.load.image('cargo_8','assets/img/ship_8.png');
        this.load.spritesheet('explosion', 'assets/img/explosion.png', { 'frameWidth': 96, 'frameHeight': 96 });
    }

    create() {

        this.anims.create({
            key: 'kaboom',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 11 }),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        }); 

        this.cameras.main.setZoom(0.2);
        this.matter.world.setBounds(0, 0, 0, 0);

      //  new GameBackground(this);

        this.matterPhysics();
        this.createGameObjects();

        this.playerInvinsible = false;
        //use another scene https://labs.phaser.io/edit.html?src=src\scenes\ui%20scene%20es6.js
      //  this.scoreText = this.add.text(0,0, 'score: 0', { fontSize: '62px', fill: '#ffffff' });

    }

    deleteGameObjects(){
        this.player.destroy();
        this.activeSections.deleteAllSections();
    }

    getPlayerDistance(){
        if(this.player){
            return Math.floor(-this.player.y/100);
        }
    }

    createGameObjects(){
        this.player = new Player({ scene: this, x: 280, y: 0 });
        this.activeSections = new SectionContainer({
            scene: this, 
            x: 0, 
            y: 0, 
            difficulty: 4,
            width: 1000
        });

        this.activeSections.addAnotherSectionContainerAbove();  
        this.createNewPointOfNoReturn();
    }

    createNewPointOfNoReturn(){
        if(this.pointOfNoReturn){
            this.pointOfNoReturn.delete();
        }
        this.pointOfNoReturn = new PointOfNoReturn({     
            scene: this, x:this.activeSections.getOldestSection().x, 
            y:this.activeSections.getOldestSection().y, 
            width:this.activeSections.getOldestSection().width 
        });
    }

    update() {
        if(this.player.isDead()){
            this.activeSections.updateSections();
            return;
        }
        this.activeSections.updateSections();
        if(this.isPlayerPastActiveSection()){ 
            this.deleteAndAddSections();
        }
        this.player.update();
        this.moveCamera();

        if(this.isPlayerPastPointOfNoReturn()){
            moveObjectToPoint(this.player, this.pointOfNoReturn.blackHoleImg, 5);
            this.player.disableEngine(); 
            this.player.addToCurrentAngle(10);
        } 
    }

    deleteAndAddSections(){
        this.activeSections.addAnotherSectionContainerAbove();
        if(this.activeSections.activeSectionsArray.length >=4){
            this.activeSections.deleteOldestSection();
            this.createNewPointOfNoReturn();
        }
    }

    isPlayerPastActiveSection(){
        return this.player.y <= this.activeSections.getTopOfSectionContainerThePlayerIsIn();
    }

    isPlayerPastPointOfNoReturn(){
        return this.player.y > this.pointOfNoReturn.getPointOfNoReturn();
    }

    moveCamera() {
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
            if ((aPair.bodyA.key === "Player" || aPair.bodyB.key === "Player") && (aPair.bodyA.key !== "Thruster" && aPair.bodyB.key !== "Thruster")) {
                if(!this.playerInvinsible){
                    this.onPlayerCollisionWithNonTruster();
                }
                
            }

            if (aPair.bodyA.key === "Thruster" || aPair.bodyB.key === "Thruster") {
                this.player.queueBoostThrust();
            }
            if (aPair.bodyA.key === "SpaceRock" || aPair.bodyB.key === "SpaceRock") {
                //gotta find a better way to do this
                if(aPair.bodyA.key === "SpaceRock" && aPair.bodyB.key === "VectorWall"){
                    aPair.bodyA.changeDirection();
                } else if(aPair.bodyB.key === "SpaceRock" && aPair.bodyA.key === "VectorWall") {
                    aPair.bodyB.changeDirection();
                }
            }
        }
    }

    onPlayerCollisionWithNonTruster(){
        this.player.onDeath().on('animationcomplete', function() { 
            this.deleteGameObjects();
            this.createGameObjects();
        }.bind(this), this.scene);
    }
}