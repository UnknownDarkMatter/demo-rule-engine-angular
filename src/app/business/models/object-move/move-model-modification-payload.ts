import { ObjectPosition } from"./object-position";

export class MoveModelModificationPayload {
    public newPosition:ObjectPosition;

    constructor(newPosition:ObjectPosition){
        this.newPosition = newPosition;
    }
}