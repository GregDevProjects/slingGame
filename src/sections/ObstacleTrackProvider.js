import { FloatingSpaceRocks } from './obstacles/FloatingSpaceRocks'
import { GridTraffic } from './obstacles/GridTraffic'
import { Tube } from './tracks/Tube'
import { Diamond } from './tracks/Diamond'
import { getRandomInt } from '../Helper'
import { Spinners } from './obstacles/Spinners'
import { SharpTurn } from './tracks/SharpTurn'
import { Missle } from './obstacles/Missle'

import { Levels } from './Levels'

const allObstacles = [ FloatingSpaceRocks, GridTraffic ];
const allTracks = [ Diamond, Tube, SharpTurn ];

//must return {track: track, obstacle: obstacle, difficulty: difficulty, lastTrack: lastTrack};
//lastTrack must be a multiple of 3 
export class ObstacleTrackProvider{
    static get(level, difficulty) {
        if (level === 0) {
            return this.getEndless(difficulty);
        } else {
            return Levels.getLevel(level).getObstaclesAndTracks(difficulty);
        }
    }

    static getEndless(sectionDifficulty) {
        const track = allTracks[getRandomInt(0, allTracks.length - 1)];

        let obstacle = allObstacles[getRandomInt(0, allObstacles.length - 1)];

        const difficulty = this.getEndlessDifficultyWithCap(
            track.prototype.constructor.name,
            obstacle.prototype.constructor.name, 
            sectionDifficulty
        );

        if (track.prototype.constructor.name == 'Diamond' && sectionDifficulty != 1) { 
            obstacle = [Spinners, obstacle] ;
        }

        const spawnMissile = sectionDifficulty % 6 == 0 ? Missle : false;

        return {track: track, obstacle: obstacle, difficulty: difficulty, globalObstacles: spawnMissile};
    }

    static getEndlessDifficultyWithCap(trackName, obstacleName, difficulty) {
        if (trackName == 'Tube') {
            if (obstacleName == 'FloatingSpaceRocks') {
                if (difficulty >= 3) {
                    return 3;
                }
                return difficulty;

            } else if (obstacleName == 'GridTraffic') {
                return this.getGridTrafficDifficulty(difficulty);
            }
        }

        if (trackName == 'Diamond') {
            if (obstacleName == 'FloatingSpaceRocks') {
                if (difficulty >= 10) {
                    return 10;
                }
                return difficulty;
            } else if (obstacleName == 'GridTraffic') {
                return this.getGridTrafficDifficulty(difficulty);
            }
        }

    }

    static getGridTrafficDifficulty( difficulty) {
        //traffic has same difficulty cap regardless of track 
        if (difficulty >= 7){
            return 7;
        }
        return difficulty;
    }
}