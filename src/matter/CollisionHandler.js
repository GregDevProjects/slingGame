import { getRandomInt, getDistanceBetweenObjects } from "../Helper";
import { debug } from "util";

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

               // console.log(event)
                this.onPlayerCollisionWithNonTruster(aPair.bodyA, aPair.bodyB);

            }  

            if (aPair.bodyA.key === "Thruster" || aPair.bodyB.key === "Thruster") {
                if (!isTrustAppliedForThisLoop){
                    isTrustAppliedForThisLoop = true;
                    this.onTrusterCollision(aPair, aPair.bodyA, aPair.bodyB);
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

            if (aPair.bodyA.key === "Pursuer" || aPair.bodyB.key === "Pursuer") {
                this.onPursuerCollision(aPair.bodyA, aPair.bodyB);
            }

            // if (aPair.bodyA.key === "Mine" || aPair.bodyB.key === "Mine") {
            //     this.onMineCollision(aPair.bodyA, aPair.bodyB);
            // }
        }
    }

    static onPursuerCollision(bodyA, bodyB) {
        let objectPair = this.getCollisionObjects("Pursuer", bodyA, bodyB);
        let mineObj = objectPair.keyObject;
        let otherObj = objectPair.otherObj;

        if (otherObj.key == "SpaceRock" || otherObj.key == "CargoShip" || otherObj.key == "SundayDriver") {
            otherObj.gameObject.delete(true);
            return;   
        }
    }

    static onMineCollision(bodyA, bodyB){
        let objectPair = this.getCollisionObjects("Mine", bodyA, bodyB);
        let mineObj = objectPair.keyObject;
        let otherObj = objectPair.otherObj;

  
    }

    static onTrusterCollision(aPair, bodyA, bodyB) {

        let objectPair = this.getCollisionObjects("Thruster", bodyA, bodyB);
        let thrusterObj = objectPair.keyObject;
        let otherObj = objectPair.otherObj;

        this.scene.player.collisionHandler.onThrusterCollision(aPair, otherObj)

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
        if (otherObj.key === "SpaceRock" || otherObj.key === "CargoShip" || otherObj.key == "SundayDriver") {
            otherObj.gameObject.delete(true);
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

        if (otherObj.key === "Mine") {
            return;
        }

        if (otherObj.key === "Player") {
            missleObj.gameObject.delete(true);
            return;
        }

        if (otherObj.key === "Thruster" ) {
            return;
        }
        missleObj.gameObject.delete(true);
        otherObj.gameObject.delete(true);
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
        // debugger
        this.scene.player.collisionHandler.onCollisionWithNonTruster(otherObj);
    }
}