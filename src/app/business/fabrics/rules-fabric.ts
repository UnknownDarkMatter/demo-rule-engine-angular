import { RuleMoveObject } from"../rules/rule-move-object";
import { RuleNoMoveOnFilledBlocks } from"../rules/rule-no-move-on-filled-blocks";
import { RuleMoveInsideBorders } from"../rules/move-inside-borders";
import { RuleMoveRobot } from"../rules/rule-move-robot";
import { BlueBulletsAreEaten } from"../rules/blue-bullets-are-eaten";
import { GameOverIfTouchRobot } from '../rules/game-over-if-touch-robot';
import { AppEngine } from"../app-engine";
import { Constants } from"../constants";
import { PackmanService } from "../packman/packman-service";

export class RulesFabric {

    public static TryCreateProcessorRuleMovingObject(jsonObject:any, parentJsonObject:any, appEngine:AppEngine):boolean{
        if(jsonObject.name !== Constants.Rules.MoveObject.Name) { return false;}
        if(Constants.enableLogs) console.log(`RulesFabric: creating new rule RuleMoveObject.`);
        const processor = new RuleMoveObject(jsonObject, appEngine); 
        jsonObject[Constants.JsonObject.Processor.Name] = processor;
        jsonObject[Constants.JsonObject.Parent.Name] = parentJsonObject;
        return true;      
    }

    public static TryCreateProcessorRuleNoMoveOnFilledBlocks(jsonObject:any, parentJsonObject:any, appEngine:AppEngine):boolean{
        if(jsonObject.name !== Constants.Rules.NoMoveOnFilledBlocks.Name) { return false;}
        if(Constants.enableLogs) console.log(`RulesFabric: creating new rule RuleNoMoveOnFilledBlocks.`);
        const processor = new RuleNoMoveOnFilledBlocks(jsonObject, appEngine); 
        jsonObject[Constants.JsonObject.Processor.Name] = processor;
        jsonObject[Constants.JsonObject.Parent.Name] = parentJsonObject;
        return true;      
    }

    public static TryCreateProcessorRuleMoveInsideBorders(jsonObject:any, parentJsonObject:any, appEngine:AppEngine):boolean{
        if(jsonObject.name !== Constants.Rules.MoveInsideBorders.Name) { return false;}
        if(Constants.enableLogs) console.log(`RulesFabric: creating new rule RuleMoveInsideBorders.`);
        const processor = new RuleMoveInsideBorders(jsonObject, appEngine); 
        jsonObject[Constants.JsonObject.Processor.Name] = processor;
        jsonObject[Constants.JsonObject.Parent.Name] = parentJsonObject;
        return true;      
    }

    public static TryCreateProcessorRuleMoveRobot(jsonObject:any, parentJsonObject:any, appEngine:AppEngine):boolean{
        if(jsonObject.name !== Constants.Rules.MoveRobot.Name) { return false;}
        if(Constants.enableLogs) console.log(`RulesFabric: creating new rule RuleMoveRobot.`);
        const processor = new RuleMoveRobot(jsonObject, appEngine); 
        jsonObject[Constants.JsonObject.Processor.Name] = processor;
        jsonObject[Constants.JsonObject.Parent.Name] = parentJsonObject;
        return true;      
    }

    public static TryCreateProcessorRuleBlueBulletsAreEaten(jsonObject:any, parentJsonObject:any, appEngine:AppEngine,
        packmanService:PackmanService):boolean{
        if(jsonObject.name !== Constants.Rules.BlueBulletsAreEaten.Name) { return false;}
        if(Constants.enableLogs) console.log(`RulesFabric: creating new rule BlueBulletsAreEaten.`);
        const processor = new BlueBulletsAreEaten(jsonObject, appEngine, packmanService); 
        jsonObject[Constants.JsonObject.Processor.Name] = processor;
        jsonObject[Constants.JsonObject.Parent.Name] = parentJsonObject;
        return true;      
    }

    public static TryCreateProcessorRuleGameOverIfTouchRobot(jsonObject:any, parentJsonObject:any, appEngine:AppEngine,
        packmanService:PackmanService):boolean{
        if(jsonObject.name !== Constants.Rules.GameOverIfTouchRobot.Name) { return false;}
        if(Constants.enableLogs) console.log(`RulesFabric: creating new rule GameOverIfTouchRobot.`);
        const processor = new GameOverIfTouchRobot(jsonObject, appEngine, packmanService); 
        jsonObject[Constants.JsonObject.Processor.Name] = processor;
        jsonObject[Constants.JsonObject.Parent.Name] = parentJsonObject;
        return true;      
    }
}

