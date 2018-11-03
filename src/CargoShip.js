import { ThrustEmitter } from './ThrustEmitter'
import { destroyObject } from './matter/MatterHelper'

export class CargoShip extends Phaser.Physics.Matter.Sprite {
    constructor(config) {
        super(config.scene.matter.world, config.startPostion.x, config.startPostion.y, 'cargo_' + config.cargoKeyNumber);
        this.setBodyVertices(config.cargoKeyNumber);
        this.body.key = this.constructor.name;
        this.scene.add.existing(this);
        this.velocity = 1;
        this.setStatic(true);
        this.removeShipAfterTween = false;
        this.body.delete = this.delete.bind(this);
        this.moveSpeed = {y:4, x:1};
        this.warpOutPositionY = config.warpOutPositionY;
        this.warpToPostionY = config.warpToPostionY;
        this.straighPathPostion = config.straighPathPostion;
        this.startPostion = config.startPostion;
        this.veerOff =  config.veerOff;
        this.matterHelper = config.matterHelper;
        this.currentTween = false;
        this.isWarping = false;
        this.body.done = this.onPowerThrustCollision.bind(this);
        this.setCollisionCategory(config.scene.matterHelper.getMainCollisionGroup());
        this.setDepth(2);

        this.thrusterParticles = this.scene.add.particles('orange').setDepth(1);
        
        this.thruster = this.thrusterParticles.createEmitter({
            x: 0,
            y: 1000, 
            speed: config.cargoKeyNumber == 1? 300 : 100,
            scale: { start: config.cargoKeyNumber == 1? 4 : 2, end: 0 },
            blendMode: 'ADD',
            lifespan : config.cargoKeyNumber == 1? 300 : 200,
            angle: {min: 70, max:110}
        })

    }

