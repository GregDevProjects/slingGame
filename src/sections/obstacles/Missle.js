import {getAngleBetweenObjects, getGameHeight, getGameWidth, getDistanceBetweenObjects, getRandomInt, degreesToRadians} from '../../Helper'
import {destroyObject} from '../../matter/MatterHelper'

export class Missle extends Phaser.Physics.Matter.Sprite {
    constructor(config) {
        super(config.scene.matter.world, config.x, config.y, 'missle');
        this.setBodyVertices();
        this.body.key = this.constructor.name;
        this.player = config.player;
        this.activated = false;
        this.scene = config.scene;
        
        config.scene.add.existing(this);
        this.minimap = new OffscreenTargetCamera({scene:config.scene, player:config.player, target: this});
        this.setCollisionCategory(config.scene.matterHelper.getMainCollisionGroup());
        this.setDepth(2);

        this.particles = this.scene.add.particles('orange');

        this.emitter = this.particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
            lifespan : 500
        })
       .setVisible(false)
        
       if(this.player.boostHandler.isBoosting) {
           this.tintWhite();
       }
        
    }

    positionEmitterBehind() {
    

        let x = this.x -20  * Math.cos(degreesToRadians(this.angle ));
        let y = this.y -20 * Math.sin(degreesToRadians(this.angle ));

        this.emitter.setPosition(x,y);

        this.emitter.setAngle(this.angle);
    
        // this.thrusterImage.x = x;
        // this.thrusterImage.y = y;
        // this.thrusterImage.setAngle(this.angle);
    }

    setBodyVertices() {
        this.setPolygon(0,0, {
            vertices: [
                {x: 1, y: 18},
                {x: 89, y: 17},
                {x: 93, y: 24},
                {x: 93, y: 38},
                {x: 89, y: 46},
                {x: 1, y: 45}
            ]
        });
    }


    update() {
        if(!this.player.body) {
            return;
        }
        
        if (this.isOffscreen()) {
            this.minimap.show();
        } else {
            this.minimap.hide();
        }

        if ((this.player.y < this.y) && !this.activated) {
            this.onActivation();
        }

        if(!this.activated) {
            this.setAngularVelocity(-0.1);
            return;
        }

        this.minimap.update();
          
        this.angleTowardsPlayer();

        this.thrust(0.002);
        if(this.x)
            this.positionEmitterBehind();
 
    }

    onActivation() {
        this.activated = true;
        this.emitter.setVisible(true);
        this.scene.tweens.add({
            targets:  this.scene.add.text(this.x, this.y - 100,'!' , { font: '60px Arial', fill: '#ff0000' }),
            alpha: 0,
            duration: 1000,
            scaleX: 4,
            scaleY:4,
            y: getRandomInt(this.y-500, this.y -200),
            x: getRandomInt(this.x-500,this.x+500),
            onComplete: function (tween) {
                tween.targets[0].destroy();
            }
        });

    }

    isOffscreen() {
        if(!this.body) {
            return;
        }
        //200 -> camera offset from player
        return this.y >= this.player.y + 200 + this.height + 15;
    }   
    
    angleTowardsPlayer() {
        let shortestBetween = Phaser.Math.Angle.ShortestBetween(
            Phaser.Math.RAD_TO_DEG * getAngleBetweenObjects(this, this.player),
            this.angle
        );

        if (shortestBetween > 0) {
            this.setAngularVelocity(-this.getTurnSpeed());
        } else {
            this.setAngularVelocity(this.getTurnSpeed());
        }
    }

    getTurnSpeed() {
        return 0.03;
    }

    delete(isExploding){
       
        this.particles.destroy();
        this.minimap.delete();
        destroyObject(this, isExploding);   

    }

    removeTint() {
        this.clearTint();
    }
    
    tintWhite() {
        this.setTintFill(0xff0000);
    }
}

class OffscreenTargetCamera {
    constructor(config) {
        this.camera = config.scene.cameras.add(0, getGameHeight() - 50, 50, 50);
        this.camera.startFollow(config.target);
        this.camera.setZoom(0.4);
        this.camera.setVisible(false);

        this.player = config.player;
        this.target = config.target;
        this.scene = config.scene;

        this.redBorder = config.scene.add.image(config.x,config.y,'target').setVisible(false).setDisplaySize(125,125).setDepth(5);
        this.distanceText = config.scene.add.text(0, 10, '', { font: '50px Arial', fill: '#ffffff' }).setVisible(false);
        this.distanceText.setDepth(6);
        this.maxDistance = 30;
    }

    delete() {
        this.redBorder.destroy();
        this.distanceText.destroy();
        this.scene.cameras.remove(this.camera);
        this.isDead = true;
    }

    positionCameraMapBehindPlayer() {
        this.camera.x = Phaser.Math.Clamp(
            this.getCameraPosition() ,
                0, 
                getGameWidth() -this.camera.width
        );
    }

    getCameraPosition() {
        // 0.4 -> camera zoom
       return  (this.target.x - this.player.x )*0.4 + getGameWidth()/2 - this.camera.width/2 
    }

    update() {

        if(this.isDead) {
            return;
        }

        this.distance = Math.floor(getDistanceBetweenObjects(this.target, this.player) / 100);

        if(this.distance > this.maxDistance && this.target.activated) {
            this.target.delete(true);
            return;
        }
        
        this.distanceText.setText(
            this.distance
        ).setPosition(this.target.x - 55, this.target.y - 60);
        this.positionCameraMapBehindPlayer();
        this.redBorder.setPosition(this.target.x, this.target.y);

    }

    show() {
        this.redBorder.setVisible(true);
        this.camera.setVisible(true);
        this.distanceText.setVisible(true);
    }

    hide() {
        this.redBorder.setVisible(false);
        this.camera.setVisible(false);  
        this.distanceText.setVisible(false);   
    }

}