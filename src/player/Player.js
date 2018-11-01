import { LocalStorageHandler } from '../LocalStorageHandler'
import { WarningPulseHandler } from '../WarningPulseHandler'
import { InputHandler } from './InputHandler'
import { BoostHandler } from './BoostHandler'
import {ComboCounter} from './ComboCounter'

import { Thruster } from './Thruster'
import { CollisionHandler } from './CollisionHandler';
import { Shield } from './Shield';

const grindSpeed = 0.03;

const boostPulseEmitterConfig = {
    frequency: 0,
    angle: { start: 0, end: 360, steps: 64 },
    speed: 800,
    scale: { start: 3, end: 0 },
    blendMode: 'SCREEN',
    quantity: 100,
    lifespan: 600,
    gravityY: 0,
    maxParticles: 100   
}

export class Player extends Phaser.Physics.Matter.Sprite {
    constructor(config) {
        super(config.scene.matter.world, config.x, config.y, 'player');

        this.setCircle(20);
      
        this.setDepth(1);
        this.angle = -45;
        this.isFinishedLevel = false;
        this.scene = config.scene;
        this.setFrictionAir(0.01);
        this.setMass(30);
        this.setFixedRotation();
        this.scene.add.existing(this);
        
        this.body.key = this.constructor.name;
        this.grindThrust = 0;
        
        this.thruster = new Thruster(this.scene, this);
        this.boostHandler = new BoostHandler(this.scene, this);
        this.comboCounter = new ComboCounter(this.scene, this); 
        this.collisionHandler = new CollisionHandler(this.scene, this);
        this.shield = new Shield(this.scene, this)
        this.dead = false;

        this.scene.input.addPointer(1);
        this.setDepth(4);
        this.aliveTimer = this.scene.time.addEvent({ delay: 0, repeat: -1, startAt: 0 });
        
        this.warningPulseHandler = new WarningPulseHandler(this,this.scene, boostPulseEmitterConfig);
        this.inputHandler = new InputHandler(this.scene, this);

        this.body.restitution = 1.5;
    }

    //set player values to starting position after death
    reset(){
        this.dead = false;
        this.aliveTimer.reset({ delay: 0, repeat: -1, startAt: 0 });
        this.x =280 
        this.y = 0;
        this.angle = -45;
        this.thruster.showImage();
        this.boostHandler.reset();
        this.grindSpeed = 0.03;
        this.regularSpeed = 0.004;
        this.setVelocity(0,0)
        this.setVisible(true);
        this.setTexture('player');
    }

    getSecondsAlive() {
        return this.aliveTimer.getElapsedSeconds();
    }

    setIsFinishedLevel() {
        this.isFinishedLevel = true;
    }

    onHit(dmg) {
        this.boostHandler.showBoostBarForDuration();

        this.shield.onShieldHit(dmg);

        if (this.boostHandler.power <= 0) {
            this.scene.killPlayer();
        }
        
        this.thruster.hideImage();
 
    }

    flyStaightDisableControlls(){
        this.boostHandler.endBoost();
        this.angle = -85;
        this.thrust(0.05);
        //so thruster can be seen over finish line
        this.thruster.thrusterImage.setDepth(4);
    }


    update() {
        if (this.dead) {
            this.setVelocityX(0);
            this.setVelocityY(0);
            return;
        }

        if (this.body && this.emitter){
            this.emitter.setAngle(this.angle + 180);
        }

        this.warningPulseHandler.update();
        this.thruster.update();
        this.shield.update();

        if (this.isFinishedLevel) {
            this.flyStaightDisableControlls();
            return;
        }
        this.inputHandler.update();

        //if the player was grinding in the previous update, apply that speed now 
        //can't call thrust() on the collision event
        //https://github.com/liabru/matter-js/issues/134
        this.applyGrindThrust();

        this.boostHandler.update();

        this.thrust(
            this.boostHandler.getSpeed()
        );
    }

    onDeath() {
        this.dead = true;
        this.anims.play('kaboom', true);
        this.thruster.hideImage();
        this.boostHandler.reset();
        
        this.shield.image.setVisible(false);
        if (this.scene.level == 0) {
            LocalStorageHandler.saveLevelCompletionTime(0,Math.floor(-this.y / 100));
        }
        return this;
    }

    //also handles up key
    bothInputsPressed() {
        this.isTurningLeft = true;
        this.isTurningRight = true;
        this.boostHandler.startBoost();
    }

    applyGrindThrust() {
        if (this.grindThrust > 0) {
            this.thrust(this.grindThrust);
        }
        this.grindThrust = 0;
    }

    queueBoostThrust() {
        this.grindThrust = grindSpeed;
    }

    turnLeft() {
        this.setAngularVelocity(-0.1);
        this.isTurningLeft = true;
    }

    turnRight() {
        this.setAngularVelocity(0.1);
        this.isTurningRight = true;
    }

    isDead() {
        return this.dead;
    }
}