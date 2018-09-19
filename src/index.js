import 'phaser';
import { GameplayScene } from './GameplayScene'
import { UIScene } from './UIScene'
import { MainMenu } from './mainMenuScene'
import { LoaderScene } from './loaderScene'

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
        GameplayScene,
        UIScene
    ]

};

let game = new Phaser.Game(config);


