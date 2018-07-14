import { VectorWall } from '../../VectorWall'

export class Tube {
    static makeAndGetBodies(config){
        let leftWall = [
            {x:config.x, y:config.y},
            {x:config.x + config.wallWidth, y: config.y},
            {x:config.x + config.wallWidth, y: config.y - config.height},
            {x:config.x, y: config.y - config.height}
        ]

        let rightWall = [
            {x:config.x + config.width - config.wallWidth, y:config.y},
            {x:config.x + config.width - config.wallWidth, y:config.y - config.height},
            {x:config.x + config.width, y:config.y - config.height},
            {x:config.x + config.width, y:config.y}
        ]

        return [
            new VectorWall({ scene:config.scene, vertices: leftWall }),
            new VectorWall({ scene:config.scene, vertices: rightWall })
        ]
           
        
    }
}