import { getRandomInt } from '../../Helper'
import { CargoShip } from '../../CargoShip'

export class GridTraffic {

    static makeAndGetBodies(config) {
        return this.spaceCargoShipsBetween(config);
    }

    //TODO: make traffic even
    //traffic grid spans full width of grid with gaps for the player to fly through 
    static spaceCargoShipsBetween(config) {
        let bodies = [];
        let distanceY = config.height / (config.difficulty + 1);
        for (let i = 0; i < config.difficulty; i++) {
            bodies = bodies.concat(this.createCargoShipPair(
                config.y -  distanceY * i,
                config
            ));
        }

        return bodies;
    }

    //spawn 2 ships on the same y plane that fly together 
    static createCargoShipPair(y, config) {

        let leftShip = new CargoShip({ 
            scene: config.scene, 
            straighPathPostion: {x: config.x, y: y},
            startPostion: {x: config.x - config.wallWidth, y},
            cargoKeyNumber: getRandomInt(1, 8), 
            veerOff: {postionY:config.y - config.height + 500, xDirection: -1},
            warpOutPositionY: config.y - config.height,
            warpToPostionY: config.y
         });

         let rightShip = new CargoShip({ 
            scene: config.scene, 
            straighPathPostion: {x: config.x + config.width - config.wallWidth , y: y}, 
            startPostion: {x: config.x + config.width , y},
            cargoKeyNumber: getRandomInt(1, 8), 
            veerOff: {postionY:config.y - config.height + 500, xDirection: 1},
            warpOutPositionY: config.y - config.height,
            warpToPostionY: config.y
         });

        if (config.isSpawnedWhite) {
            leftShip.setTintFill(0xffffff);
            rightShip.setTintFill(0xffffff);
        }

        return [leftShip, rightShip];       
    }

}