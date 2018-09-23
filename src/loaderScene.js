import { getGameWidth } from './Helper'

export class LoaderScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: 'Loader'
    });

  }
  preload() {

    var progress = this.add.graphics();
    var loadingText = this.add.text(this.add.text(10, 10, 'LOADING...', { font: "40px Helvetica", fill: "#ffffff", fontWeight : 'bolder' }));
    loadingText.x=getGameWidth() - loadingText.width;
    this.load.on('progress', function (value) {

        progress.clear();
        progress.fillStyle(0xffffff, 1);
        progress.fillRect(0, 270, 800 * value, 60);

    });

    this.load.on('complete', function () {
        progress.destroy();
        loadingText.destroy();
    });

    this.load.image('title', 'assets/img/title.png');
    this.load.image('campaign', 'assets/img/camp.png');
    this.load.image('endless', 'assets/img/endless.png');
    this.load.image('options', 'assets/img/option.png');
    this.load.image('credits', 'assets/img/credits.png');
    this.load.image('arrowLeft', 'assets/img/arrow_left.png');
    this.load.image('arrowRight', 'assets/img/arrow_right.png')
    this.load.image('player', 'assets/img/player.png');
    this.load.image('bg', 'assets/img/bg.png');
    this.load.image('gridBg', 'assets/img/Grid.png');
    this.load.image('space_rock', 'assets/img/asteroid.png');
    this.load.image('red', 'assets/img/red.png');
    this.load.image('end', 'assets/img/endOfLine.png');
    this.load.image('blackhole', 'assets/img/p5.png');
    this.load.image('cargo_1', 'assets/img/ship_1.png');
    this.load.image('cargo_2', 'assets/img/ship_2.png');
    this.load.image('cargo_3', 'assets/img/ship_3.png');
    this.load.image('cargo_4', 'assets/img/ship_4.png');
    this.load.image('cargo_5', 'assets/img/ship_5.png');
    this.load.image('cargo_6', 'assets/img/ship_6.png');
    this.load.image('cargo_7', 'assets/img/ship_7.png');
    this.load.image('cargo_8', 'assets/img/ship_8.png');
    this.load.image('thrustFlame', 'assets/img/thrustFlame.png');
    this.load.spritesheet('explosion', 'assets/img/explosion.png', { 'frameWidth': 96, 'frameHeight': 96 });
    this.load.image('spinner', 'assets/img/spinner.png');
    this.load.image('planet_1', 'assets/img/planet_19.png');
    this.load.image('planet_2', 'assets/img/planet_20.png');
    this.load.image('planet_3', 'assets/img/planet_29.png');
    this.load.image('planet_4', 'assets/img/planet_24.png');
    this.load.image('planet_5', 'assets/img/planet_22.png');
    this.load.image('missle', 'assets/img/spr_missile.png');
    this.load.image('target', 'assets/img/target.png');
    this.load.image('arrow_up', 'assets/img/arrow_up.png' )
    this.load.image('arrow_down', 'assets/img/arrow_down.png' )
    this.load.image('go', 'assets/img/go.png')
    this.load.image('nah', 'assets/img/nah.png')
    this.load.image('finish', 'assets/img/finish.png')
    this.load.image('level_complete', 'assets/img/level_complete.png'); 
    this.load.image('replay', 'assets/img/50_61ff33.png');
    this.load.image('medal_bronze', 'assets/img/bronze.png');
    this.load.image('medal_silver', 'assets/img/silver.png');
    this.load.image('medal_gold', 'assets/img/gold.png');

  }

  create() {

    this.anims.create({
        key: 'kaboom',
        frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 11 }),
        frameRate: 20,
        repeat: 0,
        hideOnComplete: true
    });

    this.scene.start('MainMenu');
  }

}