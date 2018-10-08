import { Background } from './background/Background'
import { Matter } from './matter/MatterHelper'
import { Player } from './Player'
import { SectionContainer } from './SectionContainer'
import { PointOfNoReturn } from './PointOfNoReturn'
import { moveObjectToPoint, getGameWidth } from './Helper'
import { CollisionHandler } from './matter/CollisionHandler'
import { GlobalObstacleContainer } from './GlobalObstacleContainer'


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
        
        // this.matterPhysics();
        this.player = new Player({ scene: this, x: 280, y: 0, matterHelper: this.matterHelper });
        this.createGameObjects();
        // this.cameras.main.setBounds(0, 0, 3200, 600);
        
        this.playerInvinsible = false;
        this.isLevelFinished = false;
        this.finishLine = false;

        CollisionHandler.startCollisionDetection({ scene: this });

       // this.addGlobalObstacleToTopOfSection();
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
        this.globalObstacles = new GlobalObstacleContainer({ scene: this, matterHelper: this.matterHelper });

        this.activeSections.addAnotherSectionAbove();
        this.createNewPointOfNoReturn();
    }

    onPlayerDeathExplostionStart() {
        this.globalObstacles.deleteAllObstacles();
    }

    onPlayerDeathExplosionEnd() {
        this.deleteGameObjects();
        this.createGameObjects();
        this.player.reset();
    }

    deleteGameObjects() {
        this.activeSections.deleteAllSections();
        this.background.deletePlanet(); 
    }

    getPlayerStats() {
        if (this.player) {
            return { 
                'distance' : Math.floor(-this.player.y / 100),
                'power' : this.player.power,
                'isTurningLeft' : this.player.isTurningLeft,
                'isTurningRight' : this.player.isTurningRight,
                'time' : this.player.getSecondsAlive()
            };
        }
    }

    onPlayerPowerThrustStart(){
        this.activeSections.setAllSectionObstaclesSensors(true);
        this.background.setSimulationBackground();
        this.activeSections.setAllSectionObstaclesTintWhite(true);
        this.globalObstacles.setAllObstaclesTintWhite(true);
    }

    onPlayerPowerThrustEnd(){
        this.background.setRealityBackground();
        this.activeSections.setAllSectionObstaclesTintWhite(false);
        this.activeSections.setAllSectionObstaclesSensors(false);
        this.globalObstacles.setAllObstaclesTintWhite(false);
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
        } //else {

        if(this.activeSections.getIsLastSection()){
            
            if (!this.finishLine){
                this.finishLine = this.addFinishLine();
            }

            if (this.isPlayerOverFinish()) {
                this.onLevelCompletedSuccessfully();
            }
        }

        this.player.update();
        this.background.update();
        this.moveCamera();

        if (this.isPlayerPastPointOfNoReturn()) {
            this.sendPlayerToBlackHole();
        }
    }

    onLevelCompletedSuccessfully() {
        //start finish sequence here
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

    isTimeToAddGlobalObstacle() {
        return this.activeSections.difficulty % 5 === 0;
    } 

    addGlobalObstacleToTopOfSection() {
        this.globalObstacles.addObstacle(
            { 
                x:  this.activeSections.leftXOfNewestSectionContainer() + 300, 
                y: this.activeSections.getTopOfNewestSectionContainer() - 100, 
                player: this.player 
            }
        );
    }

    sendPlayerToBlackHole() {
        moveObjectToPoint(this.player, this.pointOfNoReturn.blackHoleImg, 5);
        this.player.disableEngine();
        this.player.addToCurrentAngle(10);
    }

    deleteAndAddSections() {
        console.log('added section')
        this.activeSections.addAnotherSectionAbove();
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