import { FloatingSpaceRocks } from './obstacles/FloatingSpaceRocks'
import { GridTraffic } from './obstacles/GridTraffic'
import { Tube } from './tracks/Tube'
import { Diamond } from './tracks/Diamond'
import { getRandomInt } from '../Helper'
import { Spinners } from './obstacles/Spinners'
import { SharpTurn } from './tracks/SharpTurn'
import { LocalStorageHandler } from '../LocalStorageHandler'
import { Missle } from '../sections/obstacles/Missle';

export class Levels {
    static getAllLevels() {
        //levels must be added to this array in ascending order 
        return [Level1, Level2, Level3, Level4, Level5, Level6, Level7, Level8];
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
                'gold' : 47.00,
                'silver' : 49.00,
                'bronze' : 51.00
            }
        }
    }

    static getObstaclesAndTracks(sectionsCompleted) {
        const lastTrack = 6;
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

class Level6 {
    static getDecription() {
        return { 
            name: 'Missile Run',
            level: 6,
            description: 'Missiles are great on a straightway but terrible at turning. Boosting will not save you.',
            objective: 'Reach the finish line',
            medalTimes: {
                'gold' : 30.00,
                'silver' : 35.00,
                'bronze' : 40.00
            }
        }
    }

    static getObstaclesAndTracks(sectionsCompleted) {
        const lastTrack = 6;
        const spawnMissile = sectionsCompleted == 2 ? Missle : false; 
        return {track: this.getTrack(sectionsCompleted), globalObstacles: spawnMissile ,obstacle: this.getObstacles(), difficulty: 1, isLastTrack: sectionsCompleted >= lastTrack ? true : false };
    }

    static getObstacles() {
        if (getRandomInt(0,2)) {   
            return []; 
        }
        return [FloatingSpaceRocks];
    }

    static getTrack(sectionsCompleted) {
        if (sectionsCompleted <=2){
            return Tube;
        }

        if (getRandomInt(0,2)) {
            return Tube;
        }
        return SharpTurn;
    }
}

class Level7 {
    static getDecription() {
        return { 
            name: 'Gridlock',
            level: 7,
            description: 'Avoid the spinning satellite of death. Boost wisely and often. Stay focused.',
            objective: 'Reach the finish line',
            medalTimes: {
                'gold' : 52.00,
                'silver' : 57.00,
                'bronze' : 64.00
            }
        }
    }

    static getObstaclesAndTracks(sectionsCompleted) {
        const lastTrack = 12;
        const spawnMissile = sectionsCompleted == 6 ? Missle : false; 
        return {
            globalObstacles: spawnMissile, 
            track: this.getTrackAndObstacles(sectionsCompleted).track, 
            obstacle: this.getTrackAndObstacles(sectionsCompleted).obstacles, 
            difficulty: 5, 
            isLastTrack: sectionsCompleted >= lastTrack ? true : false 
        };
    }   

    static getTrackAndObstacles(sectionsCompleted) {
        if(sectionsCompleted <= 1) {
            return {track:SharpTurn, obstacles:[]};
        }

        if (sectionsCompleted <= 5){
            return {track:Diamond, obstacles: [GridTraffic, Spinners]};
        }

        if (sectionsCompleted == 6){
            return {track:Tube, obstacles: []};
        }

        if (sectionsCompleted <= 7){
            return {track:Diamond, obstacles: [GridTraffic]};
        }

        if (sectionsCompleted <= 10){
            return {track:Diamond, obstacles: [GridTraffic, Spinners]};
        }

        return {track:Diamond, obstacles: [GridTraffic]};
    }
}

class Level8 {
    static getDecription() {
        return { 
            name: 'Unoccupied',
            level: 8,
            description: 'Outrun the missiles without anything to hide behind.',
            objective: 'Reach the finish line',
            medalTimes: {
                'gold' : 47.00,
                'silver' : 53.00,
                'bronze' : 60.00
            }
        }
    }    

    static getObstaclesAndTracks(sectionsCompleted) {
        const lastTrack = 12;
        const spawnMissile = (sectionsCompleted == 2 || sectionsCompleted == 6) ? Missle : false; 
        return {
            globalObstacles: spawnMissile, 
            track: this.getTrackAndObstacles(sectionsCompleted).track, 
            obstacle: this.getTrackAndObstacles(sectionsCompleted).obstacles, 
            difficulty: 0, 
            isLastTrack: sectionsCompleted >= lastTrack ? true : false 
        };

        
    }   

    static getTrackAndObstacles(sectionsCompleted) {
        if(sectionsCompleted <= 2) {
            return {track:Tube, obstacles:[]};
        }

        if (sectionsCompleted <= 5){
            return {
                track:getRandomInt(0,1) ? Tube : SharpTurn, 
                obstacles: []
            };
        }

        if (sectionsCompleted == 6){
            return {track:Tube, obstacles: []};
        }

        if (sectionsCompleted <= 7){
            return {track:Diamond, obstacles: []};
        }

        if (sectionsCompleted <= 10){
            return {
                track:getRandomInt(0,1) ? Tube : SharpTurn, 
                obstacles: []
            };
        }

        return {track:Diamond, obstacles: [Spinners]};
    }
}