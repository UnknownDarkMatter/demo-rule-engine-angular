import { ObjectPosition } from"./object-position";

export class MapObject {
    public position:ObjectPosition;
    public objectType:string;

    constructor(position:ObjectPosition, objectType:string){
        this.position = position;
        this.objectType = objectType;
    }
}