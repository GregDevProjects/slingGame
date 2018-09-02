import {getAngleBetweenObjects, getGameHeight, getGameWidth, getDistanceBetweenObjects} from '../../Helper'
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

        if (this.player.y < this.y) {
            this.activated = true;
        }

        if(!this.activated) {
            this.setAngularVelocity(-0.1);
            return;
        }

        this.minimap.update();
          
        this.angleTowardsPlayer();

        this.thrust(0.004);
 
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
       // if(this.active)
        this.minimap.delete();
        destroyObject(this, isExploding);       
    }
    
    tintWhite() {
        this.setTintFill(0xff0000);
    }
}

class OffscreenTargetCamera extends Phaser.Cameras.Scene2D.Camera {
    constructor(config) {//config.scene.matter.world,
        super( 0, getGameHeight() - 50, 50, 50); 
        this.setZoom(0.4);
        this.setVisible(false);
        this.player = config.player;
        this.target = config.target;
        this.scene = config.scene;

        this.redBorder = config.scene.add.image(config.x,config.y,'target').setVisible(false).setDisplaySize(125,125).setDepth(3);
        this.distanceText = config.scene.add.text(0, 10, '', { font: '50px Arial', fill: '#ffffff' }).setVisible(false);
        this.distanceText.setDepth(4);
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
        this.distanceText.setText(
            Math.floor(getDistanceBetweenObjects(this.target, this.player) / 100)
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