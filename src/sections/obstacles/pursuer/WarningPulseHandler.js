export class WarningPulseHandler {

    constructor(target, scene) {
        this.scene = scene;
        this.target = target;

         this.particles = this.scene.add.particles('green').setDepth(10);
         this.powerFullEmitter = this.particles.createEmitter({
            frequency: 0,
            angle: { start: 0, end: 360, steps: 64 },
            speed: 150,
            scale: { start: 2, end: 0 },
            blendMode: 'SCREEN',
            yoyo:true,
            quantity: 100,
            lifespan: 1500,
            gravityY: 0,
            maxParticles: 100
        })
        .stop()

        

        this.lastPosition = { x :this.target.x, y: this.target.y };
    }

    update(){
        this.moveSurroundPulseParticlesWithPursuer();
        this.powerFullEmitter.setPosition(this.target.x, this.target.y);
    }
    
    //returns false if not able to fire
    startWarningPulseAndCallFunctionAtFinish(callback, particleKey) {
        if(this.isCharing) {
            return false;
        }

        this.isCharing = true;
        this.particles.setTexture(particleKey);
        this.powerFullEmitter.setPosition(this.target.x, this.target.y);
        this.powerFullEmitter.start();
        this.scene.time.delayedCall(300, function(){
            this.powerFullEmitter.stop();
        }.bind(this));

        this.scene.time.delayedCall(1500, function(){ 
            if(!this.scene || !this.target.body) {
                return;
            }
            this.isCharing = false;
            callback();
        }.bind(this));

        return true;
    }

    moveSurroundPulseParticlesWithPursuer() {
        if ((this.lastPosition.x !== this.target.x && this.lastPosition.y !== this.target.y)) {

            this.powerFullEmitter.alive.forEach(function(particle){
                particle.y += this.target.y - this.lastPosition.y ;
                particle.x += this.target.x - this.lastPosition.x;
            }.bind(this))

            this.lastPosition = { 
                x :this.target.x, 
                y: this.target.y 
            };
        }
    }

}