//for spawning sunday drivers as non-global obstacles

const TubeWidth = 1000;
const wallWidth = 200;

import { SundayDriver } from '../obstacles/SundayDriver'
import { getRandomInt } from '../../Helper'

export class SundayDriverClump {

    static makeAndGetBodies(config) {
        let bodies = [];
        let SpaceRockDistance = config.height / (config.difficulty + 1);

        const startOnLeft = getRandomInt(0,1);

        for (let i = 1; i < config.difficulty + 1; i++) {
            let driver = new SundayDriver(
                {
                    scene: config.scene,
                    y: config.y - SpaceRockDistance * i,
                    x: startOnLeft ? config.x + 100 : (config.x + TubeWidth - 50) - wallWidth*2,
                    player: config.scene.player,
                    startOnLeft : startOnLeft
                }
            )

            if (config.isSpawnedWhite){
                driver.setTintFill(0xffffff);
            }
            
            bodies.push(
                driver
            );
        }
      
        return bodies;
    }
}