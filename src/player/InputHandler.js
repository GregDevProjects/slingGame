import { getCenterOfScreen } from '../Helper'

//this is pretty much tied to the player 
export class InputHandler {
    constructor(scene, target) {
        this.scene = scene;
        this.player = target;
        this.cursors = this.scene.input.keyboard.createCursorKeys();
    }

    update() {
        this.assignKeyboardControlToPlayerAction();
        this.assignPointerToPlayerAction();
    }

    assignKeyboardControlToPlayerAction() {
        if (this.cursors.left.isDown) {
            this.player.turnLeft();
        } else if (this.cursors.right.isDown) {
            this.player.turnRight();
        } else {
            this.player.setAngularVelocity(0);
            this.player.isTurningLeft = false;
            this.player.isTurningRight = false;
        }

        if (this.cursors.up.isDown) {
            this.player.bothInputsPressed();
        }
    }

    oneInputPressed(pointer) {
        if (pointer.x > getCenterOfScreen()) {
            this.player.turnRight();

        } else {
            this.player.turnLeft();
        }
    }

    assignPointerToPlayerAction() {
        if (this.scene.input.pointer1.isDown && this.scene.input.pointer2.isDown) {
            this.player.bothInputsPressed();
            return;
        }

        if (this.scene.input.pointer1.isDown) {
            this.oneInputPressed(this.scene.input.pointer1);
        }

        if (this.scene.input.pointer2.isDown) {
            this.oneInputPressed(this.scene.input.pointer2);
        }

    }

}