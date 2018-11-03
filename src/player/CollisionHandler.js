export class CollisionHandler {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
    }

    onThrusterCollision(aPair, otherObj) {
        if (otherObj.key === "Player") {
            return;
        }

        if (otherObj.key === "Mine") {
            return;
        }

        if (this.player.boostHandler.isBoostActive()) {
            return;
        }

        if (this.player.shield.startSpinOut) {
            return;
        }

        this.player.thruster.emitGrindSparks(aPair);
        this.player.queueBoostThrust();
        this.player.boostHandler.incrementPower();
    }

    onCollisionWithNonTruster(otherObj) { 
        if (this.player.boostHandler.isBoosting) {
            this.onBoostCollision(otherObj);
            return;
        }
        
       // console.log('hit')
        // return;
        //TODO: change what happens depending on hit
        this.player.onHit(
            this.getDmgForWhatWasCollidedWith(otherObj.key),
            otherObj
        ); 
    }

    getDmgForWhatWasCollidedWith(otherObjectKey) {
        switch(otherObjectKey) {
            case 'VectorWall':
                return 30;
            case 'Mine':
                return 4;
            case 'CargoShip':
                return 30;
            case 'Missle':
                return 80;
            case 'Pursuer':
                return 30;
            case 'SpaceRock':
                return 30;
            case 'Spinner':
                return 40;
            case 'SundayDriver':
                return 30;
        }
        console.warn('dmg to player not defined for: ', otherObjectKey)
        return 0;
    }

    isBoostCollisionFatal(otherObj) {
        return otherObj.key === 'Spinner'
            || otherObj.key === 'Missle';   
    }

    onBoostCollision(otherObj) {
        if(this.isBoostCollisionFatal(otherObj)) {
            this.scene.killPlayer();
            return;
        }
        this.onNonFatalBoostCollision(otherObj);
    }

    onNonFatalBoostCollision(otherObj) {
        if (otherObj.key === 'VectorWall') {
            return;
        }
        otherObj.gameObject.delete(true);
        this.player.comboCounter.incrementCombo(); 
        return;
    }

}
