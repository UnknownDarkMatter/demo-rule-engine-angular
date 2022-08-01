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

export class RuleNoMoveOnFilledBlocks implements RuleGeneric {
    public jsonObject:any;
    public appEngine:AppEngine;
    public ruleFriendlyName:string = "RuleNoMoveOnFilledBlocks";

    constructor(jsonObject:any, appEngine:AppEngine){
        this.appEngine = appEngine;
        this.jsonObject = jsonObject;
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
}
