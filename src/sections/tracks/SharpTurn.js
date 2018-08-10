import { VectorWall } from '../../VectorWall'
import { degreesToRadians, getRandomInt } from '../../Helper'

export class SharpTurn {
    static makeAndGetBodies(config){
       // let walls = [];
        //180 -> sharp left 
        //1 -> sharp right
        this.angle = getRandomInt(1,180);

        this.angleOffset = config.wallWidth * (1 - this.angle/90);
        
        let dist = 1000;
        var x =   dist * Math.cos(degreesToRadians(this.angle));
        var y =  dist * Math.sin(degreesToRadians(this.angle));
        //1000 -> middle pillar height 
        let topOfMiddlePillars = this.getMiddlePillarTopCoords(config, 1000, x, y);
        this.walls = [];
        this.makeBottomPillars(config);
        this.makeMiddlePillars(config, topOfMiddlePillars);
        this.makeTopPillars(config, topOfMiddlePillars);
        
        return { walls:this.walls, topLeft: this.topLeftOfTrack  };
    }

    static makeBottomPillars(config) {
        let leftWallHeight = 1000;
        let rightWallHeight = 1000;

        let leftWall = [
            {
                //bottom left
                x: config.x, 
                y: config.y
            },
            {
                //bottom right
                x: config.x + config.wallWidth, 
                y: config.y
            },
            {
                //top right
                x: config.x + config.wallWidth, 
                y: config.y - leftWallHeight 
            },
            {
                //top left
                x: config.x, 
                y: config.y - leftWallHeight - this.angleOffset
            }
        ]

        let rightWall = [
            {
                //bottom left
                x: config.x + config.width - config.wallWidth, 
                y: config.y
            },
            {
                //top left
                x: config.x + config.width - config.wallWidth, 
                y: config.y - rightWallHeight + this.angleOffset
            },
            {
                //top right
                x: config.x + config.width, 
                y: config.y - rightWallHeight + this.angleOffset*2
            },
            {
                //bottom right
                x: config.x + config.width, 
                y: config.y
            }
        ]

        this.walls.push(            
            new VectorWall({ scene:config.scene, vertices: leftWall }),
            new VectorWall({ scene:config.scene, vertices: rightWall })
        )
    
    }

    static makeMiddlePillars(config, topCoords) {

  
        let angleOffset = this.angleOffset;

        let leftWallHeight = 1000;
        let rightWallHeight = 1000;


        let leftWall = [
            {
                //top left 
                x:config.x, 
                y:config.y - leftWallHeight - angleOffset              
            },
            {
                //bottom right 
                x:config.x + config.wallWidth, 
                y:config.y - leftWallHeight 
            },
            topCoords.leftWall.topRight 
            ,
            topCoords.leftWall.topLeft 
        ]

        let rightWall = [
            {   
                //bottom left 
                x:config.x + config.width - config.wallWidth,  //1
                y:config.y - rightWallHeight + angleOffset
            },
            {
                //bottom right
                x:config.x + config.width, 
                y:config.y - rightWallHeight + angleOffset*2 //2
            },
            topCoords.rightWall.topRight 
            ,
            topCoords.rightWall.topLeft 
        ]

        this.walls.push( 
            new VectorWall({ scene:config.scene, vertices: leftWall }),
            new VectorWall({ scene:config.scene, vertices: rightWall }),
        )
    }

    //x,y -> end coord of distance at an angle
    static getMiddlePillarTopCoords(config, height, x, y) {
        return {
            rightWall: {
                topLeft: {
                    x:config.x + config.width - config.wallWidth + x, 
                    y:config.y - height + this.angleOffset - y 
                },
                topRight: {
                    x:config.x + config.width + x, 
                    y:config.y - height + this.angleOffset*2 - y   
                } 
            },
            leftWall: {
                topRight:{   
                    x:config.x + config.wallWidth + x, 
                    y: config.y - height - y,
                },
                topLeft:
                {   
                    x:config.x + x, 
                    y: config.y - height - y - this.angleOffset,
                }    
            }
        }
    }

    static makeTopPillars(config, topCoords) {
        let height = 1000;
        
        let leftWall = [
            topCoords.leftWall.topLeft,
            topCoords.leftWall.topRight,
            {
                x: topCoords.leftWall.topRight.x,
                y: topCoords.leftWall.topRight.y - height 
            },
            {
                x: topCoords.leftWall.topLeft.x,
                y: topCoords.leftWall.topLeft.y - height + this.angleOffset
            }          
        ]

       

        let rightWall = [
            topCoords.rightWall.topLeft,
            topCoords.rightWall.topRight,
            {
                x: topCoords.rightWall.topRight.x,
                y: topCoords.rightWall.topRight.y - height - this.angleOffset*2  
            },
            {
                x: topCoords.rightWall.topLeft.x,
                y: topCoords.rightWall.topLeft.y - height - this.angleOffset 
            }      
        ]

        this.topLeftOfTrack = {x: topCoords.leftWall.topLeft.x , y: topCoords.leftWall.topLeft.y - height + this.angleOffset};

        this.walls.push( 
            new VectorWall({ scene:config.scene, vertices: leftWall }),
            new VectorWall({ scene:config.scene, vertices: rightWall }),
        )
    } 
}