    //some duplicate code here 
    setBodyVertices(imageKey) {
        switch (imageKey) {
            case 1 :
                this.setPolygon(0,0, {
                    vertices: [
                        {x: 199, y: 110},
                        {x: 309.4000244140625, y: 1.2000007629394531},
                        {x: 331, y: 106.80000305175781},
                        {x: 357.4000244140625, y: 50.80000305175781},
                        {x: 373.4000244140625, y: 91.60000610351562},
                        {x: 371.79998779296875, y: 238},
                        {x: 396.5999755859375, y: 244.39999389648438},
                        {x: 399.79998779296875, y: 323.6000061035156},
                        {x: 347, y: 487.5999755859375},
                        {x: 345.4000244140625, y: 414},
                        {x: 288.5999755859375, y: 418.79998779296875},
                        {x: 288.5999755859375, y: 556.4000244140625},
                        {x: 230.20001220703125, y: 558.7999877929688},
                        {x: 200.60000610351562, y: 598},
                        {x: 171.79998779296875, y: 558},
                        {x: 112.60000610351562, y: 556.4000244140625},
                        {x: 111.79998779296875, y: 416.3999938964844},
                        {x: 77.39999389648438, y: 412.3999938964844},
                        {x: 51.79998779296875, y: 487.5999755859375},
                        {x: 3.79998779296875, y: 338.79998779296875},
                        {x: 3.79998779296875, y: 248.39999389648438},
                        {x: 27.79998779296875, y: 244.39999389648438},
                        {x: 27, y: 97.19999694824219},
                        {x: 41.399993896484375, y: 52.400001525878906},
                        {x: 70.20001220703125, y: 109.19999694824219},
                        {x: 74.20001220703125, y: 39.599998474121094},
                        {x: 92.60000610351562, y: 0.40000152587890625},
                    ]
                });
                return;
            case 2:
                this.setPolygon(0,0, {
                    vertices: [
                        {x: 58.666656494140625, y: -0.6666717529296875},
                        {x: 78, y: 20.666671752929688},
                        {x: 84, y: 67.33332824707031},
                        {x: 91.33334350585938, y: 57.33332824707031},
                        {x: 102, y: 57.33332824707031},
                        {x: 103.33334350585938, y: 66},
                        {x: 118.66665649414062, y: 112},
                        {x: 111.33334350585938, y: 120.66665649414062},
                        {x: 108.66665649414062, y: 131.33334350585938},
                        {x: 90.66665649414062, y: 130},
                        {x: 85.33334350585938, y: 150.66665649414062},
                        {x: 70.66665649414062, y: 183.33334350585938},
                        {x: 59.333343505859375, y: 158},
                        {x: 47.333343505859375, y: 183.33334350585938},
                        {x: 37.333343505859375, y: 152.66665649414062},
                        {x: 31.333343505859375, y: 131.33334350585938},
                        {x: 10, y: 130.66665649414062},
                        {x: 7.333343505859375, y: 121.33334350585938},
                        {x: -0.6666717529296875, y: 112.66665649414062},
                        {x: 15.333343505859375, y: 70},
                        {x: 18, y: 58},
                        {x: 28.666656494140625, y: 56.66667175292969},
                        {x: 35.333343505859375, y: 69.33332824707031},
                        {x: 37.333343505859375, y: 32},
                        {x: 45.333343505859375, y: 13.333328247070312}
                    ]
                });
                return;
            case 3:
                this.setPolygon(0,0, {
                    vertices: [
                        {x: 71.66665649414062, y: 1.3333282470703125},
                        {x: 87.66665649414062, y: 18.666671752929688},
                        {x: 101, y: 57.33332824707031},
                        {x: 111, y: 56.66667175292969},
                        {x: 130.33334350585938, y: 114},
                        {x: 120.33334350585938, y: 128.66665649414062},
                        {x: 99, y: 130.66665649414062},
                        {x: 94.33334350585938, y: 147.33334350585938},
                        {x: 80.33334350585938, y: 184},
                        {x: 65, y: 159.33334350585938},
                        {x: 48.333343505859375, y: 184},
                        {x: 36.333343505859375, y: 149.33334350585938},
                        {x: 32.333343505859375, y: 132},
                        {x: 12.333343505859375, y: 130},
                        {x: -0.3333282470703125, y: 110.66665649414062},
                        {x: 18.333343505859375, y: 57.33332824707031},
                        {x: 37, y: 56},
                        {x: 41.666656494140625, y: 18.666671752929688},
                        {x: 56.333343505859375, y: 2.6666717529296875}
                    ]
                });
                return;
            case 4:
                this.setPolygon(0,0, {
                    vertices: [
                        {x: 48.333343505859375, y: 0.3333282470703125},
                        {x: 73, y: 53},
                        {x: 87, y: 53},
                        {x: 87.66665649414062, y: 17},
                        {x: 96.33334350585938, y: 70.33334350585938},
                        {x: 87.66665649414062, y: 105},
                        {x: 77.66665649414062, y: 105},
                        {x: 75, y: 125},
                        {x: 85, y: 135.66665649414062},
                        {x: 85.66665649414062, y: 144.33334350585938},
                        {x: 81, y: 168.33334350585938},
                        {x: 15.666656494140625, y: 169.66665649414062},
                        {x: 11.666656494140625, y: 145.66665649414062},
                        {x: 11.666656494140625, y: 136.33334350585938},
                        {x: 23, y: 121.66665649414062},
                        {x: 5.666656494140625, y: 105},
                        {x: -1, y: 67.66665649414062},
                        {x: 9.666656494140625, y: 16.333328247070312},
                        {x: 12.333343505859375, y: 51.66667175292969},
                        {x: 23, y: 51.66667175292969},
                        {x: 38.333343505859375, y: 6.3333282470703125}
                    ]
                })
                return;
            case 5:
                this.setPolygon(0,0, {
                    vertices: [
                        {x: 115.66665649414062, y: 0.8333358764648438},
                        {x: 141.66665649414062, y: 64.83332824707031},
                        {x: 157, y: 28.833328247070312},
                        {x: 173, y: 70.83332824707031},
                        {x: 194.33334350585938, y: 37.5},
                        {x: 225.66665649414062, y: 112.16667175292969},
                        {x: 231, y: 222.83334350585938},
                        {x: 195, y: 180.16665649414062},
                        {x: 186.33334350585938, y: 333.5},
                        {x: 167, y: 294.8333435058594},
                        {x: 143, y: 332.8333435058594},
                        {x: 114.33334350585938, y: 305.5},
                        {x: 85.66665649414062, y: 334.1666564941406},
                        {x: 58.33332824707031, y: 293.5},
                        {x: 43, y: 334.1666564941406},
                        {x: 35.66667175292969, y: 310.1666564941406},
                        {x: 33, y: 180.83334350585938},
                        {x: 0.3333282470703125, y: 220.83334350585938},
                        {x: -1.6666717529296875, y: 156.16665649414062},
                        {x: 17.666671752929688, y: 74.16667175292969},
                        {x: 36.33332824707031, y: 38.83332824707031},
                        {x: 52.33332824707031, y: 66.83332824707031},
                        {x: 71.66665649414062, y: 29.5},
                        {x: 90.33334350585938, y: 66.16667175292969},
                        {x: 107.66665649414062, y: 1.5}   
                    ]
                })   
                return;
            case 6:   
                this.setPolygon(0,0, {
                    vertices: [
                        {x: 70, y: 43.33332824707031},
                        {x: 98, y: 50.66667175292969},
                        {x: 98.66665649414062, y: 3.3333282470703125},
                        {x: 107.33334350585938, y: 47.33332824707031},
                        {x: 118.66665649414062, y: 88.66667175292969},
                        {x: 139.33334350585938, y: 120},
                        {x: 118.66665649414062, y: 140},
                        {x: 138.66665649414062, y: 182.66665649414062},
                        {x: 118, y: 186},
                        {x: 112, y: 226.66665649414062},
                        {x: 92, y: 226},
                        {x: 85.33334350585938, y: 250.66665649414062},
                        {x: 44.666656494140625, y: 249.33334350585938},
                        {x: 38, y: 217.33334350585938},
                        {x: 22.666656494140625, y: 255.33334350585938},
                        {x: 2.6666717529296875, y: 192},
                        {x: 0.6666717529296875, y: 70.66667175292969},
                        {x: 23.333343505859375, y: 0.6666717529296875},
                        {x: 31.333343505859375, y: 60.66667175292969},
                        {x: 54, y: 64}      
                    ]
                })
                return;
            case 7:   
                this.setPolygon(0,0, {
                    vertices: [
                        {x: 70, y: 43.33332824707031},
                        {x: 98, y: 50.66667175292969},
                        {x: 98.66665649414062, y: 3.3333282470703125},
                        {x: 107.33334350585938, y: 47.33332824707031},
                        {x: 118.66665649414062, y: 88.66667175292969},
                        {x: 139.33334350585938, y: 120},
                        {x: 118.66665649414062, y: 140},
                        {x: 138.66665649414062, y: 182.66665649414062},
                        {x: 118, y: 186},
                        {x: 112, y: 226.66665649414062},
                        {x: 92, y: 226},
                        {x: 85.33334350585938, y: 250.66665649414062},
                        {x: 44.666656494140625, y: 249.33334350585938},
                        {x: 38, y: 217.33334350585938},
                        {x: 22.666656494140625, y: 255.33334350585938},
                        {x: 2.6666717529296875, y: 192},
                        {x: 0.6666717529296875, y: 70.66667175292969},
                        {x: 23.333343505859375, y: 0.6666717529296875},
                        {x: 31.333343505859375, y: 60.66667175292969},
                        {x: 54, y: 64}      
                    ]
                })
                return;
            case 8:
            this.setPolygon(0,0, {
                vertices: [
                    {x: 48.333343505859375, y: 0.3333282470703125},
                    {x: 73, y: 53},
                    {x: 87, y: 53},
                    {x: 87.66665649414062, y: 17},
                    {x: 96.33334350585938, y: 70.33334350585938},
                    {x: 87.66665649414062, y: 105},
                    {x: 77.66665649414062, y: 105},
                    {x: 75, y: 125},
                    {x: 85, y: 135.66665649414062},
                    {x: 85.66665649414062, y: 144.33334350585938},
                    {x: 81, y: 168.33334350585938},
                    {x: 15.666656494140625, y: 169.66665649414062},
                    {x: 11.666656494140625, y: 145.66665649414062},
                    {x: 11.666656494140625, y: 136.33334350585938},
                    {x: 23, y: 121.66665649414062},
                    {x: 5.666656494140625, y: 105},
                    {x: -1, y: 67.66665649414062},
                    {x: 9.666656494140625, y: 16.333328247070312},
                    {x: 12.333343505859375, y: 51.66667175292969},
                    {x: 23, y: 51.66667175292969},
                    {x: 38.333343505859375, y: 6.3333282470703125}
                ]
            })
            return;
        }
    }

