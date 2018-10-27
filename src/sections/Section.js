import { ObstacleTrackProvider } from './ObstacleTrackProvider'

//a chunk of gameplay that holds obstacles and tracks, is 
//chained on top of other sections and deleted when it is out of the playspace  
//gets objects and tracks from the ObstacleTrackProvider
export class Section {
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
        const globalObstacle = objects.globalObstacles;

        this.isLastSection = objects.isLastTrack;
        this.createGlobalObstacles(globalObstacle);
        this.createTrack(track);
        this.createObstacles(obstacle, difficulty, config);

        

        if (config.isObstaclesSensors) {
            this.setObstaclesSensors(true);
        }
    }

    createGlobalObstacles(globalObstacle) {
        if(!globalObstacle){
            return;
        }  
        //this is insanely bad
        this.scene.activeSections.addGlobalObstacle({
            x: this.x + 150,
            y: this.y,
            globalObstacle 
        });
    }

    createTrack(track) {
        this.walls = track.makeAndGetBodies({
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            wallWidth: this.wallWidth,
            scene: this.scene
        });
    }

    //WASH ME
    createObstacles(obstacle, difficulty, config) {
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
    }

    getIsLastSection() {
        return this.isLastSection;
    }

    getTopLeft(){
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