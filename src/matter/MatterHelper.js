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

export function destroyObject(matterObj, isExploding) {
  //  debugger;
    if (matterObj.anims.isPlaying) {
        return;
    }

    if (!matterObj.active || !isExploding) {
        matterObj.destroy();
        return;
    }

    matterObj.setSensor(true);
    let kaboomAnimationHeight = 65;
    matterObj.setScale(matterObj.height / kaboomAnimationHeight);
    matterObj.anims.play('kaboom', true);
    
    matterObj.on('animationcomplete', () => {matterObj.setScale(1); matterObj.destroy(); }, matterObj);
}