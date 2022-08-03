import { AppEngine } from"../app-engine";
import { RuleGeneric } from"./rule-generic";
import { NotificationResponse } from"../models/notification-response";
import { ModelModification } from"../models/model-modification";
import { MoveModelModificationPayload } from"../models/object-move/move-model-modification-payload";
import { Constants } from"../constants";
import { MoveNotification } from"../models/object-move/move-notification";
import { MoveDirection } from"../models/object-move/move-direction";
import { ObjectPosition } from"../models/object-move/object-position";
import { ModelModificationsCollection } from"../models/model-notifications-collection";
import { LogicalConditionInterface } from "../models/logical-condition-interface";
import { RulesExtensions } from "../packman/rules-extensions";

export class RuleNoMoveOnFilledBlocks implements RuleGeneric {
    public jsonObject:any;
    public appEngine:AppEngine;
    public ruleFriendlyName:string = "RuleNoMoveOnFilledBlocks";
    public dynamicCondition:LogicalConditionInterface|null;

    constructor(jsonObject:any, appEngine:AppEngine, dynamicCondition:LogicalConditionInterface|null){
        this.appEngine = appEngine;
        this.jsonObject = jsonObject;
        this.dynamicCondition = dynamicCondition;
    }
    
    public calculateModelModificationsOnNotificationResponses(
        notificationResponses:NotificationResponse[], modelModifications:ModelModificationsCollection){
        if(Constants.enableLogs) console.log(`RuleNoMoveOnFilledBlocks: calculating the model modifications ...`);
        let modelModification: ModelModification | null = null;
        for(let modelModification of modelModifications.modelModifications){
            if(modelModification.modelModificationKey === Constants.ModelModifications.MoveMovingObject.ModelModificationKey){
                let moveModelModificationPayload = modelModification.payload as MoveModelModificationPayload;
                if(modelModifications.objectsMap.objects
                    .filter(m => m.objectType === Constants.Gui.Objects.FilledBlock.Name
                        && m.position.toString() === moveModelModificationPayload.newPosition.toString())
                    .length>0)
                { 
                    if(Constants.enableLogs) console.log(`... RuleNoMoveOnFilledBlocks: cancel the move because it is on a filled block.`);
                    modelModifications.modelModifications = modelModifications.modelModifications
                    .filter(m=>m.modelModificationKey !== Constants.ModelModifications.MoveMovingObject.ModelModificationKey);
                }
            }
        }
    }

    public isDynamicConditionSatisfied():boolean{
        if(this.dynamicCondition){
            return RulesExtensions.calculateDynamicConditionIsTrue(this.appEngine.jsonObjectRoot, this.dynamicCondition);
        }
        return true;
    }
}
