import 'phaser';
import { GameplayScene } from './GameplayScene'
let config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        
        default: 'matter',
        matter: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [
        GameplayScene
    ]

};

let game = new Phaser.Game(config);


