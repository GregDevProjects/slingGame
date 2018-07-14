import { VectorWall } from '../../VectorWall'

export class Diamond {
    static makeAndGetBodies(config){
        //x,y,wallWidth,height, width, scene
       
        //angle out/in y distance
        let openingYDistance = 500;
        //angle out/in x distance
        let openingXDistance = 500;

        let x = config.x;
        let y =config.y;
        let wallWidth = config.wallWidth;
        let height = config.height;
        let width = config.width;
        let scene = config.scene;

        let distanceToClosing = height - openingYDistance*2;

        let leftWall = [
            {x:x, y:y}, //bottom left
            {x:x + wallWidth, y:y }, //bottom right
            {x:x + wallWidth - openingXDistance , y:y - openingYDistance}, //top right
            {x:x - openingXDistance, y:y - openingYDistance}, //top left
        ];

        let rightWall = [
            {x:x + width - wallWidth, y:y}, //bottom left
            {x:x + width, y:y }, //bottom right
            {x:x + width  + openingXDistance , y:y - openingYDistance}, //top right
            {x:x + width - wallWidth + openingXDistance, y:y - openingYDistance}, //top left
        ];

        let leftWallStraight = [
            {x:x - openingXDistance, y:y - openingYDistance}, //bottomleft
            {x:x + wallWidth - openingXDistance , y:y - openingYDistance}, //bottomright
            {x:x - openingXDistance, y:y - openingYDistance - distanceToClosing}, //topleft
            {x:x + wallWidth - openingXDistance , y:y - openingYDistance - distanceToClosing} //topright           
        ];

        let rightWallStraight = [
            {x:x + width  + openingXDistance , y:y - openingYDistance }, //top right
            {x:x + width - wallWidth + openingXDistance, y:y - openingYDistance}, //top left        
            {x:x + width  + openingXDistance , y:y - openingYDistance - distanceToClosing }, //top right
            {x:x + width - wallWidth + openingXDistance, y:y - openingYDistance - distanceToClosing} //top left         
        ];

        let closingWallLeft = [
            {x:x - openingXDistance, y:y - openingYDistance - distanceToClosing}, //topleft
            {x:x + wallWidth - openingXDistance , y:y - openingYDistance - distanceToClosing}, //topright         
            {x:x , y:y - openingYDistance*2 - distanceToClosing}, //topleft
            {x:x + wallWidth  , y:y - openingYDistance*2 - distanceToClosing}, //topright   

        ];

        let closingWallRight = [
            {x:x + width  + openingXDistance , y:y - openingYDistance - distanceToClosing }, //top right
            {x:x + width - wallWidth + openingXDistance, y:y - openingYDistance - distanceToClosing}, //top left          
            {x:x + width, y:y - openingYDistance*2 - distanceToClosing}, //topleft
            {x:x + width - wallWidth, y:y - openingYDistance*2 - distanceToClosing}, //topright   

        ];

        return [
            new VectorWall({scene: scene, vertices: leftWall}),
            new VectorWall({scene: scene, vertices: rightWall}),
            new VectorWall({scene: scene, vertices: leftWallStraight}),
            new VectorWall({scene: scene, vertices: rightWallStraight}),
            new VectorWall({scene: scene, vertices: closingWallLeft}),
            new VectorWall({scene: scene, vertices: closingWallRight})
        ];
           
        
    }
}