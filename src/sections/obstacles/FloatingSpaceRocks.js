import { SpaceRock } from '../../SpaceRock'

export class FloatingSpaceRocks {

    static makeAndGetBodies(config) {
        let bodies = [];
        let SpaceRockDistance = config.height / (config.difficulty + 1);
        for (let i = 1; i < config.difficulty + 1; i++) {
            let spaceRock = new SpaceRock(
                {
                    scene: config.scene,
                    y: config.y - SpaceRockDistance * i,
                    x: config.x + config.width/2
                }
            )

            if (config.isSpawnedWhite){
                spaceRock.setTintFill(0xffffff);
            }
            
            bodies.push(
                spaceRock
            );
        }
        return bodies;
    }
}