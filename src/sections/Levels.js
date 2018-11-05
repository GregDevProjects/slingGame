import { FloatingSpaceRocks } from './obstacles/FloatingSpaceRocks'
import { GridTraffic } from './obstacles/GridTraffic'
import { Tube } from './tracks/Tube'
import { Diamond } from './tracks/Diamond'
import { getRandomInt } from '../Helper'
import { Spinners } from './obstacles/Spinners'
import { SharpTurn } from './tracks/SharpTurn'
import { LocalStorageHandler } from '../LocalStorageHandler'
import { Missle } from '../sections/obstacles/Missle';
import { Pursuer } from './obstacles/pursuer/Pursuer'
import { SundayDriverClump } from './obstacles/SundayDriverClump'

export class Levels {
    static getAllLevels() {
        //levels must be added to this array in ascending order 
        return [Level1, Level2, Level3, Level4, Level5, Level6, Level7, Level8, Level9, Level10];
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

    static isCampaignComplete() {
        for (let i = 0; i < this.getAllLevels().length; i++) {
            if (!this.isLevelUnlocked(i+1)) {
                return false;
            }
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
            name: 'Sunday Drivers',
            level: 1,
            description: 'Sunday drivers are pushy, rude, and tend to explode at random. \
            Press the up key (pc) or both turn directions at once (mobile) to take them out with a boost once your energy is full. \
            Get a bronze time or higher to unlock the next level.',
            objective: 'Reach the finish line',
            medalTimes: {
                'gold' : 40.00,
                'silver' : 45.00,
                'bronze' : 60.00
            }
        }
    }

    static getObstaclesAndTracks(sectionsCompleted) {
        const lastTrack = 12;    
        return {track: Tube,obstacle: [ SundayDriverClump ], difficulty: 1, isLastTrack: sectionsCompleted >= lastTrack ? true : false };
    }
}

class Level2 {
    static getDecription() {
        return { 
            name: 'Tube',
            level: 2,
            description: 'Use your thruster to push off from wall to wall and maintain speed.\
             Boosting is a good way to maintain momentum if you stray too far from a wall, but keep in mind your boost and shield energy are the same.',
            objective: 'Reach the finish line',
            medalTimes: {
                'gold' : 1,
                'silver' : 2,
                'bronze' : 3
            }
        }
    }

    // 'gold' : 19.00,
    // 'silver' : 23.00,
    // 'bronze' : 35.00

    static getObstaclesAndTracks(sectionsCompleted) {
        const lastTrack = 6;
        return {track: Tube, obstacle: [], difficulty: null, isLastTrack: sectionsCompleted >= lastTrack ? true : false };
    }
}


class Level3 {
    static getDecription() {
        return { 
            name: 'Winding Road',
            level: 3,
            description: 'Push off the walls, watch for sharp turns. Boosting is a great way to get around tight turns, but be sure to \
            position yourself close to a wall when the boost expires',
            objective: 'Reach the finish line',
            medalTimes: {
                'gold' : 38.00,
                'silver' : 40.00,
                'bronze' : 51.00
            }
        }
    }

    static getObstaclesAndTracks(sectionsCompleted) {
        const lastTrack = 6;
        return {track: SharpTurn, obstacle: [], difficulty: null, isLastTrack: sectionsCompleted >= lastTrack ? true : false };
    }
}


class Level4 {
    static getDecription() {
        return { 
            name: 'Asteroid Tube',
            level: 4,
            description: 'These floating space turds are blocking your path to the finish. I think you know what to do.',
            objective: 'Reach the finish line',
            medalTimes: {
                'gold' : 29.00,
                'silver' : 35.00,
                'bronze' : 45.00
            }
        }
    }

    static getObstaclesAndTracks(sectionsCompleted) {
        const lastTrack = 9;
        const obstacle = sectionsCompleted == 3 ? SundayDriverClump : FloatingSpaceRocks;
        const difficulty = sectionsCompleted == 8 ? 3 : 1;
        return {track: Tube, obstacle: [obstacle], difficulty: difficulty, isLastTrack: sectionsCompleted >= lastTrack ? true : false };
    }
}

class Level5 {
    static getDecription() {
        return { 
            name: 'Riding Spinners',
            level: 5,
            description: 'Those satellites are stronger than they look.',
            objective: 'Reach the finish line',
            medalTimes: {
                'gold' : 65.00,
                'silver' : 60.00,
                'bronze' : 70.00
            }
        }
    }

