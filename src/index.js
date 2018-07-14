import 'phaser';
import { GameplayScene } from './GameplayScene'
import { UIScene } from './UIScene'

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
        GameplayScene,
        UIScene
    ]

};

let game = new Phaser.Game(config);


