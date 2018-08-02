import { Spinner } from '../../Spinner'
import { getRandomInt } from '../../Helper'

export class Spinners {

    static makeAndGetBodies(config) {
        let bodies = [];
        let SpaceRockDistance = config.height / (config.difficulty + 1);
        for (let i = 1; i < config.difficulty + 1; i++) {
            let spaceRock = new Spinner(
                {
                    scene: config.scene,
                    y: config.y - SpaceRockDistance * i,
                    x: getRandomInt(config.x, config.x + config.width)
                }
            )

            if (config.isSpawnedWhite){
                spaceRock.tintWhite();
            }
            
            bodies.push(
                spaceRock
            );
        }
        return bodies;
    }
}