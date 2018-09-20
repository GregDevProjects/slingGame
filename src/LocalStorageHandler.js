const totalLevels = 6;
const levelKey = 'SpaceSlingLevelProgress';
const isMusicEnabledKey = 'SpaceSlingMusic';
const isArrowEnabledKey = 'SpaceSlingArrow';

export class LocalStorageHandler {
    //set a default value in the localstorage if there isn't an entry for the key
    static initializeStorage(key, value) {
        if(!localStorage.getItem(key)) {
            this.saveItem(key, value);  
        }
    }

    static getGameProgress(){
        this.initializeStorage(levelKey, 1);
        return this.getItem(levelKey, 1);
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
}
