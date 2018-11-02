const totalLevels = 2;
const isMusicEnabledKey = 'SpaceSlingMusic';
const isArrowEnabledKey = 'SpaceSlingArrow';
const levelTimeKey = "SpaceSlingLevelTime";

export class LocalStorageHandler {

    //only save if it's better than the current best time 
    //note: seconds and distance are used interchangeably for Level 0
    static saveLevelCompletionTime(level, seconds) {
        if (!this.isLevelStatSaved(level, seconds)) {
            return;
        }

        this.saveItem(
            this.getLevelKey(level), 
            seconds
        );    
    }

    static isLevelStatSaved(level, stat) {
        const previousTime = this.getLevelCompleteTime(level);
        if (previousTime == 0) {
            return true;
        }

        if (level == 0) {
            return previousTime <= stat;
        }

        return previousTime >= stat;
    }

    static getLevelCompleteTime(level) {
        this.initializeStorage(this.getLevelKey(level), 0);  
        return parseFloat(this.getItem(
            this.getLevelKey(level), 
            0
        ));
    }

    //set a default value in the localstorage if there isn't an entry for the key
    static initializeStorage(key, value) {
        if(!localStorage.getItem(key)) {
            this.saveItem(key, value);  
        }
    }

    static getIsMusicEnabled(){
        this.initializeStorage(isMusicEnabledKey, true);
        return this.parseBooleanString(
            this.getItem(isMusicEnabledKey, true)
        );       
    }

    static setIsMusicEnabled(isEnabled) {
        this.saveItem(isMusicEnabledKey, isEnabled);
    }

    static getIsTurnArrowEnabled() {
        this.initializeStorage(isArrowEnabledKey, true);
        return this.parseBooleanString(
            this.getItem(isArrowEnabledKey, true)
        ); 
    }

    static setIsTurnArrowEnabled(isEnabled) {
        this.saveItem(isArrowEnabledKey, isEnabled)
    }

    static getItem(key, fallBackValue) {
        try{
            return localStorage.getItem(key);
        } catch(e) {
            console.warn('cant get', key);
            return fallBackValue;
        }          
    }

    static saveItem(key, value){    
        try{
            localStorage.setItem(key, value)
        } catch(e) {
            console.warn('cant save ' + key, e);
        }
    }

    static isEndlessUnlocked() {
        if (this.getGameProgress() == totalLevels) {
            return true;
        }
        return false;
    }

    //pretty hackey :(
    static parseBooleanString(value) {
        if (value === 'false'){
            return false;
        }
        return true;
    }

    static getLevelKey(level) {
        return levelTimeKey + '_' +level;
    }
}
