import { AppEngine } from"../app-engine";
import { RuleGeneric } from"./rule-generic";
import { NotificationResponse } from"../models/notification-response";
import { Constants } from"../constants";
import { ModelModificationsCollection } from"../models/model-notifications-collection";
import { JsonObjectUtils } from "../../services/json-object-utils";
import { RulesExtensions } from '../packman/rules-extensions';
import { PackmanService } from "../packman/packman-service";


export class GameOverIfTouchRobot implements RuleGeneric {
    public jsonObject:any;
    public appEngine:AppEngine;
    public packmanService:PackmanService;
    public ruleFriendlyName:string = "GameOverIfTouchRobot";

    constructor(jsonObject:any, appEngine:AppEngine, packmanService:PackmanService){
        this.appEngine = appEngine;
        this.jsonObject = jsonObject;
        this.packmanService = packmanService;
    }
    
    public calculateModelModificationsOnNotificationResponses(
        notificationResponses:NotificationResponse[], modelModifications:ModelModificationsCollection)
    {
        if(Constants.enableLogs) console.log(`GameOverIfTouchRobot: calculating the model modifications ...`);
        const behaviorObject = JsonObjectUtils.getObject('behavior', this.appEngine.jsonObjectRoot);
        const movingObjectPosition = RulesExtensions.getMovingObjectPosition(behaviorObject, modelModifications, true);
        const robotPosition = RulesExtensions.getRobotObjectPosition(behaviorObject, modelModifications, true);

        if(movingObjectPosition != null && robotPosition != null && movingObjectPosition.toString() === robotPosition.toString()){
            if(Constants.enableLogs) console.log(`... GameOverIfTouchRobot: Game is over. movingObjectPosition:'${movingObjectPosition.toString()}', robotPosition:'${robotPosition.toString()}'.`);
            this.appEngine.stopGame();
            this.appEngine.guiManager.showGameOver();
        } else {
            if(Constants.enableLogs) console.log(`... GameOverIfTouchRobot: Game is not over. movingObjectPosition:'${movingObjectPosition != null ? movingObjectPosition.toString() : 'null'}', robotPosition:'${robotPosition != null ? robotPosition.toString() : 'null'}'.`);
        }

        // this.appEngine.guiManager.removeObject(
        //     movingObjectPosition, 
        //     Constants.Gui.Objects.BlueBullet.Name);
    }

    public isDynamicConditionSatisfied():boolean{
        return true;
    }
}
