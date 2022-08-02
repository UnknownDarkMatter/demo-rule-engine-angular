import { AppEngine } from"../app-engine";
import { NotificationResponse } from"../models/notification-response";
import { ModelModification } from"../models/model-modification";
import { ModelModificationsCollection } from"../models/model-notifications-collection";

export class RuleGeneric {
    public jsonObject:any;
    public appEngine:AppEngine;
    public ruleFriendlyName:string = "RuleGeneric";

    public calculateModelModificationsOnNotificationResponses(
        notificationResponses:NotificationResponse[], 
        modelModifications:ModelModificationsCollection){

    }

    public isDynamicConditionSatisfied():boolean{
        return true;
    }
}