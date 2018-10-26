import { getRandomInt, getDistanceBetweenObjects } from "../Helper";

//TODO: don't call objects through the scene
export class CollisionHandler {
    static startCollisionDetection(config) {
        this.scene = config.scene;
        this.scene.matter.world.on('collisionactive', this.onCollisionActive.bind(this));
        this.scene.matter.world.on('collisionstart', this.onCollisionStart.bind(this));
    }

    static onCollisionActive(event, bodyA, bodyB) {
        this.handleAllCollisions(event, bodyA, bodyB); 
    }

    static onCollisionStart(event, bodyA, bodyB) {
        this.handleAllCollisions(event, bodyA, bodyB); 
    }

    //reaaaaly sucks that I have to do this
    static handleAllCollisions(event, bodyA, bodyB) {
        if (this.scene.player.dead) {
            return;
        }
        let isTrustAppliedForThisLoop = false;
        for (let aPair of event.pairs) {

            if ((aPair.bodyA.key === "Player" || aPair.bodyB.key === "Player")) {
                if (!this.scene.playerInvinsible) {
                    this.onPlayerCollisionWithNonTruster(aPair.bodyA, aPair.bodyB);
                }
            }  

            if (aPair.bodyA.key === "Thruster" || aPair.bodyB.key === "Thruster") {
                if (!isTrustAppliedForThisLoop){
                    isTrustAppliedForThisLoop = true;
                    this.onTrusterCollision(aPair);
                }
            } 

            if (aPair.bodyA.key === "SpaceRock" || aPair.bodyB.key === "SpaceRock") {
                this.onSpaceRockCollision(aPair.bodyA, aPair.bodyB);
            }  

            if ((aPair.bodyA.key === "Spinner" || aPair.bodyB.key === "Spinner" )) {
                this.onSpinnerCollision(aPair.bodyA, aPair.bodyB);
            } 

            if (aPair.bodyA.key === "Missle" || aPair.bodyB.key === "Missle") {
                this.onMissleCollision(aPair.bodyA, aPair.bodyB);
            }
        }
    }

    static onTrusterCollision(aPair) {
        if (this.scene.player.getIsPowerThrusting()) {
            return;
        }
        

        let contactPoints = {
            x : aPair.collision.supports[0].x + aPair.collision.penetration.x, 
            y : aPair.collision.supports[0].y + aPair.collision.penetration.y 
        };

        //TODO: break the thruster into another class and put this code there 
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
                        x : this.scene.player.thrusterImage.x, 
                        y : this.scene.player.thrusterImage.y
                    }
                );
            }            
        }

        this.scene.player.queueBoostThrust();
        this.scene.player.incrementPower();
    }

    static emitter(source) {
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


    static getCollisionObjects(objectKeyName,bodyA, bodyB) {
        let keyObject;
        let otherObj;
        if (bodyA.key === objectKeyName) {
            keyObject = bodyA;
            otherObj = bodyB;
        } else if (bodyB.key === objectKeyName) {
            keyObject = bodyB;
            otherObj = bodyA;
        }
        return { keyObject: keyObject, otherObj : otherObj };  
    }

    static onSpinnerCollision(bodyA, bodyB) {
        let otherObj = this.getCollisionObjects("Spinner", bodyA, bodyB).otherObj;
        if (otherObj.key === "SpaceRock" || otherObj.key === "CargoShip") {
            otherObj.delete(true);
        }
    }   

    static onSpaceRockCollision(bodyA, bodyB) {
        let objectPair = this.getCollisionObjects("SpaceRock", bodyA, bodyB);
        let spackRockObj = objectPair.keyObject;
        let otherObj = objectPair.otherObj;

        if (otherObj.key === "Thruster") {
            return;
        }

        if (otherObj.key === "CargoShip") {
            spackRockObj.gameObject.delete(true);
            return;
        }
        spackRockObj.changeDirection();
    }

    static onMissleCollision(bodyA, bodyB) {

        let missleObj = this.getCollisionObjects("Missle", bodyA, bodyB).keyObject;
        let otherObj = this.getCollisionObjects("Missle", bodyA, bodyB).otherObj;

        if (!missleObj.gameObject || !otherObj.gameObject) {
            return;
        }

        if (!missleObj.gameObject.activated) {
            return;
        }

        if (otherObj.key === "VectorWall") {
            return;
        }

        if (otherObj.key === "Spinner") {
            missleObj.gameObject.delete(true);
            return;
        }

        if (otherObj.key !== "Thruster" && otherObj.key !== "Player" ) {
            missleObj.gameObject.delete(true);
            otherObj.gameObject.delete(true);
        }

    }

    //TODO: use gameobject instead of attaching things to the body
    static onPlayerCollisionWithNonTruster(bodyA, bodyB) {
        let objectPair = this.getCollisionObjects("Player", bodyA, bodyB);
        let playerObj = objectPair.keyObject;
        let otherObj = objectPair.otherObj;

        if( otherObj.key === "Thruster"){
            return;
        }

        if (playerObj.gameObject.dead) {
            return;
        }

        if (playerObj.gameObject.isPowerThrusting 
            && otherObj.key !== 'Spinner'
            && otherObj.key !== 'Missle'
            ){

            if (otherObj.key === 'VectorWall') {
                return;
            }
            otherObj.gameObject.delete(true);
            playerObj.gameObject.incrementCombo(); 
            return;
        }

        this.scene.killPlayer(); 
    }
}