//walls on each side with a configurable amount of sapce rocks evenly spread out 
import { Wall } from '../Wall'
import { SpaceRock } from '../SpaceRock'

export class Traffic{

    constructor(config){
        this.bodies = [];
        this.topY= config.y - Wall.getHeight() *2;
        this.x = config.x;
        this.y = config.y;
        this.width = config.width;
        this.height= Wall.getHeight() *2;
        this.scene = config.scene;
        this.makeSpaceRockTube(config); 
    }

    makeSpaceRockTube(config){
        let height = 1000;
        let open =  500; //amount to angle out from tube 

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

        let distanceToClosing = 500;

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
        ]

        let closingWallLeft = [
            {x:config.x - open, y:config.y - height - distanceToClosing}, //topleft
            {x:config.x + wallWidth - open , y:config.y - height - distanceToClosing}, //topright         
            {x:config.x , y:config.y - height*2 - distanceToClosing}, //topleft
            {x:config.x + wallWidth  , y:config.y - height*2 - distanceToClosing}, //topright   

        ]

        let closingWallRight = [
            {x:config.x + config.width  + open , y:config.y - height - distanceToClosing }, //top right
            {x:config.x + config.width - wallWidth + open, y:config.y - height - distanceToClosing}, //top left          
            {x:config.x + config.width, y:config.y - height*2 - distanceToClosing}, //topleft
            {x:config.x + config.width - wallWidth, y:config.y - height*2 - distanceToClosing}, //topright   

        ]

        this.makeVectorWall(leftWall);
        this.makeVectorWall(rightWall);
        this.makeVectorWall(leftWallStraight);
        this.makeVectorWall(rightWallStraight);
        this.makeVectorWall(closingWallLeft);
        this.makeVectorWall(closingWallRight);

        this.topY = config.y - (height*2 //opening/closing cones 
                    +distanceToClosing); //straighaways 
    }

    //TODO: break this into a class 
    //pass this.bodies as a param
    makeVectorWall(vertices){
        
        vertices = Phaser.Physics.Matter.Matter.Vertices.clockwiseSort(vertices);
        var center = Phaser.Physics.Matter.Matter.Vertices.centre(vertices);

        let yo = this.scene.matter.add.fromVertices(
            center.x, 
            center.y, 
            vertices,
            {isStatic: true}
        );

        yo.update = function(){};

        this.bodies.push(yo);

        this.phaserPoly(vertices);
    }

    phaserPoly(points){
        var polygon = new Phaser.Geom.Polygon(points);

        var graphics = this.scene.add.graphics();

        graphics.lineStyle(2, 0x00aa00);

        graphics.beginPath();

        graphics.moveTo(
            polygon.points[0].x,
            polygon.points[0].y
        );

        for (var i = 1; i < polygon.points.length; i++)
        {
            graphics.lineTo(
                polygon.points[i].x,
                polygon.points[i].y
            );
        }

        graphics.closePath();
        graphics.strokePath();

    }
}