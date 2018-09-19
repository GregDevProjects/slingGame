import {getAngleBetweenObjects, getGameHeight, getGameWidth, getDistanceBetweenObjects, getRandomInt} from '../../Helper'
import {destroyObject} from '../../matter/MatterHelper'

export class Missle extends Phaser.Physics.Matter.Sprite {
    constructor(config) {
        super(config.scene.matter.world, config.x, config.y, 'missle');
        this.body.key = this.constructor.name;
        this.player = config.player;
       //  this.setDisplaySize(100,200);
        this.activated = false;
        this.scene = config.scene;
        
        config.scene.add.existing(this);
 
        this.minimap = new OffscreenTargetCamera({scene:config.scene, player:config.player, target: this});

        this.minimap.startFollow(this);
        //hack
        this.deathTextWasShown = false;
        this.setCollisionCategory(config.scene.matterHelper.getMainCollisionGroup());
        
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

        this.thrust(0.004);
 
    }

    onActivation() {
        this.activated = true;
            
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



        if (!this.player.isDead() && !this.deathTextWasShown) {
            this.deathTextWasShown = true;
            this.scene.tweens.add({
                targets:  this.scene.add.text(this.player.x, this.player.y - 100, 'MISSILE DOWN', { font: '60px Arial', fill: '#ffffff' }),
                alpha: 0,
                duration: 1000,
                scaleX: 1,
                scaleY:1,
                y: getRandomInt(this.player.y-500, this.player.y -200),
                x: getRandomInt(this.player.x-500,this.player.x+500),
                onComplete: function (tween) {
                    tween.targets[0].destroy();
                }
            });
        }

        this.minimap.delete();
        destroyObject(this, isExploding);   

    }
    
    tintWhite() {
        this.setTintFill(0xff0000);
    }
}

class OffscreenTargetCamera extends Phaser.Cameras.Scene2D.Camera {
    constructor(config) {
        super( 0, getGameHeight() - 50, 50, 50); 
        this.setZoom(0.4);
        this.setVisible(false);
        this.player = config.player;
        this.target = config.target;
        this.scene = config.scene;

        this.redBorder = config.scene.add.image(config.x,config.y,'target').setVisible(false).setDisplaySize(125,125).setDepth(3);
        this.distanceText = config.scene.add.text(0, 10, '', { font: '50px Arial', fill: '#ffffff' }).setVisible(false);
        this.distanceText.setDepth(4);
        this.maxDistance = 30;
        config.scene.cameras.addExisting(this);
    }

    delete() {
        this.redBorder.destroy();
        this.distanceText.destroy();
        this.scene.cameras.remove(this);
    }

    positionCameraMapBehindPlayer() {
        this.x = Phaser.Math.Clamp(
            this.getCameraPosition() ,
                0, 
                getGameWidth() -this.width
        );
    }

    getCameraPosition() {
        // 0.4 -> camera zoom
       return  (this.target.x - this.player.x )*0.4 + getGameWidth()/2 - this.width/2 
    }

    update() {
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
        this.setVisible(true);
        this.distanceText.setVisible(true);
    }

    hide() {
        this.redBorder.setVisible(false);
        this.setVisible(false);  
        this.distanceText.setVisible(false);   
    }

}