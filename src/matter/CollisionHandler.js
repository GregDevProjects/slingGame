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
    //TODO: setup base class for matter objects that have a key 
    static handleAllCollisions(event, bodyA, bodyB) {
        for (let aPair of event.pairs) {

            if ((aPair.bodyA.key === "Player" || aPair.bodyB.key === "Player")) {
                if (!this.scene.playerInvinsible) {
                    //vector wall collides with thruster here 
                    this.onPlayerCollisionWithNonTruster(aPair.bodyA, aPair.bodyB);
                   
                }
                continue;
            }  

            if (aPair.bodyA.key === "Thruster" || aPair.bodyB.key === "Thruster") {
                if(!this.scene.player.getIsPowerThrusting()){
                    this.scene.player.queueBoostThrust();
                    this.scene.player.incrementPower();
                    continue;
                }
            }

            if (aPair.bodyA.key === "SpaceRock" || aPair.bodyB.key === "SpaceRock") {
                //gotta find a better way to do this
                if (aPair.bodyA.key === "SpaceRock" && aPair.bodyB.key === "VectorWall") {
                    aPair.bodyA.changeDirection();
                } else if (aPair.bodyB.key === "SpaceRock" && aPair.bodyA.key === "VectorWall") {
                    aPair.bodyB.changeDirection();
                }
                continue;
            }  

            if ((aPair.bodyA.key === "Spinner" || aPair.bodyB.key === "Spinner" )) {
                if (bodyA.key === "SpaceRock" ||  bodyA.key === "CargoShip") {
                    bodyA.delete(true);
                }

                if (bodyB.key === "SpaceRock" ||  bodyB.key === "CargoShip") {
                    bodyB.delete(true);
                }
                continue;
            } 

            if (aPair.bodyA.key === "Missle" || aPair.bodyB.key === "Missle") {
                this.onMissleCollision(aPair.bodyA, aPair.bodyB);
            }
        }


    }


    static onMissleCollision(bodyA, bodyB) {
        let missleObj;
        let otherObj;
        if (bodyA.key === "Missle") {
            missleObj = bodyA;
            otherObj = bodyB;
        } else if (bodyB.key === "Missle") {
            missleObj = bodyB;
            otherObj = bodyA;
        }

        if (otherObj.key !== "VectorWall" && otherObj.key !== "Thruster" && otherObj.key !== "Player" ) {
            missleObj.gameObject.delete(true);
            otherObj.gameObject.delete(true);
        }

    }

    //TODO: use gameobject instead of attaching things to the body
    static onPlayerCollisionWithNonTruster(bodyA, bodyB) {

        let playerObj;
        let otherObj;
        if (bodyA.key === "Player") {
            playerObj = bodyA;
            otherObj = bodyB;
        } else if (bodyB.key === "Player") {
            playerObj = bodyB;
            otherObj = bodyA;
        }

        if (!otherObj) {
            debugger;
        }

        if( otherObj.key === "Thruster"){
            return;
        }

        if (this.scene.player.isPowerThrusting 
            && otherObj.key !== 'Spinner'
            && otherObj.key !== 'Missle'
            ){

            if (otherObj.key === 'VectorWall') {
                    return;
                }
                otherObj.gameObject.delete(true);
                this.scene.player.incrementCombo();
            
                return;
            }




        this.scene.player.onDeath().on('animationcomplete', function () {
            //TODO: move this to GameplayScene
            this.scene.deleteGameObjects();
            this.scene.createGameObjects();
            
        }.bind(this), this.scene);
    }
}