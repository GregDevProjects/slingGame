import { degreesToRadians, getCenterOfScreen } from './Helper'

export class Player extends Phaser.Physics.Matter.Sprite{
    constructor(config){
        super(config.scene.matter.world, config.x, config.y, 'player');
        this.angle=-45;
        this.scene = config.scene;
        this.setFrictionAir(0.01);
        this.setMass(30);
        this.setFixedRotation();
        this.scene.add.existing(this);
        this.boostSpeed = 0.03;
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.body.key=this.constructor.name;
        this.boostThrust = 0;
        this.createThruster();
        this.createEmitter();
    }

    createEmitter(){
        this.emitter = this.scene.add.particles('red').createEmitter({
			speed: 80,
			scale: { start: 3, end: 0 },
			blendMode: 'ADD',
            gravityY: 0,
            gravityX: 0,
            speed: { min: 2000, max: 2000 },
            lifespan: 90  
		});
	
        this.emitter.startFollow(this);//.followOffset = {x: 0, y: 30};
        //call this on update 
        //this.emitter.setAngle(this.angle);
        
    }

    createThruster(){
        let trustSizeY = 150;
        let thrustSizeX = 100;
        this.thrustSensor3 = this.scene.matter.add.rectangle(0,0,trustSizeY,thrustSizeX,  { isSensor:true });
        this.thrustSensor3.key = 'Thruster';
    }

    update(){
        this.assignKeyboardControlToPlayerAction();
        this.assignPointerToPlayerAction();
        this.applyBoostThrust();
        this.positionThrustSensorBehindPlayer();
        this.applyThrust(0.005);
        this.emitter.setAngle(this.angle + 180);
       
    }

    positionThrustSensorBehindPlayer(){
        Phaser.Physics.Matter.Matter.Body.setAngle(this.thrustSensor3, degreesToRadians(this.angle));

        Phaser.Physics.Matter.Matter.Body.setPosition(
            this.thrustSensor3, 
            {   x: this.x + 100 *Math.cos(degreesToRadians(this.angle - 180)),
                y: this.y + 100 *Math.sin(degreesToRadians(this.angle - 180))
            }
        );
    }

    assignPointerToPlayerAction(){
        if(this.scene.input.activePointer.isDown){
            if(this.scene.input.activePointer.x > getCenterOfScreen()){
                this.turnRight();
            } else {
                this.turnLeft();
            }
        }
    }

    assignKeyboardControlToPlayerAction(){
        if (this.cursors.left.isDown) {
           this.turnLeft();
        } else if (this.cursors.right.isDown) {          
           this.turnRight();
        }
    
        if (this.cursors.up.isDown)
        {
            this.applyThrust(0.03);
        }
    }

    //can't call applyThrust() on the collision event, so queue it for update
    //https://github.com/liabru/matter-js/issues/134
    applyBoostThrust(){
        if(this.boostThrust > 0){
            this.applyThrust(this.boostThrust);
        }
        this.boostThrust = 0;
    }

    queueBoostThrust(){
        this.boostThrust = this.boostSpeed
    }

    addToCurrentAngle(addAmount){
        this.angle+=addAmount;
    }

    turnLeft(){
        this.subractFromCurrentAngle(4);
    }

    turnRight(){
        this.addToCurrentAngle(4);
    }

    subractFromCurrentAngle(subtractAmount){
        this.angle-=subtractAmount;
    }

    applyThrust(thrustForce){
        this.thrust(thrustForce);
    }


}