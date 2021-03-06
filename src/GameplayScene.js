import { Background } from './background/Background'
import { Matter } from './matter/MatterHelper'
import { Player } from './player/Player'
import { SectionContainer } from './SectionContainer'
import { PointOfNoReturn } from './PointOfNoReturn'
import { CollisionHandler } from './matter/CollisionHandler'
import { LocalStorageHandler } from './LocalStorageHandler'

import { Pursuer } from './sections/obstacles/pursuer/Pursuer'

import { getGameHeight, getGameWidth } from './Helper'



export class GameplayScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GamePlay',
            active: false
        });
    }

    init(data) {
        this.level = data.level;
    }

    preload() {

    }

    create() {
        this.matterHelper = new Matter({ scene: this });
        this.cameras.main.setZoom(0.4);
        this.matter.world.setBounds(0, 0, 0, 0);
        this.background = new Background({scene:this});
        this.uIScene = this.scene.get('UIScene');
        if (LocalStorageHandler.getIsMusicEnabled()) {
            this.scene.get('Music').playGameplayMusic();
        }

        this.player = new Player({ scene: this, x: 280, y: 0, matterHelper: this.matterHelper });
        this.createGameObjects();
        
        this.playerInvinsible = false;
        this.isLevelFinished = false;
        this.finishLine = false;

        CollisionHandler.startCollisionDetection({ scene: this });
    }

    stopMusic() {
        this.scene.get('Music').stopMusic();
    }

    update(time, delta) {
        if (this.isLevelFinished) {
            this.player.update();
            this.background.update();
            this.moveCamera();
            return;
        }

        this.activeSections.updateSections();
      
        if (this.player.isDead()) {
            return;
        }

        if (this.isPlayerPastActiveSection() && !this.activeSections.getIsLastSection()) {
            this.deleteAndAddSections();
            this.activeSections.difficulty++;
        }

        if(this.activeSections.getIsLastSection()){
            
            if (!this.finishLine){
                this.finishLine = this.addFinishLine();
            }

            if (this.isPlayerOverFinish()) {
                this.onLevelCompletedSuccessfully();
            }
        }

        this.player.update(delta);
        this.background.update();
        this.moveCamera();

        if (this.pointOfNoReturn.isPlayerPastPointOfNoReturn()) {
            this.pointOfNoReturn.sendPlayerToBlackHole();
        }
    }

    createGameObjects() {
        this.activeSections = new SectionContainer({
            scene: this,
            x: 0,
            y: 0,
            difficulty: 1,
            width: 1000,
            matterHelper: this.matterHelper,
            level: this.level
        });

        this.activeSections.addAnotherSectionAbove();
        this.createNewPointOfNoReturn();
    }

    killPlayer() {
        this.activeSections.deleteGlobalObstacles();
        this.player.onDeath().on('animationcomplete', function () {
            this.scene.get('Music').stopMusic();
            this.scene.restart();
            this.uIScene.scene.restart();     
        }.bind(this));
    }


    onPlayerDeathExplosionEnd() {
        this.deleteGameObjects();
        this.createGameObjects();
        this.player.reset();
    }

    deleteGameObjects() {
        this.activeSections.deleteAllSections();
        this.activeSections.deleteGlobalObstacles();
        this.background.deletePlanet(); 
    }

    getPlayerStats() {
        if (this.player) {
            return { 
                'distance' : Math.floor(-this.player.y / 100),
                'power' : this.player.boostHandler.power,
                'isBoostBarShown' : this.player.boostHandler.isBoostBarShown,
                'isTurningLeft' : this.player.isTurningLeft,
                'isTurningRight' : this.player.isTurningRight,
                'time' : this.player.getSecondsAlive()
            };
        }
    }


    createNewPointOfNoReturn() {
        if (this.pointOfNoReturn) {
            this.pointOfNoReturn.delete();
        }
        this.pointOfNoReturn = new PointOfNoReturn({
            scene: this, 
            x: this.activeSections.getOldestSection().x,
            y: this.activeSections.getOldestSection().y,
            width: this.activeSections.getOldestSection().width
        });
    }

    onLevelCompletedSuccessfully() {
        //start finish sequence here
        this.activeSections.deleteGlobalObstacles();
        this.player.setIsFinishedLevel();
        this.scene.get('UIScene').setLevelComplete();
        this.isLevelFinished = true;
    }

    addFinishLine() {
        //const linePosition = this.activeSections.getTopOfNewestSectionContainer();
        return this.add.tileSprite(
            this.activeSections.leftXOfNewestSectionContainer(), 
            this.activeSections.getTopOfNewestSectionContainer() - 200, 
            4000,
            400,
            'finish'
        ).setDepth(3);
    }

    isPlayerOverFinish() {
        return this.player.y < this.finishLine.y + this.finishLine.height/2;
    }

    deleteAndAddSections() {
        this.activeSections.addAnotherSectionAbove();
        if (this.activeSections.activeSectionsArray.length >= 4) {
            this.activeSections.deleteOldestSection();
            this.createNewPointOfNoReturn();
        }
    }

    isPlayerPastActiveSection() {
        return this.player.y <= this.activeSections.getTopOfSectionContainerThePlayerIsIn();
    }

    moveCamera() {
        this.cameras.main.setScroll(this.player.x - this.cameras.main.width / 2, this.player.y - this.cameras.main.height - 200);
    }

}