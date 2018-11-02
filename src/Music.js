import { getRandomInt } from './Helper'

const TOTAL_GAME_SONGS = 4;

export class MuisicPlayer {
    constructor(config) {
        this.scene = config.scene;
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

    playCreditsMusic() {
        this.currentSong = this.scene.sound.add('credits_song');
        this.currentSong.play();
        this.currentSong.on('ended', function(){
            this.playCreditsMusic();
        }.bind(this));
        return this;
    }

    destroyAudio() {
        if (this.currentSong && this.currentSong.isPlaying)
            this.currentSong.destroy();
    }

}