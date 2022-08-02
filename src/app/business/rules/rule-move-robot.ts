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

export class RuleMoveRobot implements RuleGeneric {
    public jsonObject:any;
    public appEngine:AppEngine;
    public ruleFriendlyName:string = "RuleMoveRobot";

    constructor(jsonObject:any, appEngine:AppEngine){
        this.appEngine = appEngine;
        this.jsonObject = jsonObject;
    }
    
    public calculateModelModificationsOnNotificationResponses(
        notificationResponses:NotificationResponse[], modelModifications:ModelModificationsCollection){
        if(Constants.enableLogs) console.log(`RuleMoveRobot: calculating the model modifications ...`);
        let modelModification: ModelModification | null = null;
        for(let notificationResponse of notificationResponses){
            if(notificationResponse.notification.notificationKey === Constants.Notifications.RobotObjectMove.NotificationKey){
                const moveNotification = notificationResponse.notification.payload as MoveNotification;
                switch(moveNotification.direction){
                    case MoveDirection.Up:{
                        let y = moveNotification.position.y - 1;
                        let x = moveNotification.position.x;
                        const payload = new MoveModelModificationPayload(new ObjectPosition(x, y));
                        modelModification = new ModelModification(Constants.ModelModifications.MoveRobotObject.ModelModificationKey, payload);
                        break;
                    }
                    case MoveDirection.Down:{
                        let y = moveNotification.position.y + 1;
                        let x = moveNotification.position.x;
                        const payload = new MoveModelModificationPayload(new ObjectPosition(x, y));
                        modelModification = new ModelModification(Constants.ModelModifications.MoveRobotObject.ModelModificationKey, payload);
                        break;
                    }
                    case MoveDirection.Left:{
                        let y = moveNotification.position.y;
                        let x = moveNotification.position.x - 1;
                        const payload = new MoveModelModificationPayload(new ObjectPosition(x, y));
                        modelModification = new ModelModification(Constants.ModelModifications.MoveRobotObject.ModelModificationKey, payload);
                        break;
                    }
                    case MoveDirection.Right:{
                        let y = moveNotification.position.y;
                        let x = moveNotification.position.x + 1;
                        const payload = new MoveModelModificationPayload(new ObjectPosition(x, y));
                        modelModification = new ModelModification(Constants.ModelModifications.MoveRobotObject.ModelModificationKey, payload);
                        break;
                    }
                    default:{
                        break;
                    }
                }
            }
        }
        if(modelModification){
            if(Constants.enableLogs) console.log(`RuleMoveRobot: moving the robot.`);
            modelModifications.modelModifications.push(modelModification);
        }
    }


    public isDynamicConditionSatisfied():boolean{
        return true;
    }
}
