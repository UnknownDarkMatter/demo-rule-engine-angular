import { AppEngine } from"../app-engine";
import { EngineNotification } from"../models/engine-notification";
import { ModelModification } from"../models/model-modification";
import { ModelModificationsCollection } from"../models/model-notifications-collection";
import { NotificationResponse } from"../models/notification-response";

export class ProcessorGeneric {
    public jsonObject:any;
    public appEngine:AppEngine;

    public calculateNotificationResponse(notification:EngineNotification):NotificationResponse|null{
        return null;
    }

    public applyModelModification(modelModifications:ModelModificationsCollection){
        
    }

    public start(){
        
    }

    public stop(){
        
    }
}