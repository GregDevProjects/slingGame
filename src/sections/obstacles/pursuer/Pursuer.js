import {getRandomInt, degreesToRadians} from '../../../Helper'
import {destroyObject} from '../../../matter/MatterHelper'

import { MovementHandler, straightAngle } from './MovementHandler'
import { MissileHandler } from './MissileHandler'
import { WarningPulseHandler } from '../../../WarningPulseHandler';

import { MineHandler } from './MineHandler'


export class Pursuer extends Phaser.Physics.Matter.Sprite {
    constructor(config) {
        super(config.scene.matter.world, getRandomInt(config.x-1000, config.x+1500), config.y - 2000, 'pursuer');
     
        this.setBodyVertices();
        this.body.key = this.constructor.name;
        this.player = config.player;
        this.scene = config.scene;
        this.missileHandler = new MissileHandler(this, this.player, this.scene);
        this.warningPulseHandler = new WarningPulseHandler(this, this.scene );
        this.mineHandler = new MineHandler(this, this.scene).dropMinesAtRandomUntilTargetOrSceneIsDestroyed();
        this.leftTruster = this.createThrusterEmitter();
        config.scene.add.existing(this);
        this.setAngle(straightAngle)
        this.setSensor(true);
        this.setCollisionCategory(config.scene.matterHelper.getMainCollisionGroup());
        this.setDepth(5);
    }   

    update() {

        if(!this.player.body) {
            return;
        }
        
        MovementHandler.stayAheadOfPlayerAndTryToAlignOnX(this.player, this);
        this.missileHandler.update();
        this.warningPulseHandler.update();
        this.positionEmitterBehind(this.leftTruster, {x: -120, y: -120});
    }

    startWarningPulse(callback, particleKey) {
        this.warningPulseHandler.startWarningPulseAndCallFunctionAtFinish(callback, particleKey);
    }

    createThrusterEmitter() {
        this.thrusterParticles = this.scene.add.particles('orange').setDepth(10);

        return this.thrusterParticles.createEmitter({
            speed: 100,
            scale: { start: 2, end: 0 },
            blendMode: 'ADD',
            lifespan : 500
        });
    }

    positionEmitterBehind(emitter, offest) {
        let x = this.x + offest.x  * Math.cos(degreesToRadians(this.angle ));
        let y = this.y +offest.y * Math.sin(degreesToRadians(this.angle ));
        emitter.setPosition(x,y);
        emitter.setAngle(this.angle);
      
    }
 
    setBodyVertices() {
        this.setPolygon(0,0, {
            vertices: [
                {x: 34.5, y: 125},
                {x: 31.5, y: 44},
                {x: 72.5, y: 34},
                {x: 75.5, y: 5},
                {x: 148.5, y: 11},
                {x: 147.5, y: 42},
                {x: 192.5, y: 43},
                {x: 263.5, y: 71},
                {x: 263.5, y: 95},
                {x: 186.5, y: 119},
                {x: 150.5, y: 120},
                {x: 149.5, y: 162},
                {x: 74.5, y: 164},
                {x: 73.5, y: 134},
                {x: 31.5, y: 128}
            ]
        });
    }
    
    delete(isExploding){
        this.missileHandler.delete();
        this.thrusterParticles.destroy(); 
        this.mineHandler.delete();
        destroyObject(this, isExploding);   
    }
    
    tintWhite() {
        this.setTintFill(0xffffff);
        this.missileHandler.tintWhite();
    }

    removeTint() {
        this.missileHandler.removeTint();
        this.clearTint();
    }
}
