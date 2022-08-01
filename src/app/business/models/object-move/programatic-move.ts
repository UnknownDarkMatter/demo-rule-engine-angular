import { MoveDirection } from './move-direction';

export class ProgramaticMove {
    public repeat:number;
    public direction:MoveDirection;
    public waitMilliSeconds:number;

    constructor(repeat:number, direction:MoveDirection, waitMilliSeconds:number){
        this.repeat = repeat;
        this.direction = direction;
        this.waitMilliSeconds = waitMilliSeconds;
    }
}