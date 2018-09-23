//matterjs polygon with phaser polygon drawn araound it 
export class VectorWall {
    constructor(config){
        this.scene = config.scene;
        this.matterBodies = [];
        this.graphicsObjects = [];
        this.makeVectorWall(config.vertices);
        
       // this.body.key=this.constructor.name; 
    }

    //TODO: break this into a class 
    //pass this.bodies as a param
    makeVectorWall(vertices, scene, bodies){
        
        vertices = Phaser.Physics.Matter.Matter.Vertices.clockwiseSort(vertices);
        var center = Phaser.Physics.Matter.Matter.Vertices.centre(vertices);

        let matterObj = this.scene.matter.add.fromVertices(
            center.x, 
            center.y, 
            vertices,
            {isStatic: true}
        )
        matterObj.key = this.constructor.name;
        matterObj.collisionFilter.category = this.scene.matterHelper.getMainCollisionGroup();
        this.matterBodies.push(matterObj);


        this.phaserPoly(vertices);

        return bodies;
    }


    destroy(){
        this.matterBodies.forEach((aBody)=>{
            this.scene.matter.world.remove(aBody); 
        });

        this.graphicsObjects.forEach((aObj)=>{
            aObj.destroy();
        });
        
    }

    phaserPoly(points){
        var polygon = new Phaser.Geom.Polygon(points);
    
        var graphics = this.scene.add.graphics();
    
        graphics.lineStyle(2, 0xffffff );
        graphics.fillStyle(0x00000);
        
        graphics.beginPath();
        this.graphicsObjects.push(graphics.moveTo(
            polygon.points[0].x,
            polygon.points[0].y
        ));
        
        for (var i = 1; i < polygon.points.length; i++)
        {
            this.graphicsObjects.push(graphics.lineTo(
                polygon.points[i].x,
                polygon.points[i].y
            ));
        }

        graphics.setDepth(2);
        graphics.closePath();
        
        graphics.fillPath();
        graphics.strokePath();
        //TODO: research this for preformance boost 
       // graphics.generateTexture('starGraphics');
     
      
    }
    

    phaserRect(points){
        var color = 0xffff00;
        var alpha = 0.5 + ((i / 10) * 0.5);
    
        graphics.fillStyle(color, alpha);
        graphics.fillRect(32 * i, 32 * i, 256, 256);
    }
}