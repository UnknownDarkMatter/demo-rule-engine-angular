import { AppEngine } from"../app-engine";
import { RuleGeneric } from"./rule-generic";
import { NotificationResponse } from"../models/notification-response";
import { Constants } from"../constants";
import { ModelModificationsCollection } from"../models/model-notifications-collection";
import { JsonObjectUtils } from "../../services/json-object-utils";
import { RulesExtensions } from '../packman/rules-extensions';
import { PackmanService } from "../packman/packman-service";
import { LogicalConditionInterface } from "../models/logical-condition-interface";


export class BlueBulletsAreEaten implements RuleGeneric {
    public jsonObject:any;
    public appEngine:AppEngine;
    public packmanService:PackmanService;
    public ruleFriendlyName:string = "BlueBulletsAreEaten";
    public dynamicCondition:LogicalConditionInterface|null;

    constructor(jsonObject:any, appEngine:AppEngine, packmanService:PackmanService,
        dynamicCondition:LogicalConditionInterface|null){
        this.appEngine = appEngine;
        this.jsonObject = jsonObject;
        this.packmanService = packmanService;
        this.dynamicCondition = dynamicCondition;
    }
    
    public calculateModelModificationsOnNotificationResponses(
        notificationResponses:NotificationResponse[], modelModifications:ModelModificationsCollection)
    {
        if(Constants.enableLogs) console.log(`BlueBulletsAreEaten: calculating the model modifications ...`);
        const behaviorObject = JsonObjectUtils.getObject('behavior', this.appEngine.jsonObjectRoot);
        const mapObject = JsonObjectUtils.getObject('map', this.appEngine.jsonObjectRoot);

        this.movingObjectEatBlueBullet(behaviorObject, mapObject, modelModifications);
        this.robotObjectEatBlueBullet(behaviorObject, mapObject, modelModifications);
    }

    public isDynamicConditionSatisfied():boolean{
        if(this.dynamicCondition){
            return RulesExtensions.calculateDynamicConditionIsTrue(this.appEngine.jsonObjectRoot, this.dynamicCondition);
        }
        return true;
    }

    private movingObjectEatBlueBullet(behaviorObject:any, mapObject:any, modelModifications:ModelModificationsCollection){
        const movingObjectPosition = RulesExtensions.getMovingObjectPosition(behaviorObject, modelModifications, true);
        if(!movingObjectPosition) {return;}
        const blueBulletObject = RulesExtensions.searchBlueBulletObject(mapObject, movingObjectPosition);
        if(!blueBulletObject) {return;}
        blueBulletObject[Constants.Rules.BlueBulletsAreEaten.BlockVisiblePropertyName] = false;

        if(Constants.enableLogs) console.log(`... BlueBulletsAreEaten: moving object eats a blue bullet.`);
        this.appEngine.guiManager.removeObject(
            movingObjectPosition, 
            Constants.Gui.Objects.BlueBullet.Name);
        this.packmanService.increaseMovingObjectPoints(1);
        this.jsonObject[Constants.Rules.BlueBulletsAreEaten.Points] = this.packmanService.getMovingObjectPoints();
    }

    private robotObjectEatBlueBullet(behaviorObject:any, mapObject:any, modelModifications:ModelModificationsCollection){
        const robotPosition = RulesExtensions.getRobotObjectPosition(behaviorObject, modelModifications, true);
        if(!robotPosition) {return;}
        const blueBulletObject = RulesExtensions.searchBlueBulletObject(mapObject, robotPosition);
        if(!blueBulletObject) {return;}
        blueBulletObject[Constants.Rules.BlueBulletsAreEaten.BlockVisiblePropertyName] = false;

        if(Constants.enableLogs) console.log(`... BlueBulletsAreEaten: robot object eats a blue bullet.`);
        this.appEngine.guiManager.removeObject(
            robotPosition, 
            Constants.Gui.Objects.BlueBullet.Name);
        this.packmanService.increaseRobotPoints(1);
    }
}
