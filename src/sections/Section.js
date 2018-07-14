import { FloatingSpaceRocks } from './obstacles/FloatingSpaceRocks'
import { GridTraffic } from './obstacles/GridTraffic'
import { Tube } from './tracks/Tube'
import { Diamond } from './tracks/Diamond'
import { getRandomInt } from '../Helper'

export class Section{
    constructor(config){

        this.allObstacles =[ GridTraffic, FloatingSpaceRocks ];
        this.allTracks = [ Diamond, Tube ];

        this.height= 2000;
        this.topY= config.y - this.height;
        this.x = config.x;
        this.y = config.y;
        this.width = config.width;
        this.wallWidth = 200;
        this.scene = config.scene;
        
        this.wallWidth = 200;
        //(x,y,wallWidth,height, width, scene)
        this.walls = this.allTracks[getRandomInt(0,1)].makeAndGetBodies({
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            wallWidth: this.wallWidth,
            scene: config.scene
        });
        
        this.obstacles = this.allObstacles[getRandomInt(0,1)].makeAndGetBodies({
            scene: this.scene,
            x: this.x + this.wallWidth, 
            y: this.y, 
            width: this.width - this.wallWidth,
            height: this.height,
            difficulty: config.difficulty
        }); 
     //   this.makeSpaceRockTube(config); 
        
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

    makeSpaceRockTube(config){
        //x,y,width,height,difficulty, scene
        this.bodies = FloatingSpaceRocks.makeAndGetBodies(this.x + this.wallWidth,this.y,this.width - this.wallWidth,this.height,4,config.scene);
        this.bodies = this.bodies.concat(Tube.makeAndGetBodies(this.x, this.y, this.wallWidth, this.height, this.width, config.scene));

    }

    update(){

        this.obstacles.forEach((aBody)=>{
            aBody.update();
        });
    }

    delete(){
      //  debugger;

        this.obstacles.forEach((aBody)=>{
            aBody.delete();
        });

        this.walls.forEach((aBody)=>{
            aBody.destroy();
        })
    }
}