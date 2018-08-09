import { FloatingSpaceRocks } from './obstacles/FloatingSpaceRocks'
import { GridTraffic } from './obstacles/GridTraffic'
import { Tube } from './tracks/Tube'
import { Diamond } from './tracks/Diamond'
import { getRandomInt } from '../Helper'
import { Spinners } from './obstacles/Spinners'

export class Section{
    constructor(config){
        this.wallWidth = 200;
        this.height= 2000; 
        this.allObstacles = [ FloatingSpaceRocks, GridTraffic ];
        this.allTracks = [ Diamond, Tube ];

        this.topY= config.y - this.height;
        this.x = config.x;
        this.y = config.y;
        this.width = config.width;
        this.scene = config.scene;
        this.tintWhiteOnSpawn = false;

        let track = this.allTracks[getRandomInt(0,this.allTracks.length - 1)];

        this.walls = track.makeAndGetBodies({
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            wallWidth: this.wallWidth,
            scene: config.scene
        });
        

        let obstacle = this.allObstacles[getRandomInt(0,this.allObstacles.length - 1)];

        this.obstacles = obstacle.makeAndGetBodies({
            scene: this.scene,
            x: this.x + this.wallWidth, 
            y: this.y, 
            width: this.width - this.wallWidth,
            height: this.height,
            difficulty: this.getDifficultyWithCap(track.prototype.constructor.name,obstacle.prototype.constructor.name, config.difficulty),//config.difficulty,
            wallWidth: this.wallWidth,
            isSpawnedWhite: config.isSpawnedWhite
        });      

        if (track.prototype.constructor.name == 'Diamond' && config.difficulty != 1) {
            this.obstacles = [...this.obstacles, ...Spinners.makeAndGetBodies({
                scene: this.scene,
                x: this.x + this.wallWidth, 
                y: this.y, 
                width: this.width - this.wallWidth,
                height: this.height,
                difficulty: 1,
                wallWidth: this.wallWidth,
                isSpawnedWhite: config.isSpawnedWhite
            })];    
        }


        if (config.isObstaclesSensors) {
            this.setObstaclesSensors(true);
        }
    }

    getDifficultyWithCap(trackName, obstacleName, difficulty) {
        //traffic has same difficulty cap regardless of track 
        if (obstacleName == 'GridTraffic') {
            if (difficulty >= 7){
                return 7;
            }
            return difficulty;
        }

        if (trackName == 'Tube') {
            if (obstacleName == 'FloatingSpaceRocks') {
                if (difficulty >= 3) {
                    return 3;
                }
                return difficulty;
            }
        }

        if (trackName == 'Diamond') {
            if (obstacleName == 'FloatingSpaceRocks') {
                if (difficulty >= 10) {
                    return 10;
                }
                return difficulty;
            }
        }

    }

    setObstaclesTintWhite() {
        this.obstacles.forEach((aBody)=>{
            if(aBody.active){
                //console.log(aBody.)
                aBody.tintWhite();
            }
                
        });
    }

    setObstaclesTintOff() {
        this.obstacles.forEach((aBody)=>{
            if(aBody.active)
                aBody.clearTint();
        });
    }

    setObstaclesSensors(isSensor){
        this.obstacles.forEach((aBody)=>{
            if(aBody.active)
                aBody.setSensor(isSensor);
        });
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.x;
    }

    getWidth(){
        return this.width;
    }

    getTopY(){
        return this.topY;
    }

    update(){

        this.obstacles.forEach((aBody)=>{
            if(aBody.active)
                aBody.update();
        });
    }

    delete(){
      //  debugger;

        this.obstacles.forEach((aBody)=>{
            // if(aBody.anims.isPlaying) {
            //     //the body is ex
            //     continue;
            // }
            aBody.delete(false);
        });

        this.walls.forEach((aBody)=>{
            aBody.destroy();
        })
    }
}