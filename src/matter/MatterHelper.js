export class Matter{
    constructor(config){
        this.mainCollisionGroup = config.scene.matter.world.nextCategory();
        this.nonCollisionGroup = config.scene.matter.world.nextCategory();
    }

    getMainCollisionGroup(){
        return this.mainCollisionGroup;
    }

    getNonCollisionGroup(){
        return  this.nonCollisionGroup;
    }
}