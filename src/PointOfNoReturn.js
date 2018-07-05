import { VectorWall } from './VectorWall'
//if the player backtracks too much they run into this 
export class PointOfNoReturn {
    constructor(config){
        this.scene = config.scene;
        this.width = config.width;
        this.x = config.x;
        this.y = config.y; 
        this.bodies = [];
        this.makeLShapeWall();
        this.makeEndOfLineImg();

    }

    makeEndOfLineImg(){
        this.bodies.push(this.scene.add.image(this.x + this.width/2, this.y + 1000, 'end'));
    }

    makeLShapeWall(){
        let wallWidth = 200;
        let height = 1500;
        let Lstart = height - 500;
        let distance = this.width - wallWidth*2;
        let Lwidth = 1000;

        let leftWall = [
            {x:this.x, y:this.y},
            {x:this.x, y:this.y + height},
            {x:this.x+wallWidth, y: this.y+height},
            {x:this.x+wallWidth, y: this.y}
        ]

        let rightWall = [
            {x:this.x+wallWidth + distance, y:this.y},
            {x:this.x+wallWidth + distance + wallWidth, y:this.y},
            {x:this.x+wallWidth + distance + wallWidth, y:this.y + Lstart},
            {x:this.x+wallWidth + distance, y: this.y + Lstart}
        ]

        let bottomWall = [
            {x:this.x, y:this.y + height},
            {x:this.x, y: this.y+ height+wallWidth},
            {x:this.x + Lwidth, y: this.y + height + wallWidth},
            {x:this.x + Lwidth, y: this.y + height}
        ]

        this.bodies.push(
            new VectorWall({scene: this.scene, vertices: leftWall}),
            new VectorWall({scene: this.scene, vertices: rightWall}),
            new VectorWall({scene: this.scene, vertices: bottomWall})
        )

        this.pointOfNoReturn = this.y + Lstart;
        this.makeBlackHole(this.x + Lwidth, this.y + height);
    }

    makeBlackHole(x,y){
        this.blackHoleImg = this.scene.add.image(x + 200,y,'blackhole');
        this.blackHoleImg.y -= this.blackHoleImg.height/2 - 120;  

        this.scene.tweens.add(
            {angle: 360,repeat: -1,duration: 2000, targets:this.blackHoleImg}
          )
        this.bodies.push(this.blackHoleImg);
    }

    getPointOfNoReturn(){
        return this.pointOfNoReturn;
    }

    delete(){
        this.bodies.forEach(aBody => {
            aBody.destroy();
        });
    }

}