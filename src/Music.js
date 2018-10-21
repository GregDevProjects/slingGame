import { getRandomInt } from './Helper'

const TOTAL_GAME_SONGS = 3;

export class MuisicPlayer {
    constructor(config) {
        this.scene = config.scene;
        this.playedSongs = [2];
    }

    //keep playing random songs 
    playRandomGameSongs() {
        this.currentSong = this.scene.sound.add('game_song_' + this.getNextRandomSongNumber());
        this.currentSong.play();
        this.currentSong.on('ended', function(){
            this.playRandomGameSongs();
        }.bind(this));
        return this;
    }

    getNextRandomSongNumber() {
        return getRandomInt(1,TOTAL_GAME_SONGS);
        if (this.playedSongs.length >= TOTAL_GAME_SONGS) {
            this.playedSongs = [];
        }
        const nextSong = new Phaser.Math.RandomDataGenerator(this.playedSongs).integerInRange(1,TOTAL_GAME_SONGS);
        this.playedSongs.push(nextSong);
        return nextSong;
    }

    destroyAudio() {
        this.currentSong.destroy();
    }

}