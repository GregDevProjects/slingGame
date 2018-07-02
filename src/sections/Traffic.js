//walls on each side with a configurable amount of sapce rocks evenly spread out 
import { Wall } from '../Wall'
import { VectorWall } from '../VectorWall'
import {CargoShip} from '../CargoShip'
import { Section } from './Section'
import { getRandomInt } from '../Helper'

export class Traffic extends Section {

    constructor(config){
        super();
        this.bodies = [];
        this.topY= config.y - Wall.getHeight() *2;
        this.x = config.x;
        this.y = config.y;
        this.width = config.width;
        //this.height= Wall.getHeight() *2;
        this.scene = config.scene;

        this.cargoShips = [];

        this.makeSpaceRockTube(config); 
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.x;
    }

    getWidth(){
        return this.width;
    }

    getTopY(){
        return this.topY;
    }

    makeSpaceRockTube(config){
        //height of the opening/closing bits 
        let height = 1000;
        //amount to angle out from tube 
        let open =  500; 
        //height of the straightways 
        let distanceToClosing = 500;

        let wallWidth = 200;

        let leftWall = [
            {x:config.x, y:config.y}, //bottom left
            {x:config.x + wallWidth, y:config.y }, //bottom right
            {x:config.x + wallWidth - open , y:config.y - height}, //top right
            {x:config.x - open, y:config.y - height}, //top left
        ];

        let rightWall = [
            {x:config.x + config.width - wallWidth, y:config.y}, //bottom left
            {x:config.x + config.width, y:config.y }, //bottom right
            {x:config.x + config.width  + open , y:config.y - height}, //top right
            {x:config.x + config.width - wallWidth + open, y:config.y - height}, //top left
        ];

        let leftWallStraight = [
            {x:config.x - open, y:config.y - height}, //bottomleft
            {x:config.x + wallWidth - open , y:config.y - height}, //bottomright
            {x:config.x - open, y:config.y - height - distanceToClosing}, //topleft
            {x:config.x + wallWidth - open , y:config.y - height - distanceToClosing} //topright           
        ];

        let rightWallStraight = [
            {x:config.x + config.width  + open , y:config.y - height }, //top right
            {x:config.x + config.width - wallWidth + open, y:config.y - height}, //top left        
            {x:config.x + config.width  + open , y:config.y - height - distanceToClosing }, //top right
            {x:config.x + config.width - wallWidth + open, y:config.y - height - distanceToClosing} //top left         
        ];

        let closingWallLeft = [
            {x:config.x - open, y:config.y - height - distanceToClosing}, //topleft
            {x:config.x + wallWidth - open , y:config.y - height - distanceToClosing}, //topright         
            {x:config.x , y:config.y - height*2 - distanceToClosing}, //topleft
            {x:config.x + wallWidth  , y:config.y - height*2 - distanceToClosing}, //topright   

        ];

        let closingWallRight = [
            {x:config.x + config.width  + open , y:config.y - height - distanceToClosing }, //top right
            {x:config.x + config.width - wallWidth + open, y:config.y - height - distanceToClosing}, //top left          
            {x:config.x + config.width, y:config.y - height*2 - distanceToClosing}, //topleft
            {x:config.x + config.width - wallWidth, y:config.y - height*2 - distanceToClosing}, //topright   

        ];

        this.bodies.push(
            new VectorWall({scene: this.scene, vertices: leftWall}),
            new VectorWall({scene: this.scene, vertices: rightWall}),
            new VectorWall({scene: this.scene, vertices: leftWallStraight}),
            new VectorWall({scene: this.scene, vertices: rightWallStraight}),
            new VectorWall({scene: this.scene, vertices: closingWallLeft}),
            new VectorWall({scene: this.scene, vertices: closingWallRight})
        );

        this.topY = config.y - (height*2 //opening/closing cones 
                    +distanceToClosing); //straighaways 
        
        this.trafficLimitX = {leftX:config.x - open, rightX: config.x + config.width  + open};

        this.addCargoShips();
    }

    update(){
        this.cargoShips.forEach((item, index, object)=>{
            if(item.y >=this.topY + 1000 ){        
                item.update();
            } else {
                item.y = this.y;
               // object.splice(index, 1);
            }
        })
        
    }

    delete(){
        this.cargoShips.forEach((aCargoShip)=>{
            aCargoShip.destroy();
        });

        this.bodies.forEach((aWall)=>{
            aWall.destroy();
        });
    }

    //traffic grid spans full width of grid with gaps for the player to fly through 
    addCargoShips(){
        //creates:
        //- - -
        //-----

        this.createBigShipsToTheRight(this.y);
        this.createBigShipsToTheRight(this.y + 800);
        return;

    }

    //keep spawning ships to the right until there is no more room 
    createBigShipsToTheRight(y){

        let startPositionX = this.trafficLimitX.leftX + 200;
        let gap = 200;
        let lastShip = false;
        while(startPositionX < this.trafficLimitX.rightX){
            if(lastShip){
                var newShip = this.createNewShipToTheRightOfShip(lastShip,gap);
            } else {
                var newShip = new CargoShip({scene:this.scene, x: startPositionX, y: y, cargoKeyNumber: getRandomInt(1,8)});
                
            }
            startPositionX += newShip.width;
            this.cargoShips.push(newShip);
            startPositionX+= gap; 
            lastShip = newShip;
        }
    }

    createNewShipAboveShip(newShip, offsetY) {
        let topShip = new CargoShip({scene:this.scene, x: 0, y: 0, boundry: this.topY, cargoKeyNumber: 1});
        topShip.y = newShip.getTop() - topShip.height/2 - offsetY;
        topShip.x = newShip.x;
        return topShip;
    }

    createNewShipToTheRightOfShip(newShip, offsetX){
       
        let rightShip = new CargoShip({scene:this.scene, x: 0, y: 0, boundry: this.topY, cargoKeyNumber: getRandomInt(1,8)});
        rightShip.y = newShip.y;
        rightShip.x = newShip.getRight() + rightShip.width/2 + offsetX;
        return rightShip;      
    }
}