    update() {

        this.moveX();
        this.moveY();
        //this.thruster.update();
        this.thruster.setPosition(this.x, this.y + this.height/2 - 20);
        

    }

    moveY() {
        if (this.y >= this.warpOutPositionY) {
            this.y -= this.moveSpeed.y;
        } else {
            this.warpToLocation(this.startPostion.x, this.warpToPostionY);
        }
    }
    moveX() {
       // debugger;
        if(this.y < this.veerOff.postionY){
            this.x+= this.moveSpeed.x * this.veerOff.xDirection;
            return;
        }

        if (this.x > this.straighPathPostion.x) {
            this.x-=this.moveSpeed.x;
        } else if (this.x < this.straighPathPostion.x) {
            this.x+=this.moveSpeed.x;
        }
    }

    getTop() {
        return this.y - this.height / 2;
    }

    getRight() {
        return this.x + this.width / 2;
    }

    onPowerThrustCollision(){
        if(this.isWarping){
            return;
        }
        this.delete();
    }

    delete(isExploding) {
        this.thrusterParticles.destroy();
        destroyObject(this, isExploding);
    }


    warpToLocation(x, y) {
        this.x = x;
        this.y = y;
    }

    tintWhite() {
        this.setTintFill(0xffffff);
    }

    getDimensions() {
        //get demensions before creating 
        this.scene.textures.get('cargo_1').getSourceImage().width
    }

}