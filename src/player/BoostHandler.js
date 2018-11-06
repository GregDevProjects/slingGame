const thrustLevel = {
    disabled : 0,
    regularSpeed :  0.004,
    boostSpeed: 0.2
}

const tailEmitterConfig = {
    speed: 0,
    scale: { start: 1.5, end: 0 },
    blendMode: 'ADD',
    gravityY: 0,
    gravityX: 0,
    lifespan: 300,
    quantity:1
}

const boostBarTime = 700;

//manages the player's boost and speed 
export class BoostHandler {

    constructor(scene, target) {
        this.isBoosting = false;
        this.scene = scene;
        this.player = target;
        this.power = 0;
        this.canBoostPulseBeShown = true;

        this.particles = this.scene.add.particles('red');
        this.emitter = this.particles.createEmitter(tailEmitterConfig);

        this.emitter.startFollow(this.player);
        this.emitter.setVisible(false);
        this.isBoostBarShown = false;
        this.boostBarTimerConfig = {
            
            delay: boostBarTime, 
            callback: function () { 
                if(!this) {
                    return;
                }
                
                this.isBoostBarShown = false;
                this.boostFadeOutTimer.destroy();
                this.boostFadeOutTimer = false;
            }, 
            callbackScope: this, 
            startAt: 0 
        }
        this.isDisabled = false;
    }

    
    disableEngine() {
        this.isDisabled = true;
    }


    reset() {
        this.isBoosting = false;
        this.isBoostBarShown = false;
        this.isDisabled = false;
        this.endBoost();
        this.power = 0;
    }

    isBoostActive() {
        return this.isBoosting;
    }

    isPowerFullEnoughForThrust() {
        return this.power >= 100;
    }

    showBoostBarForDuration() {
        this.isBoostBarShown = true;
        if (!this.boostFadeOutTimer) {
            this.boostFadeOutTimer = this.scene.time.addEvent(this.boostBarTimerConfig); 
            return;
        } 
        this.boostFadeOutTimer.reset(this.boostBarTimerConfig)
        
    }

    incrementPower() {
        this.showBoostBarForDuration();
        if (!this.isPowerFullEnoughForThrust()) {
            this.power += 1;
        } 

         if (this.isPowerFullEnoughForThrust() && this.canBoostPulseBeShown){
            this.canBoostPulseBeShown = false;
            this.player.warningPulseHandler.startWarningPulseAndCallFunctionAtFinish(()=>{
                
            }, 'red');
        }
    }

    decrementPower(amount) {
        this.canBoostPulseBeShown = true;
        this.power-=amount;
    }

    incrementPowerOnCombo(amount) {
        if(this.power + amount >= 100) {
            this.power = 100;
        } else {
            this.power +=amount
        }
    }

    update(delta) {
        if(this.isBoosting){
            this.power -= .04 * delta; 
            this.isBoostBarShown = true;

            if (this.power <= 0) {
                this.endBoost();
            }
        } 
    }

    getSpeed() {
        if (this.isDisabled = false){
            return thrustLevel.disabled;
        }

        if(this.isBoosting){
            return thrustLevel.boostSpeed;
        }
        return thrustLevel.regularSpeed;
    }


    startBoost() {
        if (this.isBoosting || !this.isPowerFullEnoughForThrust()) {
            return;
        }
        this.isBoostBarShown = true;
        this.isBoosting = true;
        this.player.setFrictionAir(0.15);
        this.player.setTintFill(0xffffff);
        this.emitter.setVisible(true);
        this.player.thruster.hideImage();

        this.boostStartTime = this.gameTime;      

        this.scene.activeSections.setAllSectionObstaclesSensors(true);
        this.scene.background.setSimulationBackground();
        this.scene.activeSections.setAllSectionObstaclesTintWhite(true);
    }

    
    endBoost() {
        if(!this.player.dead){
            this.player.thruster.showImage();
        }
        this.isBoostBarShown = false;
        this.player.power = 0;
        this.player.setFrictionAir(0.01);
        this.isBoosting = false;
        this.player.clearTint();
        this.emitter.setVisible(false);
        this.player.comboCounter.resetCombo();
        this.canBoostPulseBeShown = true;
        this.scene.background.setRealityBackground();
        this.scene.activeSections.setAllSectionObstaclesTintWhite(false);
        this.scene.activeSections.setAllSectionObstaclesSensors(false);
        //change me
       // this.player.isPowerThrustChargeFinished = true;
    }

}