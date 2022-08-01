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
import { JsonObjectUtils } from"src/app/services/json-object-utils";
import { Convert } from"src/app/services/convert";

export class RuleMoveInsideBorders implements RuleGeneric {
    public jsonObject:any;
    public appEngine:AppEngine;
    public ruleFriendlyName:string = "RuleMoveInsideBorders";

    constructor(jsonObject:any, appEngine:AppEngine){
        this.appEngine = appEngine;
        this.jsonObject = jsonObject;
    }
    
    public calculateModelModificationsOnNotificationResponses(
        notificationResponses:NotificationResponse[], modelModifications:ModelModificationsCollection){
            if(Constants.enableLogs) console.log(`RuleMoveInsideBorders: calculating the model modifications ...`);
        const mapObject = JsonObjectUtils.getObject('map', this.appEngine.jsonObjectRoot);
        const sizeX = Convert.toNumber(mapObject.size.toString().split(',')[0]);
        const sizeY = Convert.toNumber(mapObject.size.toString().split(',')[1]);
        for(let modelModification of modelModifications.modelModifications){
            if(modelModification.modelModificationKey === Constants.ModelModifications.MoveMovingObject.ModelModificationKey){
                let moveModelModificationPayload = modelModification.payload as MoveModelModificationPayload;
                if(!moveModelModificationPayload.newPosition.isInsideLimits(1, 1, sizeX, sizeY))
                { 
                    modelModifications.modelModifications = modelModifications.modelModifications
                    .filter(m=>m.modelModificationKey !== Constants.ModelModifications.MoveMovingObject.ModelModificationKey);
                    if(Constants.enableLogs) console.log(`... RuleMoveInsideBorders: cancelling move because not inside borders.`);
                }
            }
        }
    }
}
