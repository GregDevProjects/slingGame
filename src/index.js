import 'phaser';
import { GameplayScene } from './GameplayScene'
import { UIScene } from './UIScene'
import { MainMenu } from './menu/mainMenuScene'
import { LoaderScene } from './loaderScene'
import { LevelSelect } from './menu/levelSelectScene'
import { LevelPreview } from './menu/levelPreviewScene'
import { Options } from './menu/optionsScene'
import { Credits } from './menu/creditsScene'
import { Endless } from './menu/endlessScene'
import { MusicScene } from './MusicScene'

let config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        
        default: 'matter',
        matter: {
            debug: false,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [
        LoaderScene,
        MainMenu,
        MusicScene,
        LevelSelect,
        LevelPreview,
        Options,
        GameplayScene,
        UIScene,
        Credits,
        Endless
    ]

};

let game = new Phaser.Game(config);


