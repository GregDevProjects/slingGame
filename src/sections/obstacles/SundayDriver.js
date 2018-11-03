import { ThrustEmitter } from '../../ThrustEmitter'
import {destroyObject} from '../../matter/MatterHelper'
import { getDistanceBetweenObjects } from '../../Helper'
const straightAngle = -90;

const farthestLeftAngle = -110;
const farthestRightAngle = -70;

const movementPattern = {
    straight: 1,
    left: 2,
    right: 3
}

export class SundayDriver extends Phaser.Physics.Matter.Sprite{
    constructor(config) {
        super(config.scene.matter.world, config.x, config.y, 'sunday_driver');
        this.thruster = new ThrustEmitter(this.scene,this, {x:-100, y:-100});

        this.body.key = this.constructor.name;
        this.player = config.player;
        this.scene = config.scene;
    
        config.scene.add.existing(this);
        this.setAngle(straightAngle)

        this.setCollisionCategory(config.scene.matterHelper.getMainCollisionGroup());
        this.setDepth(5);
        this.setTravelPositions();

        this.setTravelPositions(config.startOnLeft);
    }

    setTravelPositions(startOnLeft) {
        if (startOnLeft) {
            this.xTravelPositions = {
                farthestLeft: this.x + 110,
                farthestRight: this.x + 280,
            }
            this.movementPattern = movementPattern.right;
            return; 
        } 

        this.xTravelPositions = {
            farthestLeft: this.x - 250,
            farthestRight: this.x - 200,
        }
        
        this.movementPattern = movementPattern.left;    
    }

    update() {
        if(!this || !this.body) {
            return;
        }

        this.thruster.update();
        if(getDistanceBetweenObjects(this, this.player) < 1500) {
            this.thrust(0.005);
            this.setTurnDirections();
            this.rotateAccordingToTurnDirection();
        }

    }

    setTurnDirections() {
        if (this.movementPattern == movementPattern.right) {
            if(this.x >= this.xTravelPositions.farthestRight) {
                this.movementPattern = movementPattern.left;
            }
        }

        if (this.movementPattern == movementPattern.left) {
            if (this.x <= this.xTravelPositions.farthestLeft) {
                this.movementPattern = movementPattern.right;
            }
        }
    }

    rotateAccordingToTurnDirection() {
        if(this.movementPattern == movementPattern.right && this.angle < farthestRightAngle) {
            this.angle+=0.5;
        }

        if(this.movementPattern == movementPattern.left && this.angle > farthestLeftAngle) {
            this.angle-=0.5;
        }
    }

    delete(isExploding) {
        this.thruster.delete();
        destroyObject(this, true);  
    }

    tintWhite() {
        this.setTintFill(0xffffff);
    }

    removeTint() {
        this.clearTint();
    }


}