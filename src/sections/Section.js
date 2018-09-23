import { ObstacleTrackProvider } from './ObstacleTrackProvider'

export class Section{
    constructor(config){
        this.wallWidth = 200;
        this.height= 2000; 

        this.topY= config.y - this.height;
        this.x = config.x;
        this.y = config.y;
        this.width = config.width;
        this.scene = config.scene;
        this.tintWhiteOnSpawn = false;

        const objects = ObstacleTrackProvider.get(config.level, config.difficulty);

        const track = objects.track;
        const obstacle = objects.obstacle;
        const difficulty = objects.difficulty;
        this.isLastSection = objects.isLastTrack;
        this.walls = track.makeAndGetBodies({
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            wallWidth: this.wallWidth,
            scene: config.scene
        });

        if (typeof obstacle === 'object') {
            //checking to see if there are multiple objects
            this.obstacles = [];
            obstacle.forEach(function(anObstacle){
                this.obstacles = [...this.obstacles, ...anObstacle.makeAndGetBodies({
                    scene: this.scene,
                    x: this.x + this.wallWidth, 
                    y: this.y, 
                    width: this.width - this.wallWidth,
                    height: this.height,
                    difficulty: anObstacle.prototype.constructor.name == 'Spinners' ? 1 : difficulty, //hack to ensure there aren't multiple spinners
                    wallWidth: this.wallWidth,
                    isSpawnedWhite: config.isSpawnedWhite
                })];   

            }.bind(this))

        } else if (typeof obstacle === 'function') {
            this.obstacles = obstacle.makeAndGetBodies({
                scene: this.scene,
                x: this.x + this.wallWidth, 
                y: this.y, 
                width: this.width - this.wallWidth,
                height: this.height,
                difficulty: difficulty,
                wallWidth: this.wallWidth,
                isSpawnedWhite: config.isSpawnedWhite
            });              
        }

      

        if (config.isObstaclesSensors) {
            this.setObstaclesSensors(true);
        }
    }

    getIsLastSection() {
        return this.isLastSection;
    }

    getTopLeft(){
        //console.log();
       // return {x:0, y:0}
        return this.walls.topLeft;
    }


    setObstaclesTintWhite() {
        this.obstacles.forEach((aBody)=>{
            if(aBody.active){
                //console.log(aBody.)
                aBody.tintWhite();
            }
                
        });
    }

    setObstaclesTintOff() {
        this.obstacles.forEach((aBody)=>{
            if(aBody.active)
                aBody.clearTint();
        });
    }

    setObstaclesSensors(isSensor){
        this.obstacles.forEach((aBody)=>{
            if(aBody.active)
                aBody.setSensor(isSensor);
        });
    }

    getX(){
        return this.getTopLeft().x;
    }

    getY(){
        return getTopLeft().y;
    }

    getWidth(){
        return this.width;
    }

    getTopY(){
        return this.walls.topLeft.y;
    }

    update(){

        this.obstacles.forEach((aBody)=>{
            if(aBody.active)
                aBody.update();
        });

        if (this.testMissle)
        this.testMissle.update();
    }

    delete(){
      //  debugger;

        this.obstacles.forEach((aBody)=>{
            // if(aBody.anims.isPlaying) {
            //     //the body is ex
            //     continue;
            // }
            aBody.delete(false);
        });

        this.walls.walls.forEach((aBody)=>{
            aBody.destroy();
        })
    }
}