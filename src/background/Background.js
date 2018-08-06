import { Planet } from './Planet'
import { Stars } from './Stars'
import { getRandomInt, getTopOfMatterObject } from '../Helper'

export class Background {
    constructor(config) {
        this.stars = new Stars(config.scene);
        this.scene = config.scene;
    }

    setSimulationBackground() {
        this.stars.setGridTexture();
        this.planet.tint();
    }

    setRealityBackground() {
        this.stars.setStarsTexture();
        this.planet.clearTint();
    }

    addRandomPlanet() {
        //set this to be the same as the standard section width for now
        let xPadding = 1000;
        //it would be cool to calculate this based on the top of the camera
        let minDistance = 2500
        this.planet = new Planet({
            scene:this.scene,
            x: getRandomInt(this.scene.player.x - xPadding/2 ,this.scene.player.x + xPadding/2),
            y: this.scene.player.y - minDistance - getRandomInt(0,6000), 
            key: getRandomInt(1,5)
        });
    }

    deletePlanet() {
        if (this.planet) {
            this.planet.destroy();
            this.planet = false;
        }
    }

    update() {
        this.stars.update();
        if(!this.planet){
            this.addRandomPlanet();
            return;
        }

        this.planet.update();
        if (getTopOfMatterObject(this.planet)  > this.scene.player.y + 500 ){
            this.deletePlanet();
        }
        
    }
}