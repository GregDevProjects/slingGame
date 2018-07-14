import { SpaceRock } from '../../SpaceRock'
import { getRandomInt } from '../../Helper'

export class FloatingSpaceRocks{
    
    static makeAndGetBodies(config){
        let bodies = [];
        let SpaceRockDistance = config.height/(config.difficulty +1);
        for(let i = 1; i < config.difficulty + 1; i++){
            bodies.push(
                new SpaceRock(
                    {   
                        scene: config.scene, 
                        y: config.y - SpaceRockDistance*i, 
                        x: getRandomInt(config.x, config.x + config.width) 
                    }
                )
            );
        }
        return bodies;
    }
}