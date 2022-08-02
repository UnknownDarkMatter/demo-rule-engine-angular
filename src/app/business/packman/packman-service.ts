import { Injectable } from"@angular/core";

@Injectable()
export class PackmanService {
    public movingObjectPoints:number = 0;
    public robotPoints:number = 0;

    public increaseMovingObjectPoints(points:number){
        this.movingObjectPoints += points;
    }

    public increaseRobotPoints(points:number){
        this.robotPoints += points
    }

}


