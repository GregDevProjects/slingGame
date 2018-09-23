import { Section } from './sections/Section'
//chunck of gameplay that has variable difficulty options 
//is deleted when safely offscreen 
//can be chained on top another SectionContainer 
export class SectionContainer {
    /**
     * 
     * @param {scene, type, x, y, difficulty, level} config 
     */
    constructor(config) {

        this.activeSectionsArray = [];
        this.scene = config.scene;
        this.isSectionObstaclesSensors = false;

        this.addSection(config);
        this.difficulty = config.difficulty;
        this.level = config.level;
        this.isSpawnedWhite = false;
        this.isLastSection = false;
    }

    //first section generated calls this
    addSection(config) {

        if (this.activeSectionsArray.length === 0) {
            this.activeSectionsArray.push(new Section(
                config
            ))
            return;
        }
     
        if( this.activeSectionsArray[this.activeSectionsArray.length -1].getIsLastSection()){
            this.isLastSection = true;
            //TODO: 
            // -need to signal to the GameplayScene that there's no need to keep adding sections and add a finish line 
            // -pass the level from the menu scene
            console.log('no mo')
        } else {
            this.activeSectionsArray.push(new Section(
                config
            ))
            return;
        }

        
    }

    //all sections generated here except the fist
    addAnotherSectionAbove() {
        //TODO use top/bottom of section container rather than middle
        this.addSection({
            scene: this.scene,
            x: this.leftXOfNewestSectionContainer(),
            y: this.getTopOfNewestSectionContainer(),
            width: this.getWidthOfNewestSectionContainer(), //
            difficulty: this.difficulty,   //tie this to gameplay progression 
            isObstaclesSensors: this.isSectionObstaclesSensors,
            isSpawnedWhite: this.isSpawnedWhite,
            level: this.level
        });
    }

    getTopOfNewestSectionContainer() {
        return this.activeSectionsArray[this.activeSectionsArray.length - 1].getTopY();
    }

    getTopOfSectionContainerThePlayerIsIn() {
        return this.activeSectionsArray[this.activeSectionsArray.length - 2].getTopY();
    }

    getHeightOfNewestSectionContainer() {
        return this.activeSectionsArray[this.activeSectionsArray.length - 1].getHeight();
    }

    getWidthOfNewestSectionContainer() {
        return this.activeSectionsArray[this.activeSectionsArray.length - 1].getWidth();
    }

    leftXOfNewestSectionContainer() {
        return this.activeSectionsArray[this.activeSectionsArray.length - 1].getX();
    }

    getOldestSection() {
        return this.activeSectionsArray[0];
    }

    deleteOldestSection() {
        this.activeSectionsArray[0].delete();
        this.activeSectionsArray.splice(0, 1);
    }

    updateSections() {
        this.activeSectionsArray.forEach((aSection) => {
            aSection.update();
        })
    }

    deleteAllSections() {
        this.activeSectionsArray.forEach((aSection) => {
            aSection.delete();
        })

        this.activeSectionsArray = [];
    }

    setAllSectionObstaclesSensors(isSensor){

        this.isSectionObstaclesSensors = isSensor;

        this.activeSectionsArray.forEach((aSection) => {
            aSection.setObstaclesSensors(isSensor);
        });
    }

    setAllSectionObstaclesTintWhite(isWhite){

        this.activeSectionsArray.forEach((aSection) => {
            if (isWhite){
                this.isSpawnedWhite = true;
                aSection.setObstaclesTintWhite();
            } else {
                this.isSpawnedWhite = false;
                aSection.setObstaclesTintOff();
            }
        });
    }

    //TODO: find better way to keep player from slight collisions 
    setAllSectionObstaclesSensors(isSensor){
        this.isSectionObstaclesSensors = isSensor;

        this.activeSectionsArray.forEach((aSection) => {
            aSection.setObstaclesSensors(isSensor);
        });
    }

    getIsLastSection() {
        return this.isLastSection;
    }
}