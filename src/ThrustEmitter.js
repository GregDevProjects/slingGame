import { degreesToRadians } from './Helper'

//an emitter that follows behind the target and rotates with it 
export class ThrustEmitter {
    constructor(scene, target, offset) {
        this.scene = scene;
        this.target = target;
        this.offset = offset;

        this.thrusterParticles = this.scene.add.particles('blue').setDepth(1);
        
        this.thruster = this.thrusterParticles.createEmitter({
            x: 0,
            y: 1000, 
            speed: 100,
            scale: { start: 2, end: 0 },
            blendMode: 'ADD',
            lifespan : 500
        })
    }
 
    delete() {
        this.thrusterParticles.destroy();
    }

    update() {
        if(!this.target.body) {
            return;
        }

        this.positionEmitterBehind(this.thruster, this.offset);
    }

    positionEmitterBehind(emitter, offest) {
        let x = this.target.x + offest.x  * Math.cos(degreesToRadians(this.target.angle ));
        let y = this.target.y +offest.y * Math.sin(degreesToRadians(this.target.angle ));
        emitter.setPosition(x,y);
        emitter.setAngle(this.target.angle);   
    }
 
}