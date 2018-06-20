import { SpaceRockTube } from './sections/SpaceRockTube'

//chunck of gameplay that has variable difficulty options 
//is deleted when safely offscreen 
//can be chained on top (or possibly below) another SectionContainer 
export class SectionContainer {
    /**
     * 
     * @param {scene, type, x, y, difficulty} config 
     */
    constructor(config) {

        this.activeSectionsArray = [];
        this.scene = config.scene;
        this.addSectionContainer(config);

    }

    //first section generated calls this
    addSectionContainer(config){
        switch(config.type){
            case SECTION_TYPES[1]: 
                this.activeSectionsArray.push(new SpaceRockTube(
                    config
                ));
                return this.activeSections;
                break;
        }
    }

    //all sections generated here except the fist
    addAnotherSectionContainerAbove(){
        //TODO use top/bottom of section container rather than middle
        this.addSectionContainer({
            scene: this.scene, 
            type: SECTION_TYPES[1],
            x: this.leftXOfNewestSectionContainer(), 
            y: this.getTopOfNewestSectionContainer(),
            width: this.getWidthOfNewestSectionContainer(), //
            difficulty: 4   //tie this to gameplay progression 
        });
    }

    getTopOfNewestSectionContainer(){
        return  this.activeSectionsArray[this.activeSectionsArray.length - 1].topY;
    }

    getHeightOfNewestSectionContainer(){
        return  this.activeSectionsArray[this.activeSectionsArray.length - 1].height;
    }

    getWidthOfNewestSectionContainer(){
        return  this.activeSectionsArray[this.activeSectionsArray.length - 1].width;
    }

    leftXOfNewestSectionContainer(){
        return  this.activeSectionsArray[this.activeSectionsArray.length - 1].x;
    }

    //need to figure out the best time to call this 
    deleteOldestSection(){
        this.activeSectionsArray[0].bodies.forEach((aBody)=>{
            aBody.destroy();     
        })
        this.activeSectionsArray.splice(0,1);
    }

    updateActiveSection(){
        this.activeSectionsArray.forEach((aSection)=>{
            aSection.bodies.forEach((aBody)=>{
                aBody.update();
            })
        })
    }

}

export const SECTION_TYPES = {
    1: "SpaceRockTube" 
};