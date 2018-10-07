import { FloatingSpaceRocks } from './obstacles/FloatingSpaceRocks'
import { GridTraffic } from './obstacles/GridTraffic'
import { Tube } from './tracks/Tube'
import { Diamond } from './tracks/Diamond'
import { getRandomInt } from '../Helper'
import { Spinners } from './obstacles/Spinners'
import { SharpTurn } from './tracks/SharpTurn'
import { LocalStorageHandler } from '../LocalStorageHandler'
import { SpaceRock } from '../SpaceRock';

export class Levels {
    static getAllLevels() {
        //levels must be added to this array in ascending order 
        return [Level1, Level2, Level3, Level4, Level5];
    }

    static getLevel(level) {
        return this.getAllLevels()[level - 1];
    }

    static isLevelUnlocked(level) {
        if (level == 1) {
            return true;
        }

        if (Levels.getMedalForTime(
            level - 1, 
            LocalStorageHandler.getLevelCompleteTime(level - 1)
        ) === null) {
            return false;
        }

        return true;
    }

    //returns the key of the medal image
    static getMedalForTime(level, time) {
        const medalTimes = this.getLevel(level).getDecription().medalTimes;

        if (time == 0) {
            return null;
        }

        if (time <= medalTimes.gold ) {
            return 'medal_gold';
        }

        if (time <= medalTimes.silver) {
            return 'medal_silver';
        }      

        if (time <= medalTimes.bronze) {
            return 'medal_bronze';
        }

        return null;
    }
}

class Level1 {
    static getDecription() {
        return { 
            name: 'Tube',
            level: 1,
            description: 'Use your thruster to push off walls and maintain speed.',
            objective: 'Reach the finish line',
            medalTimes: {
                'gold' : 23.00,
                'silver' : 25.00,
                'bronze' : 27.00
            }
        }
    }

    static getObstaclesAndTracks(sectionsCompleted) {
        const lastTrack = 6;
        return {track: Tube, obstacle: [], difficulty: null, isLastTrack: sectionsCompleted >= lastTrack ? true : false };
    }
}


class Level2 {
    static getDecription() {
        return { 
            name: 'Winding Road',
            level: 2,
            description: 'Push off the walls, watch for sharp turns.',
            objective: 'Reach the finish line',
            medalTimes: {
                'gold' : 38.00,
                'silver' : 40.00,
                'bronze' : 43.00
            }
        }
    }

    static getObstaclesAndTracks(sectionsCompleted) {
        const lastTrack = 6;
        return {track: SharpTurn, obstacle: [], difficulty: null, isLastTrack: sectionsCompleted >= lastTrack ? true : false };
    }
}


class Level3 {
    static getDecription() {
        return { 
            name: 'Asteroid Tube',
            level: 3,
            description: 'Dodge or destroy the asteroids by boosting. Press both turn directions to boost.',
            objective: 'Reach the finish line',
            medalTimes: {
                'gold' : 27.00,
                'silver' : 29.00,
                'bronze' : 31.00
            }
        }
    }

    static getObstaclesAndTracks(sectionsCompleted) {
        const lastTrack = 3;
        return {track: Tube, obstacle: [FloatingSpaceRocks], difficulty: 1, isLastTrack: sectionsCompleted >= lastTrack ? true : false };
    }
}

class Level4 {
    static getDecription() {
        return { 
            name: 'Marathon',
            level: 4,
            description: 'Keep going, don\'t give up. You are invulnerable to wall collisions while boosting.',
            objective: 'Reach the finish line',
            medalTimes: {
                'gold' : 70.00,
                'silver' : 80.00,
                'bronze' : 90.00
            }
        }
    }

    static getObstaclesAndTracks(sectionsCompleted) {
        const lastTrack = 18;
        return {track: this.getTracks(), obstacle: this.getObstacles(), difficulty: 1, isLastTrack: sectionsCompleted >= lastTrack ? true : false };
    }

    static getObstacles() {
        if (getRandomInt(0,2)) {
            return [];
        }
        return [FloatingSpaceRocks];
    } 

    static getTracks(){
        if(getRandomInt(0,1)) {
            return Tube;
        }
        return SharpTurn;
    }

}

class Level5 {
    static getDecription() {
        return { 
            name: 'Highway',
            level: 5,
            description: 'You will need to use the cargo ships to build momentum. Cargo ships can be destroyed by boosting.',
            objective: 'Reach the finish line',
            medalTimes: {
                'gold' : 45.00,
                'silver' : 47.00,
                'bronze' : 55.00
            }
        }
    }

    static getObstaclesAndTracks(sectionsCompleted) {
        const lastTrack = 12;
        return {track: Diamond, obstacle: [GridTraffic], difficulty: 5, isLastTrack: sectionsCompleted >= lastTrack ? true : false };
    }
}