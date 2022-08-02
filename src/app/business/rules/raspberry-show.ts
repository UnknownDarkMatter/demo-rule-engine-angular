import { AppEngine } from"../app-engine";
import { RuleGeneric } from"./rule-generic";
import { NotificationResponse } from"../models/notification-response";
import { Constants } from"../constants";
import { ModelModificationsCollection } from"../models/model-notifications-collection";
import { JsonObjectUtils } from "../../services/json-object-utils";
import { RulesExtensions } from '../packman/rules-extensions';
import { PackmanService } from "../packman/packman-service";
import { ModelModification } from "../models/model-modification";
import { ObjectPosition } from "../models/object-move/object-position";


export class RaspBerryShow implements RuleGeneric {
    public jsonObject:any;
    public appEngine:AppEngine;
    public packmanService:PackmanService;
    public ruleFriendlyName:string = "RaspBerryShow";

    constructor(jsonObject:any, appEngine:AppEngine, packmanService:PackmanService){
        this.appEngine = appEngine;
        this.jsonObject = jsonObject;
        this.packmanService = packmanService;
    }
    
    public calculateModelModificationsOnNotificationResponses(
        notificationResponses:NotificationResponse[], modelModifications:ModelModificationsCollection)
    {
        if(Constants.enableLogs) console.log(`RaspBerryShow: calculating the model modifications ...`);
        const behaviorObject = JsonObjectUtils.getObject('behavior', this.appEngine.jsonObjectRoot);
        const mapObject = JsonObjectUtils.getObject('map', this.appEngine.jsonObjectRoot);

        const movingObjectPosition = RulesExtensions.getMovingObjectPosition(behaviorObject, modelModifications, true);
        if(movingObjectPosition){
            const raspberryAtMovingObjectPosition = RulesExtensions.searchRaspberryObject(mapObject, movingObjectPosition);
            this.tryShowRaspberryAtMovingObjectPosition(raspberryAtMovingObjectPosition, movingObjectPosition);
        }

        const robotObjectPosition = RulesExtensions.getRobotObjectPosition(behaviorObject, modelModifications, true);
        if(robotObjectPosition) {
            const raspberryAtMovingRobotPosition = RulesExtensions.searchRaspberryObject(mapObject, robotObjectPosition);
            this.tryShowRaspberryAtRobotObjectPosition(raspberryAtMovingRobotPosition, robotObjectPosition);
        }
    }

    public isDynamicConditionSatisfied():boolean{
        return true;
    }

    private tryShowRaspberryAtMovingObjectPosition(raspberryAtMovingObjectPosition:any, movingObjectPosition:ObjectPosition){
        if(!raspberryAtMovingObjectPosition) {return;}
        let isVisible = raspberryAtMovingObjectPosition[Constants.Rules.RaspBerryShow.BlockVisiblePropertyName];
        if(isVisible){return;}
        const raspberryEaten = raspberryAtMovingObjectPosition[Constants.Rules.RaspBerryShow.RaspBerryEaten];
        if(raspberryEaten){return;}
       
        raspberryAtMovingObjectPosition[Constants.Rules.RaspBerryShow.BlockVisiblePropertyName] = true;
        if(Constants.enableLogs) console.log(`... RaspBerryShow: moving object make a raspberry been shown.`);
        this.appEngine.guiManager.addObject(
            movingObjectPosition, 
            Constants.Gui.Objects.RaspBerry.Name);
    }

    private tryShowRaspberryAtRobotObjectPosition(raspberryAtMovingRobotPosition:any, robotObjectPosition:ObjectPosition){
        if(!raspberryAtMovingRobotPosition) {return;}
        let isVisible = raspberryAtMovingRobotPosition[Constants.Rules.RaspBerryShow.BlockVisiblePropertyName];
        if(isVisible){return;}
        const raspberryEaten = raspberryAtMovingRobotPosition[Constants.Rules.RaspBerryShow.RaspBerryEaten];
        if(raspberryEaten){return;}
       
        raspberryAtMovingRobotPosition[Constants.Rules.RaspBerryShow.BlockVisiblePropertyName] = true;
        if(Constants.enableLogs) console.log(`... RaspBerryShow: robot object make a raspberry been shown.`);
        this.appEngine.guiManager.addObject(
            robotObjectPosition, 
            Constants.Gui.Objects.RaspBerry.Name);
    }

}
