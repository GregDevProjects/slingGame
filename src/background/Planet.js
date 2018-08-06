import { getRandomInt } from "../Helper";

export class Planet extends Phaser.GameObjects.Image {
    constructor(config){
        // debugger;
        super(config.scene, config.x, config.y, 'planet_' + config.key); //FIXME: calculate this using camera zoom
        config.scene.add.existing(this);
        this.scene = config.scene;
        this.previousPlayerPosition = false;
        this.setDepth(-1);
        this.tintColor = this.getTintColor();
        this.scrollSpeed = 10;// 1.2;
        if (config.scene.player.isPowerThrusting) {
            this.tint();
        }

    } 

    getTintColor(){
        switch (getRandomInt(1,2)) {    
            case 1: return 0x00FFAA;
            case 2: return 0xffa500;
        }
    }

    tint() {
        this.setTintFill(this.tintColor);
    }

    update() {
        if (this.previousPlayerPosition){
            this.y += (this.scene.player.y - this.previousPlayerPosition)/this.scrollSpeed;
        }
        this.previousPlayerPosition = this.scene.player.y;
    }
}