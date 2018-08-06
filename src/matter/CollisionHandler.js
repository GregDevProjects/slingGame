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
                    this.onPlayerCollisionWithNonTruster(bodyA, bodyB);
                }

            }  
            
            if (aPair.bodyA.key === "Wall" || aPair.bodyB.key === "Wall") {
                //call wall collision
                // console.log('wall');
            }

            if (aPair.bodyA.key === "Thruster" || aPair.bodyB.key === "Thruster") {
                if(!this.scene.player.getIsPowerThrusting()){
                    this.scene.player.queueBoostThrust();
                    this.scene.player.incrementPower();
                }
            }

            if (aPair.bodyA.key === "SpaceRock" || aPair.bodyB.key === "SpaceRock") {
                //gotta find a better way to do this
                if (aPair.bodyA.key === "SpaceRock" && aPair.bodyB.key === "VectorWall") {
                    aPair.bodyA.changeDirection();
                } else if (aPair.bodyB.key === "SpaceRock" && aPair.bodyA.key === "VectorWall") {
                    aPair.bodyB.changeDirection();
                }
            }  

            if ((aPair.bodyA.key === "Spinner" || aPair.bodyB.key === "Spinner" )) {
                if (bodyA.key === "SpaceRock" ||  bodyA.key === "CargoShip") {
                    bodyA.delete(true);
                }

                if (bodyB.key === "SpaceRock" ||  bodyB.key === "CargoShip") {
                    bodyB.delete(true);
                }
            } 
        }


    }



    static onPlayerCollisionWithNonTruster(bodyA, bodyB) {
        if( bodyA.key === "Thruster" || bodyB.key === "Thruster"){
            return;
        }

        if (this.scene.player.isPowerThrusting && bodyA.key !== 'Spinner' && bodyB.key !== 'Spinner'){
            if (bodyA.key !== 'Player' && bodyA.key !== 'VectorWall'){
                bodyA.delete(true);
                this.scene.player.incrementCombo();
            }

            if (bodyB.key !== 'Player' && bodyB.key !== 'VectorWall'){  
                bodyB.delete(true);
                this.scene.player.incrementCombo();
            }
            return;
        }
        this.scene.player.onDeath().on('animationcomplete', function () {
            //TODO: move this to GameplayScene
            this.scene.deleteGameObjects();
            this.scene.createGameObjects();
            
        }.bind(this), this.scene);
    }
}