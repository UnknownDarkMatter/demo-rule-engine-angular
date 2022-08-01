import { MoveDirection } from "../business/models/object-move/move-direction";

export class Convert {

    public static toNumber(valueAsString:string):number{
        let value = 0;
        value =+ valueAsString;
        return value;
    }

    public static stringToDirection(valueAsString:string):MoveDirection{
        switch(valueAsString.toLowerCase().trim()){
            case "up":{
                return MoveDirection.Up;
            }
            case "down":{
                return MoveDirection.Down;
            }
            case "right":{
                return MoveDirection.Right;
            }
            case "left":{
                return MoveDirection.Left;
            }
            default:{
                console.log(`Error : unknown direction '${valueAsString}' in Convert.stringToDirection`);
                break;
            }
        }
    }
}

