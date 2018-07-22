import { getRandomInt } from '../../Helper'
import { CargoShip } from '../../CargoShip'

export class GridTraffic {

    static makeAndGetBodies(config) {
        let trafficLimitX = { leftX: config.x, rightX: config.x + config.width };
        return this.spaceCargoShipsBetween(trafficLimitX, config);
    }

    //TODO: make traffic even
    //traffic grid spans full width of grid with gaps for the player to fly through 
    static spaceCargoShipsBetween(trafficLimitX, config) {
        let bodies = [];
        let distanceY = config.height / (config.difficulty + 1);
        for (let i = 1; i < config.difficulty + 1; i++) {
            bodies = bodies.concat(this.createBigShipsToTheRight(
                (config.y - config.height) + distanceY * i,
                config,
                trafficLimitX
            ));
            //debugger;
        }

        return bodies;
    }

    //keep spawning ships to the right until there is no more room 
    static createBigShipsToTheRight(y, config, trafficLimitX) {
        let startPositionX = trafficLimitX.leftX;
        let gap = 200 + getRandomInt(100, 300);
        let lastShip = false;
        let cargoShips = [];
        while (startPositionX < trafficLimitX.rightX) {
            if (lastShip) {
                var newShip = this.createNewShipToTheRightOfShip(lastShip, gap, config);
            } else {
                var newShip = new CargoShip({ scene: config.scene, x: startPositionX, y: y, cargoKeyNumber: getRandomInt(1, 8), warpToPostionY: config.y, warpOutPositionY: config.y - config.height });

            }
            startPositionX += newShip.width;
            cargoShips.push(newShip);
            startPositionX += gap;
            lastShip = newShip;
        }
        return cargoShips;
    }

    static createNewShipToTheRightOfShip(newShip, offsetX, config) {

        let rightShip = new CargoShip({ scene: config.scene, x: 0, y: 0, boundry: config.y + config.height, cargoKeyNumber: getRandomInt(1, 8), warpToPostionY: config.y, warpOutPositionY: config.y - config.height });
        rightShip.y = newShip.y;
        rightShip.x = newShip.getRight() + rightShip.width / 2 + offsetX;
        return rightShip;
    }
}