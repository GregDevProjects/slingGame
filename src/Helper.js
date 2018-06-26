export function getGameWidth(){
    return window.innerWidth;
}

export function getCenterOfScreen(){
    return window.innerWidth/2;
}

export function getGameHeight(){
    return window.innerHeight;
}

export function getTopOfMatterObject(matterObj){
    return matterObj.y - matterObj.height/2;
}

export function getMiddleOfMatterObject(matterObj){
    return matterObj.y - matterObj.height;
}

export function degreesToRadians(degrees){
    return degrees * Math.PI / 180;
}

export function getFarRightOfMatterObject(matterObj){
    return matterObj.x + matterObj.width/2; 
}

export function getFarLeftOfMatterObject(matterObj){
    return matterObj.x - matterObj.width/2;
}

export function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}