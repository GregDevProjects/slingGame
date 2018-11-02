import { getDistanceBetweenObjects } from '../../../Helper'

const farthestLeftAngle = -110;
const farthestRightAngle = -70;
const minSpeed = 0.005;
const medSpeed = 0.015;
const maxSpeed = 0.025;

export const straightAngle = -90;

export class MovementHandler {

    static stayAheadOfPlayerAndTryToAlignOnX(player, pursuer) {
        this.turnTowardsPlayer(player, pursuer);
        this.applyThrust(player, pursuer);
    }

    static turnTowardsPlayer(player, pursuer) {

        if(Math.abs(pursuer.x - player.x) < 150) {

            if (pursuer.angle + 3 >=straightAngle && pursuer.angle - 3 <=straightAngle ) {
                return;
            }

            if (pursuer.angle < straightAngle){
                pursuer.angle++
            } else {
                pursuer.angle--
            }
            return;
        }

        if (pursuer.x > player.x) {
             if (pursuer.angle > farthestLeftAngle){
               // pursuer.setAngularVelocity(-pursuer.getTurnSpeed());
                pursuer.setAngle(pursuer.angle - 1)
             }
 
         } else {
             if (pursuer.angle < farthestRightAngle){   
                 pursuer.setAngle(pursuer.angle + 1)
             } 
         }
    }

    static applyThrust(player, pursuer) {
        const distance = getDistanceBetweenObjects(player, pursuer)
        if (distance <= 500){
            pursuer.thrust(maxSpeed);
            return;
        }

        if (distance <= 1000){
            pursuer.thrust(medSpeed);
            return;
        }

        if (distance <= 2000){
            pursuer.thrust(minSpeed);
            return;
        }
    }
}