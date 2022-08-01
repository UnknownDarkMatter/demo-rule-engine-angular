import { Injectable } from"@angular/core";

@Injectable()
export class PackmanService {
    public movingObjectPoints:number = 0;
    public robotPoints:number = 0;

    public increaseMovingObjectPoints(){
        this.movingObjectPoints++;
    }

    public increaseRobotPoints(){
        this.robotPoints++;
    }

}


