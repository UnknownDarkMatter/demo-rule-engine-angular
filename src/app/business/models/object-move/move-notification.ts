import { MoveDirection } from"./move-direction";
import { ObjectPosition } from"./object-position";

export class MoveNotification {
    public position:ObjectPosition;
    public direction:MoveDirection;

    constructor(position:ObjectPosition, direction:MoveDirection){
        this.position = position;
        this.direction = direction;
    }
}