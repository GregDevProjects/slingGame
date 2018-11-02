import { Missle } from '../Missle'

const missileStatus = { launched: 1, readyToLaunch: 2, prepingToLaunch: 3 }
const maxMissileFireDistance = 200;

export class MissileHandler {
    constructor(pursuer, player, scene) {
        this.player = player;
        this.scene = scene;
        this.pursuer = pursuer;
        this.missile = {
            status: missileStatus.readyToLaunch, 
            gameObject: null
        };

        
    }

    update() {
        if(this.isMissileLaunched()) {
            this.launchMissile();
        }

        if(this.missile.status == missileStatus.launched && this.missile.gameObject.body) {
            this.missile.gameObject.update();
        }

        this.setMissileReadyToLaunchIfMissileWasDestroyed();

        if (this.isMissileReadyToFireAgain()) {
            this.missile.status = missileStatus.readyToLaunch;
        } 
    }

    delete() {
        if (this.missile.status == missileStatus.launched) {
            this.missile.gameObject.delete();
        }
    }

    isMissileReadyToFireAgain() {
        return (this.missile.status == missileStatus.readyToLaunch); 
    }

    setMissileReadyToLaunchIfMissileWasDestroyed() {
        if(this.missile.status == missileStatus.launched && !this.missile.gameObject.body) {
            this.missile.status = missileStatus.readyToLaunch;
        }
    }

    isMissileLaunched() {
        return Math.abs(this.pursuer.x - this.player.x) < 50 && this.missile.status == missileStatus.readyToLaunch;
    }

    launchMissile() {
        this.missile.status = missileStatus.prepingToLaunch;
        
        const didLaunch = this.pursuer.startWarningPulse(function(){
            if (this.getXDistanceFromPlayer() > maxMissileFireDistance) {
                //added this as a way to prevent the missile from firing outside the play area
                //this likely won't solve the problem in every situation.. I'm leaving it as an
                //acceptable bug ¯\_(ツ)_/¯ 
                this.missile.status = missileStatus.readyToLaunch;
                return;
            }
            this.missile.gameObject = new Missle({scene:this.scene, x: this.pursuer.x, y: this.pursuer.y, player: this.player});
            this.missile.status = missileStatus.launched;
            
        }.bind(this), 'orange')

        if(!didLaunch) {
            this.missile.status = missileStatus.readyToLaunch;
        } 
    }

    getXDistanceFromPlayer() {
        return Math.abs(this.pursuer.x - this.player.x);
    }

    tintWhite() {
        if(!this.missile.gameObject || !this.missile.gameObject.body)
            return
        this.missile.gameObject.tintWhite();
    }

    removeTint() {
        if(!this.missile.gameObject || !this.missile.gameObject.body)
            return
        this.missile.gameObject.clearTint();
    }
}