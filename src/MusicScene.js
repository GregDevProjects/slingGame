import { MusicPlayer } from './Music'

export class MusicScene extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'Music', active: true });
        
    }

    init(data) {
        this.props = data.passedProps;
    }

    preload() {

    }

    create () {
        this.musicPlayer = new MusicPlayer(this);
        this.addMobilePauseResumeEvents();
    }

    update() {

    }

    playGameplayMusic(){
        this.musicPlayer.playRandomGameSongs();
    }

    playCreditsMusic(){
        this.musicPlayer.playCreditsMusic();
    }

    stopMusic() {
        this.musicPlayer.destroyAudio();
    }

    pause(){
        this.musicPlayer.pause();
    }

    resume(){
        this.musicPlayer.resume();
    }

    addMobilePauseResumeEvents(){
        this.pause = this.pause.bind(this);
        this.resume = this.resume.bind(this);
        document.addEventListener("pause",  this.pause, true);
        document.addEventListener("resume", this.resume, true);
    }

    removeMobilePauseResumeEvents(){
        document.removeEventListener("pause", this.pause, true);
        document.removeEventListener("resume", this.resume, true);  
    }

}