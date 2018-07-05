//walls on each side with a configurable amount of sapce rocks evenly spread out 
import { SpaceRock } from '../SpaceRock'
import { Section } from './Section'
import { VectorWall } from '../VectorWall'

export class SpaceRockTube extends Section{

    constructor(config){
        super();
        this.bodies = [];

        this.height= 4000;

        this.topY= config.y - this.height;
        this.x = config.x;
        this.y = config.y;
        this.width = config.width;
        
        this.wallWidth = 200;
        this.makeSpaceRockTube(config); 
        
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
        //makes it easier to target middle of image


        //TODO: break this into a difficulty modifier that can be added to any section
        var SpaceRockDistance = this.height/(config.difficulty +1);
        for(let i = 1; i < config.difficulty + 1; i++){
            let middleOfTube = config.width/2;
            this.bodies.push(
                new SpaceRock(
                    {scene: config.scene, 
                        y: this.y - SpaceRockDistance*i, 
                        x:middleOfTube 
                    })
            );
        }
        
        let leftWall = [
            {x:this.x, y:this.y},
            {x:this.x + this.wallWidth, y: this.y},
            {x:this.x + this.wallWidth, y: this.y - this.height},
            {x:this.x, y: this.y - this.height}
        ]

        let rightWall = [
            {x:this.x + this.width - this.wallWidth, y:this.y},
            {x:this.x + this.width - this.wallWidth, y:this.y - this.height},
            {x:this.x + this.width, y:this.y - this.height},
            {x:this.x + this.width, y:this.y}
        ]

        this.bodies.push(
            new VectorWall({scene:config.scene, vertices: leftWall}),
            new VectorWall({scene:config.scene, vertices: rightWall})
        );

    }

    update(){
        this.bodies.forEach((aBody)=>{
            aBody.update();
        });
    }

    delete(){
        this.bodies.forEach((aBody)=>{
            aBody.destroy();
        })
    }
}