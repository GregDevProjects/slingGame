import { FloatingSpaceRocks } from './obstacles/FloatingSpaceRocks'
import { GridTraffic } from './obstacles/GridTraffic'
import { Tube } from './tracks/Tube'
import { Diamond } from './tracks/Diamond'
import { getRandomInt } from '../Helper'

export class Section{
    constructor(config){
        this.wallWidth = 200;
        this.height= 2000; 
        this.allObstacles =[ GridTraffic, FloatingSpaceRocks ];
        this.allTracks = [ Diamond, Tube ];

        this.topY= config.y - this.height;
        this.x = config.x;
        this.y = config.y;
        this.width = config.width;
        this.scene = config.scene;
        this.tintWhiteOnSpawn = false;
        
        this.walls = this.allTracks[getRandomInt(0,this.allTracks.length - 1)].makeAndGetBodies({
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            wallWidth: this.wallWidth,
            scene: config.scene
        });
        
        this.obstacles = this.allObstacles[getRandomInt(0,this.allObstacles.length - 1)].makeAndGetBodies({
            scene: this.scene,
            x: this.x + this.wallWidth, 
            y: this.y, 
            width: this.width - this.wallWidth,
            height: this.height,
            difficulty: config.difficulty,
            wallWidth: this.wallWidth,
            isSpawnedWhite: config.isSpawnedWhite
        });      



        if (config.isObstaclesSensors) {
            this.setObstaclesSensors(true);
        }
    }

    setObstaclesTintWhite() {
        this.obstacles.forEach((aBody)=>{
            if(aBody.active)
                aBody.setTintFill(0xffffff);
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