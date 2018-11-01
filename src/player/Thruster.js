//image of thruster surrounded by a matter body 
import { degreesToRadians, getDistanceBetweenObjects, getRandomInt } from '../Helper'

const trustSizeY = 150;
const thrustSizeX = 100;

export class Thruster{

    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.thrusterImage = this.scene.add.image(0,0,'thrustFlame').setDepth(1);
        this.thrustSensor = this.scene.matter.add.rectangle(0, 0, trustSizeY, thrustSizeX, { isSensor: true });
        this.thrustSensor.collisionFilter.category = this.scene.matterHelper.getMainCollisionGroup();
        this.thrustSensor.key = 'Thruster';
    }

    update() {
        this.positionThrusterBehindPlayer(); 
    }

    emitGrindSparks(aPair) {
        const contactPoints = {
            x : aPair.collision.supports[0].x + aPair.collision.penetration.x, 
            y : aPair.collision.supports[0].y + aPair.collision.penetration.y 
        };

        if (getDistanceBetweenObjects(this.scene.player, contactPoints) <= 200 ) {
            if(getRandomInt(0,1)){
                this.emitter(
                    {
                        x : aPair.collision.supports[0].x + aPair.collision.penetration.x, 
                        y : aPair.collision.supports[0].y + aPair.collision.penetration.y 
                    }
                );
            }
        } else {
            if(getRandomInt(0,1)){
                this.emitter(
                    {
                        x : this.thrusterImage.x, 
                        y : this.thrusterImage.y
                    }
                );
            }            
        }
    }

    emitter(source) {
        var particles = this.scene.add.particles('red');
        particles.setDepth(4)
        particles.createEmitter({
            x: source.x, 
            y: source.y,
            speed: 400,
            lifespan: 250,
            quantity: 1,
            yoyo: true,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        });

        this.scene.time.delayedCall(250, function() {
            particles.destroy();
        });
    }

    positionThrusterBehindPlayer() {
        const playerAngle = this.player.angle;
        const x = this.player.x + 100 * Math.cos(degreesToRadians(playerAngle - 180));
        const y = this.player.y + 100 * Math.sin(degreesToRadians(playerAngle - 180));

        Phaser.Physics.Matter.Matter.Body.setAngle(this.thrustSensor, degreesToRadians(playerAngle));

        Phaser.Physics.Matter.Matter.Body.setPosition(
            this.thrustSensor,
            {
                x: x,
                y: y
            }
        );

        this.thrusterImage.x = x;
        this.thrusterImage.y = y;
        this.thrusterImage.setAngle(this.player.angle);
    }


    hideImage() {
        this.thrusterImage.setVisible(false);
    }

    showImage() {
        this.thrusterImage.setVisible(true);
    }



}