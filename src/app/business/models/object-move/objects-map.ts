import { MapObject } from"./map-object";
import { ObjectPosition } from"./object-position";

export class ObjectsMap {
    public objects:MapObject[];

    constructor(objects:MapObject[]){
        this.objects = objects;
    }
}