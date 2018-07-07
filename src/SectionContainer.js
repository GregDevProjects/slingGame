import { SpaceRockTube } from './sections/SpaceRockTube'
import { Traffic } from './sections/Traffic'
import { getRandomInt } from './Helper'
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

        this.allSections = [SpaceRockTube, Traffic];     

        this.addSectionContainer(config);

    }

    //first section generated calls this
    addSectionContainer(config){
        // this.activeSectionsArray.push(new this.allSections[1](
        //     config
        // ));

       // always add random sections 
        this.activeSectionsArray.push(new this.allSections[getRandomInt(0,1)](
            config
        ));
    }

    //all sections generated here except the fist
    addAnotherSectionContainerAbove(){
        //TODO use top/bottom of section container rather than middle
        this.addSectionContainer({
            scene: this.scene, 
            x: this.leftXOfNewestSectionContainer(), 
            y: this.getTopOfNewestSectionContainer(),
            width: this.getWidthOfNewestSectionContainer(), //
            difficulty: 4   //tie this to gameplay progression 
        });
    }

    getTopOfNewestSectionContainer(){
        return  this.activeSectionsArray[this.activeSectionsArray.length - 1].getTopY();
    }

    getTopOfSectionContainerThePlayerIsIn(){
        return  this.activeSectionsArray[this.activeSectionsArray.length - 2].getTopY();
    }

    getHeightOfNewestSectionContainer(){
        return  this.activeSectionsArray[this.activeSectionsArray.length - 1].getHeight();
    }

    getWidthOfNewestSectionContainer(){
        return  this.activeSectionsArray[this.activeSectionsArray.length - 1].getWidth();
    }

    leftXOfNewestSectionContainer(){
        return  this.activeSectionsArray[this.activeSectionsArray.length - 1].getX();
    }

    getOldestSection(){
        return this.activeSectionsArray[0];
    }

    deleteOldestSection(){
        this.activeSectionsArray[0].delete();
        this.activeSectionsArray.splice(0,1);
    }

    updateSections(){
        this.activeSectionsArray.forEach((aSection)=>{
            aSection.update();
        })
    }

    deleteAllSections(){
        this.activeSectionsArray.forEach((aSection)=> {
            aSection.delete();
        })

        this.activeSectionsArray = [];
    }

    

}