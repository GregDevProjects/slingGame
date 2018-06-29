//walls on each side with a configurable amount of sapce rocks evenly spread out 
import { Wall } from '../Wall'
import { SpaceRock } from '../SpaceRock'
import { Section } from './Section'

export class SpaceRockTube extends Section{

    constructor(config){
        super();
        this.bodies = [];
        this.topY= config.y - Wall.getHeight() *2;
        this.x = config.x;
        this.y = config.y;
        this.width = config.width;
        this.height= Wall.getHeight() *2;
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
        config.x += Wall.getWidth()/2;
        config.y -=Wall.getHeight()/2;

        //TODO: standardize these width calculations for other sections 
        let rightWallStartX = config.x + config.width - Wall.getWidth();

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
    
        let bottomLeftWall = new Wall({ scene: config.scene, x: config.x, y: config.y });
        let bottomRightWall = new Wall({ scene: config.scene, x: rightWallStartX, y: config.y });    
        let topLeftWall = new Wall({ scene: config.scene, x: config.x, y: bottomLeftWall.y - bottomLeftWall.height});
        let topRightWall = new Wall({ scene: config.scene, x: rightWallStartX,  y: bottomLeftWall.y - bottomLeftWall.height});

        this.bodies.push(topLeftWall,topRightWall, bottomLeftWall, bottomRightWall);

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