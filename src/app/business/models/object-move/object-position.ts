export class ObjectPosition {
    public x:number;
    public y:number;

    constructor(x:number, y:number){
        this.x = x;
        this.y = y;
    }

    public toString():string{
        return `${this.x},${this.y}`;
    }

    public isInsideLimits(minX:number, minY:number, maxX:number, maxY:number):boolean{
        return this.x>=minX && this.x<=maxX && this.y>=minY && this.y<=maxY;
    }
}