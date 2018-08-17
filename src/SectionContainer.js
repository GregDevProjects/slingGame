import { Section } from './sections/Section'
//chunck of gameplay that has variable difficulty options 
//is deleted when safely offscreen 
//can be chained on top another SectionContainer 
export class SectionContainer {
    /**
     * 
     * @param {scene, type, x, y, difficulty} config 
     */
    constructor(config) {

        this.activeSectionsArray = [];
        this.scene = config.scene;
        this.isSectionObstaclesSensors = false;

        this.addSectionContainer(config);
        this.difficulty = config.difficulty;
        this.isSpawnedWhite = false;
    }

    //first section generated calls this
    addSectionContainer(config) {
        this.activeSectionsArray.push(new Section(
            config
        ));
    }

    //all sections generated here except the fist
    addAnotherSectionContainerAbove() {
        //TODO use top/bottom of section container rather than middle
        this.addSectionContainer({
            scene: this.scene,
            x: this.leftXOfNewestSectionContainer(),
            y: this.getTopOfNewestSectionContainer(),
            width: this.getWidthOfNewestSectionContainer(), //
            difficulty: this.difficulty,   //tie this to gameplay progression 
            isObstaclesSensors: this.isSectionObstaclesSensors,
            isSpawnedWhite: this.isSpawnedWhite
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
}