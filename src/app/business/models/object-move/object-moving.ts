import { ObjectPosition } from"./object-position";

export class ObjectMoving {
    public from:ObjectPosition;
    public to:ObjectPosition;

    constructor(from:ObjectPosition, to:ObjectPosition){
        this.from = from;
        this.to = to;
    }
}