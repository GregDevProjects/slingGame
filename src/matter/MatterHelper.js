export class Matter{
    constructor(config){
        this.mainCollisionGroup = config.scene.matter.world.nextCategory();
        this.nonCollisionGroup = config.scene.matter.world.nextCategory();
    }

    getMainCollisionGroup(){
        return this.mainCollisionGroup;
    }

    getNonCollisionGroup(){
        return this.nonCollisionGroup;
    }
}

export function destroyObject(matterObj, isExploding) {

    if(!isExploding) {
        matterObj.destroy();
        return;
    }  

    if(matterObj.anims == undefined) {
        matterObj.destroy();
        console.warn('called destroyObject() on object that can\'t paly animations', matterObj);
        return;
    }

    if (matterObj.anims.isPlaying) {
        console.warn('tried to destroy an object that\'s already exploading', matterObj);
        return;
    }

    if (!matterObj.active) {
        matterObj.destroy();
        return;
    }

    //matterObj.setSensor(true);
    matterObj.body.destroy()
   

    matterObj.setScale(getExplostionSize(matterObj));
       
    matterObj.anims.play('kaboom', true);
    matterObj.on('animationcomplete', () => {matterObj.setScale(1); matterObj.destroy(); }, matterObj);
}

function getExplostionSize(matterObj) {
    const kaboomAnimationHeight = 65;

    if ('Missle' == matterObj.body.key) {
        return matterObj.height / kaboomAnimationHeight;
    }

    if ('SundayDriver' == matterObj.body.key) {
        return 3;
    }

    return matterObj.height / kaboomAnimationHeight;
}