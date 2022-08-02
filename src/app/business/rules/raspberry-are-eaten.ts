import { AppEngine } from"../app-engine";
import { RuleGeneric } from"./rule-generic";
import { NotificationResponse } from"../models/notification-response";
import { Constants } from"../constants";
import { ModelModificationsCollection } from"../models/model-notifications-collection";
import { JsonObjectUtils } from "../../services/json-object-utils";
import { RulesExtensions } from '../packman/rules-extensions';
import { PackmanService } from "../packman/packman-service";
import { ModelModification } from "../models/model-modification";


export class RaspBerryAreEaten implements RuleGeneric {
    public jsonObject:any;
    public appEngine:AppEngine;
    public packmanService:PackmanService;
    public ruleFriendlyName:string = "RaspBerryAreEaten";
    private pointsEatRaspberry = 100;

    constructor(jsonObject:any, appEngine:AppEngine, packmanService:PackmanService){
        this.appEngine = appEngine;
        this.jsonObject = jsonObject;
        this.packmanService = packmanService;
    }
    
    public calculateModelModificationsOnNotificationResponses(
        notificationResponses:NotificationResponse[], modelModifications:ModelModificationsCollection)
    {
        if(Constants.enableLogs) console.log(`RaspBerryAreEaten: calculating the model modifications ...`);
        const behaviorObject = JsonObjectUtils.getObject('behavior', this.appEngine.jsonObjectRoot);
        const mapObject = JsonObjectUtils.getObject('map', this.appEngine.jsonObjectRoot);

        let modelModification: ModelModification | null = null;
        for(let notificationResponse of notificationResponses){
            if(notificationResponse.notification.notificationKey === Constants.Notifications.MovingObjectMove.NotificationKey){

                this.movingObjectEatRaspBerry(behaviorObject, mapObject, modelModifications);
            }
        } 

    }

    public isDynamicConditionSatisfied():boolean{
        return true;
    }

    private movingObjectEatRaspBerry(behaviorObject:any, mapObject:any, modelModifications:ModelModificationsCollection){
        
        const movingObjectPosition = RulesExtensions.getMovingObjectPosition(behaviorObject, modelModifications, true);
        if(!movingObjectPosition) {return;}
        const raspberryObject = RulesExtensions.searchRaspberryObject(mapObject, movingObjectPosition);
        if(!raspberryObject) {return;}

        const isVisible = raspberryObject[Constants.Rules.RaspBerryShow.BlockVisiblePropertyName];
        if(!isVisible){return;}

        raspberryObject[Constants.Rules.RaspBerryShow.BlockVisiblePropertyName] = false;
        raspberryObject[Constants.Rules.RaspBerryShow.RaspBerryEaten] = true;

        if(Constants.enableLogs) console.log(`... RaspBerryAreEaten: moving object eats a raspberry.`);
        this.appEngine.guiManager.removeObject(
            movingObjectPosition, 
            Constants.Gui.Objects.RaspBerry.Name);
        this.packmanService.increaseMovingObjectPoints(this.pointsEatRaspberry);

    }
}
