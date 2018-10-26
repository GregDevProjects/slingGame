import { degreesToRadians, getCenterOfScreen, getRandomInt } from './Helper'

export class Player extends Phaser.Physics.Matter.Sprite {
    constructor(config) {
        super(config.scene.matter.world, config.x, config.y, 'player');
        this.setDepth(1);
        this.angle = -45;
        this.isFinishedLevel = false;
        this.scene = config.scene;
        this.setFrictionAir(0.01);
        this.setMass(30);
        this.setFixedRotation();
        this.scene.add.existing(this);
        this.boostSpeed = 0.03;
        this.regularSpeed = 0.004;
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.body.key = this.constructor.name;
        this.boostThrust = 0;
        this.power = 0;
        this.createThruster();
        this.createEmitter();
        this.dead = false;
        this.setCollidesWith(config.matterHelper.getMainCollisionGroup());
        this.isPowerThrusting = false;
        this.powerThrustTime = 3000;
        this.scene.input.addPointer(1);
        this.comboCounter = 0;
        this.setDepth(4);
        this.aliveTimer = this.scene.time.addEvent({ delay: 0, repeat: -1, startAt: 0 });
        this.isIncrementingPower = false;
        this.isPowerThrustChargeFinished = true;
        
        this.powerFullEmitter =this.scene.add.particles('red').setDepth(10).createEmitter({
            frequency: 0,
            angle: { start: 0, end: 360, steps: 64 },
            speed: 800,
            scale: { start: 3, end: 0 },
            blendMode: 'SCREEN',
            quantity: 100,
            lifespan: 600,
            gravityY: 0,
            maxParticles: 100
        }).stop();

        //pretty hacky
        this.flashRed = this.scene.tweens.addCounter({
            from: 255,
            to: 0,
            yoyo: true,
            duration: 500,
            repeat: -1,
            onUpdate: function (tween)
            {
                if (this.flashRed.show) {
                    var value = Math.floor(tween.getValue());
                    this.setTint(Phaser.Display.Color.GetColor(255, value, 255));
                }

            }.bind(this)
        });
        this.flashRed.show = false;
        this.recordPosition = false;
        this.lastPosition = { x :this.x, y: this.y };
    }

    startRedFlash() {
        this.flashRed.show = true;
    }

    stopRedFlash() {
        this.flashRed.show = false;
        this.clearTint();
    }

    surroundPulse() {
       this.powerFullEmitter.setPosition(this.x, this.y);
        this.powerFullEmitter.start();
        this.scene.time.delayedCall(300, function(){
            this.powerFullEmitter.stop();
        }.bind(this));
    }

    //set player values to starting position after death
    reset(){
        this.stopRedFlash();
        this.dead = false;
        this.aliveTimer.reset({ delay: 0, repeat: -1, startAt: 0 });
        this.x =280 
        this.y = 0;
        this.angle = -45;
        this.thrusterImage.setVisible(true);
        this.boostSpeed = 0.03;
        this.regularSpeed = 0.004;
        this.setVisible(true);
        this.setTexture('player');
    }

    getSecondsAlive() {
        return this.aliveTimer.getElapsedSeconds();
    }

    setIsFinishedLevel() {
        this.isFinishedLevel = true;
    }

    flyStaightDisableControlls(){
        this.powerThrust().stop();
        this.angle = -85;
        this.applyThrust(0.05);
        //so thruster can be seen over finish line
        this.thrusterImage.setDepth(4);
    }

    getIsPowerThrusting() {
        return this.isPowerThrusting;
    }

    //also creates particles
    createEmitter() {
        this.particles = this.scene.add.particles('red');
        this.emitter = this.particles.createEmitter({
            speed: 0,
            scale: { start: 1.5, end: 0 },
            blendMode: 'ADD',
            gravityY: 0,
            gravityX: 0,
            lifespan: 300,
            quantity:1
        });
      
       this.emitter.startFollow(this);
       this.emitter.setVisible(false);
    }

    incrementPower() {
        if (!this.isPowerFullEnoughForThrust()) {
            this.power += 0.01;
        }

        if (this.isPowerFullEnoughForThrust() && this.isPowerThrustChargeFinished) {
            this.surroundPulse();
            this.startRedFlash();
            this.isPowerThrustChargeFinished = false;
        }
    }

    createThruster() {
        let trustSizeY = 150;
        let thrustSizeX = 100;
        this.thrustSensor3 = this.scene.matter.add.rectangle(0, 0, trustSizeY, thrustSizeX, { isSensor: true });
        this.thrustSensor3.collisionFilter.category = this.scene.matterHelper.getMainCollisionGroup();
        this.thrustSensor3.key = 'Thruster';
        this.thrusterImage = this.scene.add.image(0,0,'thrustFlame').setDepth(2);
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


        this.moveSurroundPulseParticlesWithPlayer();
        this.positionThrustSensorBehindPlayer();

        if (this.isFinishedLevel) {
            this.flyStaightDisableControlls();
            return;
        }
        this.assignKeyboardControlToPlayerAction();
        this.assignPointerToPlayerAction();
        this.applyBoostThrust();
        
        if(this.isPowerThrusting){
            this.applyThrust(0.20);
            let progress = this.thrustTimer.getProgress();
            this.power = 1 - progress; 
        } else {
            this.applyThrust(this.regularSpeed);
        }

    }

