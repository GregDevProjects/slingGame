export function getGameWidth() {
    return window.innerWidth;
}

export function getAngleBetweenObjects(obj1, obj2) {
    return Phaser.Math.Angle.Between(obj1.x, obj1.y, obj2.x, obj2.y);
}

export function getDistanceBetweenObjects(obj1, obj2) {
    return Phaser.Math.Distance.Between(obj1.x, obj1.y, obj2.x, obj2.y);
}

export function getCenterOfScreen() {
    return window.innerWidth / 2;
}

export function getGameHeight() {
    return window.innerHeight;
}

export function getTopOfMatterObject(matterObj) {
    return matterObj.y - matterObj.height / 2;
}

export function getMiddleOfMatterObject(matterObj) {
    return matterObj.y - matterObj.height;
}

export function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

export function getFarRightOfMatterObject(matterObj) {
    return matterObj.x + matterObj.width / 2;
}

export function getFarLeftOfMatterObject(matterObj) {
    return matterObj.x - matterObj.width / 2;
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function isUndefined(value) {
    return value === undefined;
}

//move an object towards a vector 
//there's probably a built in way to do this but I couldn't find it 
export function moveObjectToPoint(objectToMove, whereToMove, speed) {
    let xDistance = objectToMove.x - whereToMove.x;
    let yDistance = objectToMove.y - whereToMove.y;

    if (Math.abs(xDistance) > 5) {
        if (objectToMove.x > whereToMove.x) {
            objectToMove.x -= speed;
        } else {
            objectToMove.x += speed;
        }
    } else {
        objectToMove.setVelocityX(0);
    }

    if (Math.abs(yDistance) > 5) {
        if (objectToMove.y < whereToMove.y) {
            objectToMove.y += speed;
        } else {
            objectToMove.y -= speed;
        }
    } else {
        objectToMove.setVelocityY(0);
    }
}

export function placeTextInCenter(text) {
    text.setX(getGameWidth()/2 - text.width/2);
    return text;
}

export function addGlowingTween(target) {
    target.scene.tweens.add(
        { 
            duration: 1000, 
            alpha: 0, 
            targets: target,
            loop: -1,
            yoyo: true
        }
    )
}