import { Injectable } from"@angular/core";
import { Subject } from"rxjs";
import { EventKeyPress } from './models/event-keypress'
import { EngineNotification } from './models/engine-notification'
import { JsonObjectUtils } from"../services/json-object-utils";
import { Constants } from"./constants";
import { NotificationResponse } from"./models/notification-response";
import { ModelModification } from"./models/model-modification";
import { GuiManager } from"./gui-manager";
import { ObjectsMap } from './models/object-move/objects-map'
import { MapObject } from './models/object-move/map-object'
import { Convert } from "../services/convert";
import { ObjectPosition } from "./models/object-move/object-position";
import { ModelModificationsCollection } from './models/model-notifications-collection'
import { AppEngineExtensions } from './packman/app-engine-extensions';
import { RuleGeneric } from "./rules/rule-generic";
import { ProcessorGeneric } from "./graph-processors/processor-generic";

@Injectable()
export class AppEngine {

	public guiEventKeyPressSubject:Subject<EventKeyPress> = new Subject<EventKeyPress>();
    public isGuiBuilded:boolean = false;
    public jsonObjectRoot:any;
    public guiManager:GuiManager;
    private notifications:EngineNotification[] = [];
    private notificationResponses:NotificationResponse[] = [];
    
    constructor(){
    }
    
    public jsonObjectSendNotification(jsonObject:any, notification:EngineNotification){
        if(Constants.enableLogs) console.log(`AppEngine: ${notification.emitterFriendlyName} bubbles the notification ${notification.notificationFriendlyName}`);
        if(JsonObjectUtils.isRoot(jsonObject)) {
            if(Constants.enableLogs) console.log(`AppEngine: json root got the notification. Notify all the tree ...`);
            this.notifications.push(notification);
            this.processNotifications();
            return;
        }
        let processor = jsonObject[Constants.JsonObject.Processor.Name];
        if(!processor) {
            let parent = jsonObject[Constants.JsonObject.Parent.Name];
            this.jsonObjectSendNotification(parent, notification);       
        } 
    }

    public startGame(){
        const rules = JsonObjectUtils.getObject('rules', this.jsonObjectRoot);
        this.dumpRules(rules, 1);
        if(Constants.enableLogs) console.log(`AppEngine:game starts ...`);
        this.startBehaviorObjects(this.jsonObjectRoot);
    }

    public stopGame(){
        if(Constants.enableLogs) console.log(`AppEngine:game stopped`);
        this.stopBehaviorObjects(this.jsonObjectRoot);
    }

    private startBehaviorObjects(jsonObject:any){
        let ruleProcessor = jsonObject[Constants.JsonObject.Processor.Name];
        if(ruleProcessor && ruleProcessor.start){ 
            ruleProcessor.start();
        }

        if(!jsonObject.childs) { return;}
        for(let child of jsonObject.childs){
            this.startBehaviorObjects(child);
        }
    }

    private stopBehaviorObjects(jsonObject:any){
        let ruleProcessor = jsonObject[Constants.JsonObject.Processor.Name];
        if(ruleProcessor && ruleProcessor.stop){ 
            ruleProcessor.stop();
        }

        if(!jsonObject.childs) { return;}
        for(let child of jsonObject.childs){
            this.stopBehaviorObjects(child);
        }
    }

    private processNotifications(){
        if(this.notifications.length <= 0) {return;}
        this.processNotification(this.notifications[0]);
        if(this.notifications.length === 1){
            this.notifications= [];
        } else {
            this.notifications = this.notifications.slice(1, this.notifications.length);
        }
    }

    private processNotification(notification:EngineNotification){
        this.notificationResponses = [];
        this.addNotificationResponse(notification, this.jsonObjectRoot);   
        this.executeRulesOnNotificationResponse();
    }

