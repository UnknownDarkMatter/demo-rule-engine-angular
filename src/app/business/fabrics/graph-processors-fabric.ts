import { ProcessorMovingObject } from"../graph-processors/processor-moving-object";
import { ProcessorRobotObject } from"../graph-processors/processor-robot-object";

import { AppEngine } from"../app-engine";
import { Constants } from"../constants";


export class GraphProcessorFabric {

    public static TryCreateProcessorBehaviorMovingObject(jsonObject:any, parentJsonObject:any, appEngine:AppEngine):boolean{
        if(jsonObject.name !== Constants.Processors.MovingObject.Name) { return false;}
        const processor = new ProcessorMovingObject(jsonObject, appEngine); 
        jsonObject[Constants.JsonObject.Processor.Name] = processor;
        jsonObject[Constants.JsonObject.Parent.Name] = parentJsonObject;
        return true;      
    }

    public static TryCreateProcessorBehaviorRobotObject(jsonObject:any, parentJsonObject:any, appEngine:AppEngine):boolean{
        if(jsonObject.name !== Constants.Processors.RobotObject.Name) { return false;}
        const processor = new ProcessorRobotObject(jsonObject, appEngine); 
        jsonObject[Constants.JsonObject.Processor.Name] = processor;
        jsonObject[Constants.JsonObject.Parent.Name] = parentJsonObject;
        return true;      
    }


   
}

