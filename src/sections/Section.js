//hokey way to make sure required section methods are implemented 
//https://stackoverflow.com/questions/29480569/does-ecmascript-6-have-a-convention-for-abstract-classes
import { isUndefined } from '../Helper' 

export class Section{
    constructor(){
        if (
            isUndefined(this.getX) ||
            isUndefined(this.getY) ||
            isUndefined(this.getWidth) ||
            isUndefined(this.update) ||
            isUndefined(this.delete) ||
            isUndefined(this.getTopY)
        ) {
            throw new TypeError("Section did not override a required method");
        }
    }
}