    static getObstaclesAndTracks(sectionsCompleted) {
        const isDiamond = getRandomInt(0,1);

        const obstacle = getRandomInt(0,1) ? [SundayDriverClump] : [FloatingSpaceRocks];
        let track;
        if(isDiamond) {
            track = Diamond;
            obstacle.push(Spinners);
        } else {
            track = Tube;
        }

        const lastTrack = 15;
        return {track: track, obstacle: obstacle, difficulty: isDiamond ? 4 : 1, isLastTrack: sectionsCompleted >= lastTrack ? true : false };
    }

}

class Level6 {
    static getDecription() {
        return { 
            name: 'Highway',
            level: 6,
            description: 'You will need to use the cargo ships to build momentum. Cargo ships can be destroyed by boosting.',
            objective: 'Reach the finish line',
            medalTimes: {
                'gold' : 50.00,
                'silver' : 55.00,
                'bronze' : 70.00
            }
        }
    }

    static getObstaclesAndTracks(sectionsCompleted) {
        const lastTrack = 12;
        return {track: Diamond, obstacle: [GridTraffic], difficulty: 5, isLastTrack: sectionsCompleted >= lastTrack ? true : false };
    }
}

class Level7 {
    static getDecription() {
        return { 
            name: 'Missile Run',
            level: 7,
            description: 'Missiles are great on a straightway but terrible at turning. Boosting will not save you.',
            objective: 'Reach the finish line',
            medalTimes: {
                'gold' : 33.00,
                'silver' : 38.00,
                'bronze' : 48.00
            }
        }
    }

    static getObstaclesAndTracks(sectionsCompleted) {
        const lastTrack = 9;
        const spawnMissile = sectionsCompleted % 3 == 0 ? Missle : false; 
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

class Level8 {
    static getDecription() {
        return { 
            name: 'Gridlock',
            level: 8,
            description: 'Avoid the spinning satellite of death. Boost wisely and often. Stay focused.',
            objective: 'Reach the finish line',
            medalTimes: {
                'gold' : 58.00,
                'silver' : 65.00,
                'bronze' : 79.00
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
            return {track:Diamond, obstacles: sectionsCompleted % 2 == 0 ? [GridTraffic, Spinners] : [GridTraffic]};
        }

        if (sectionsCompleted == 6){
            return {track:Tube, obstacles: [SundayDriverClump]};
        }

        if (sectionsCompleted <= 7){
            return {track:Diamond, obstacles: [GridTraffic]};
        }

        if (sectionsCompleted <= 10){
            return {track:Diamond, obstacles: sectionsCompleted % 2 == 0 ?[GridTraffic, Spinners] : [GridTraffic]};
        }

        return {track:Diamond, obstacles: [GridTraffic]};
    }
}

class Level9 {
    static getDecription() {
        return { 
            name: 'Unoccupied',
            level: 9,
            description: 'Outrun the missiles without anything to hide behind.',
            objective: 'Reach the finish line',
            medalTimes: {
                'gold' : 55.00,
                'silver' : 67.00,
                'bronze' : 80.00
            }
        }
    }    

    static getObstaclesAndTracks(sectionsCompleted) {
        const lastTrack = 12;
        const spawnMissile = (sectionsCompleted %2 == 0) ? Missle : false; 
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

class Level10 {
    static getDecription() {
        return { 
            name: 'Hot Pursuit',
            level: 10,
            description: 'The Pursuer will not stop until you are destroyed, good luck! Managing your power to balance defence and offence is the key to survival.  Get a bronze or higher to unlock Endless Mode.',
            objective: 'Reach the finish line',
            medalTimes: {
                'gold' : 65.00,
                'silver' : 75.00,
                'bronze' : 99.00
            }
        }
    }

    static getObstaclesAndTracks(sectionsCompleted) {
        const lastTrack = sectionsCompleted >= 20 ? true : false;
        const spawnPursuer = sectionsCompleted == 2 ||sectionsCompleted == 3  ? Pursuer : false;
        

        return {
            track: this.getObstacles(sectionsCompleted).track, 
            globalObstacles: spawnPursuer,
            obstacle: this.getObstacles(sectionsCompleted).obstacle, 
            difficulty: this.getObstacles(sectionsCompleted).diff, 
            isLastTrack: lastTrack 
        };
    }

    static getObstacles(sectionsCompleted) {
        if (sectionsCompleted % 6 == 0 ) {
            return { track: Diamond, obstacle: [GridTraffic], diff: 5 }
        }

        if (sectionsCompleted % 5 == 0 ) {
            return { track: Tube, obstacle: [SundayDriverClump], diff: 5 }
        }

        return { track: Tube, obstacle: [FloatingSpaceRocks], diff: getRandomInt(0,1) ? 1 : 2 }
    }
}