    moveSurroundPulseParticlesWithPlayer() {
        if ((this.lastPosition.x !== this.x && this.lastPosition.y !== this.y)) {

            this.powerFullEmitter.alive.forEach(function(particle){
                particle.y += this.y - this.lastPosition.y ;
                particle.x += this.x - this.lastPosition.x;
            }.bind(this))

            this.lastPosition = { x :this.x, y: this.y };
        }
    }


    onDeath() {
        if (this.thrustTimer) {
            this.thrustTimer.destroy();
            this.powerThrust().stop();
        }
        this.anims.play('kaboom', true);
        this.thrusterImage.setVisible(false);
        this.dead = true;
        this.power = 0;
        return this;
    }

    positionThrustSensorBehindPlayer() {
        Phaser.Physics.Matter.Matter.Body.setAngle(this.thrustSensor3, degreesToRadians(this.angle));

        let x = this.x + 100 * Math.cos(degreesToRadians(this.angle - 180));
        let y = this.y + 100 * Math.sin(degreesToRadians(this.angle - 180));

        Phaser.Physics.Matter.Matter.Body.setPosition(
            this.thrustSensor3,
            {
                x: x,
                y: y
            }
        );

        this.thrusterImage.x = x;
        this.thrusterImage.y = y;
        this.thrusterImage.setAngle(this.angle);
    }

    assignPointerToPlayerAction() {
        if (this.scene.input.pointer1.isDown && this.scene.input.pointer2.isDown) {
            this.bothInputsPressed();
            return;
        }

        if (this.scene.input.pointer1.isDown) {
            this.oneInputPressed(this.scene.input.pointer1);
        }

        if (this.scene.input.pointer2.isDown) {
            this.oneInputPressed(this.scene.input.pointer2);
        }

    }

    oneInputPressed(pointer) {
        if (pointer.x > getCenterOfScreen()) {
            this.turnRight();

        } else {
            this.turnLeft();

        }

    }

    bothInputsPressed() {
        this.powerThrust().start();
    }

    assignKeyboardControlToPlayerAction() {
        if (this.cursors.left.isDown) {
            this.turnLeft();
        } else if (this.cursors.right.isDown) {
            this.turnRight();
        } else {
            this.setAngularVelocity(0);
            this.isTurningLeft = false;
            this.isTurningRight = false;
        }

        if (this.cursors.up.isDown) {
            this.powerThrust().start();
        }
    }

    isPowerFullEnoughForThrust() {
        return this.power >= 1.00;
    }

    powerThrust() {
        
        this.start = function () {

            this.isTurningLeft = true;
            this.isTurningRight = true;

            if (this.isPowerThrusting || !this.isPowerFullEnoughForThrust()) {
                return;
            }
            this.stopRedFlash();
            this.isPowerThrusting = true;
            this.setFrictionAir(0.15);
            this.power = 0;
            this.scene.onPlayerPowerThrustStart();
            this.setTintFill(0xffffff);
            this.emitter.setVisible(true);
            this.thrusterImage.setVisible(false);

            this.thrustTimer = this.scene.time.addEvent({ 
                delay: this.powerThrustTime, 
                callback: function () { 
                    this.powerThrust().stop() 
                }, 
                callbackScope: this, 
                startAt: 0 
            });
        };

        this.stop = function () {
            this.power = 0;
            this.setFrictionAir(0.01);
            this.isPowerThrusting = false;
            this.scene.onPlayerPowerThrustEnd();
            this.clearTint();
            this.emitter.setVisible(false);
            this.thrusterImage.setVisible(true);
            this.comboCounter = 0;
            this.isPowerThrustChargeFinished = true;
        };
        return this;
    }

    incrementCombo() {
        this.comboCounter++;
        if (this.comboCounter < 2) {
            return;
        }

        this.scene.tweens.add({
            targets:  this.scene.add.text(this.x, this.y - 100, 'COMBO ' + this.comboCounter, { font: '60px Arial', fill: '#ffffff' }),
            alpha: 0,
            duration: 1000,
            scaleX: this.comboCounter -1,
            scaleY:this.comboCounter - 1,
            y: getRandomInt(this.y-500, this.y -200),
            x: getRandomInt(this.x-500,this.x+500),
            onComplete: function (tween) {
                tween.targets[0].destroy();
            }
        });
    }

    //can't call applyThrust() on the collision event, so queue it for update
    //https://github.com/liabru/matter-js/issues/134
    applyBoostThrust() {
        if (this.boostThrust > 0) {
            this.applyThrust(this.boostThrust);
        }
        this.boostThrust = 0;
    }

    queueBoostThrust() {
        this.boostThrust = this.boostSpeed
    }

    addToCurrentAngle(addAmount) {
        this.angle += addAmount;
    }

    turnLeft() {
        this.setAngularVelocity(-0.1);
        this.isTurningLeft = true;
       // this.subractFromCurrentAngle(4);
    }

    turnRight() {
        this.setAngularVelocity(0.1);
        this.isTurningRight = true;
      //  this.addToCurrentAngle(4);
    }

    subractFromCurrentAngle(subtractAmount) {
        this.angle -= subtractAmount;
    }

    applyThrust(thrustForce) {
        this.thrust(thrustForce);
    }

    disableEngine() {
        this.boostSpeed = 0;
        this.regularSpeed = 0;
    }

    isDead() {
        return this.dead;
    }
}