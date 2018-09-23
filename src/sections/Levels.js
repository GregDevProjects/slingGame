import { FloatingSpaceRocks } from './obstacles/FloatingSpaceRocks'
import { GridTraffic } from './obstacles/GridTraffic'
import { Tube } from './tracks/Tube'
import { Diamond } from './tracks/Diamond'
import { getRandomInt } from '../Helper'
import { Spinners } from './obstacles/Spinners'
import { SharpTurn } from './tracks/SharpTurn'
import { LocalStorageHandler } from '../LocalStorageHandler'

export class Levels {
    static getAllLevels() {
        //levels must be added to this array in ascending order 
        return [Level1, Level2];
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
            name: 'Highway',
            level: 1,
            description: 'Use your thruster to push off walls and maintain speed',
            objective: 'Reach the finish line',
            medalTimes: {
                'gold' : 25.00,
                'silver' : 29.00,
                'bronze' : 31.00
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
            name: 'Asteroid Tube',
            level: 2,
            description: 'Dodge or destroy the asteroids by boosting',
            objective: 'Reach the finish line',
            medalTimes: {
                'gold' : 10.00,
                'silver' : 20.00,
                'bronze' : 30.00
            }
        }
    }

    static getObstaclesAndTracks(difficulty) {
        const lastTrack = 3;
        return {track: Tube, obstacle: [FloatingSpaceRocks], difficulty: 2, isLastTrack: difficulty >= lastTrack ? true : false };
    }
}


const dummyLevels = [
    { 
        name: 'Highway',
        level: 1,
        description: 'Use your thruster to push off walls and maintain speed',
        objective: 'Reach the finish line '
    },
    {
        name: 'Asteroid Tube',
        level: 2
    },
    { 
        name: 'Windy Roads',
        level: 3
    },
    {
        name: 'Rush Hour',
        level: 4
    },
    { 
        name: 'Missile Run',
        level: 5
    },
    {
        name: 'Duel',
        level: 6
    }
]