    private addNotificationResponse(notification:EngineNotification, jsonObject:any){
        let processor = jsonObject[Constants.JsonObject.Processor.Name];
        let notificationResponse = null;
        if(processor && processor.calculateNotificationResponse){
            notificationResponse = (processor as ProcessorGeneric).calculateNotificationResponse(notification);
        }
        if(notificationResponse != null){
            this.notificationResponses.push(notificationResponse);
        }

        if(!jsonObject.childs){ return;}
        for(let child of jsonObject.childs){
            this.addNotificationResponse(notification, child);
        }
    }

    private executeRulesOnNotificationResponse(){
        if(Constants.enableLogs) console.log(`AppEngine: execute rules with all the notification responses ...`);
        const objectMap = AppEngineExtensions.initializeObjectsMapFromMap(this.jsonObjectRoot);
        AppEngineExtensions.addMapObjectToObjectMapFromJsonObjects(objectMap, this.jsonObjectRoot);
        const rules = JsonObjectUtils.getObject('rules', this.jsonObjectRoot);
        let modelModifications=new ModelModificationsCollection([], objectMap);
        this.getModelModificationsFromRules(rules, modelModifications);
        if(Constants.enableLogs) console.log(`AppEngine: applying the model modifications ...`);
        this.applyModelModifications(modelModifications, this.jsonObjectRoot);
    }

    private getModelModificationsFromRules(jsonObject:any, modelModifications:ModelModificationsCollection)//same algo as dumpRules
    {
        if(!jsonObject.childs)
        { 
            modelModifications = this.getModelModificationsFromRule(jsonObject, modelModifications);
            return;
        }

        let i = 0;
        for(let child of jsonObject.childs){
            this.getModelModificationsFromRules(child, modelModifications);
            i++;
            if(i === jsonObject.childs.length){
                modelModifications = this.getModelModificationsFromRule(jsonObject, modelModifications);
            }
        }

   }

   private dumpRules(jsonObject:any, identation:number)//same algo as getModelModificationsFromRules
   {
        const identationMultiply=3;
        if(!jsonObject.childs)
        { 
            if(Constants.enableLogs) console.log(`AppEngine : will execute rule starting from the most at right here : ${''.padStart(identation*identationMultiply, '  ')} ${jsonObject.name}, processor:${jsonObject[Constants.JsonObject.Processor.Name]}`);
            return;
        }

        let i = 0;
        for(let child of jsonObject.childs){
            this.dumpRules(child, identation+1);
            i++;
            if(i === jsonObject.childs.length){
                if(Constants.enableLogs) console.log(`AppEngine : will execute rule starting from the most at right here : ${''.padStart(identation*identationMultiply, '  ')} ${jsonObject.name}, processor:${jsonObject[Constants.JsonObject.Processor.Name]}`);
            }
        }

    }

   private getModelModificationsFromRule(jsonObject:any, modelModifications:ModelModificationsCollection){
        let ruleProcessor = jsonObject[Constants.JsonObject.Processor.Name];
        if(!ruleProcessor){ return ; }
        if(!ruleProcessor.calculateModelModificationsOnNotificationResponses) { 
            if(Constants.enableLogs) console.log(`AppEngine: calling getModelModificationsFromRule on a weird rule ${ruleProcessor.name}.`);
            return;
        }
        const ruleProcessosTyped = (ruleProcessor as RuleGeneric);
        if(Constants.enableLogs) console.log(`AppEngine: calling calculateModelModificationsOnNotificationResponses on rule ${ruleProcessosTyped.ruleFriendlyName}.`);
        ruleProcessosTyped.calculateModelModificationsOnNotificationResponses(this.notificationResponses, modelModifications);
        return modelModifications;
   }

   private applyModelModifications(modelModifications:ModelModificationsCollection, jsonObject:any){
        let processor = jsonObject[Constants.JsonObject.Processor.Name];
        if(processor && processor.applyModelModification){
            processor.applyModelModification(modelModifications);
        }
 
        if(!jsonObject.childs){ return;}
        for(let child of jsonObject.childs){
            this.applyModelModifications(modelModifications, child);
        }
   }




}