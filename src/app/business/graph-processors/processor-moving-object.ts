import { AppEngine } from"../app-engine";
import { Constants } from"../constants";
import { EngineNotification } from"../models/engine-notification";
import { EventKeyPress, KeyPressKeyCodesEnum } from"../models/event-keypress";
import { ModelModification } from"../models/model-modification";
import { NotificationResponse } from"../models/notification-response";
import { ProcessorGeneric } from"./processor-generic";
import { ObjectPosition } from"../models/object-move/object-position";
import { MoveNotification } from"../models/object-move/move-notification";
import { Convert } from "../../services/convert";
import { MoveDirection } from"../models/object-move/move-direction";
import { MoveModelModificationPayload } from"../models/object-move/move-model-modification-payload";
import { ObjectMoving } from"../models/object-move/object-moving";
import { ModelModificationsCollection } from"../models/model-notifications-collection";


export class ProcessorMovingObject implements ProcessorGeneric {
   
    public jsonObject:any;
    public appEngine:AppEngine;
    public position:ObjectPosition;
    private isStopped:boolean = false;

    constructor(jsonObject:any, appEngine:AppEngine){
        this.appEngine = appEngine;
        this.jsonObject = jsonObject;
        this.jsonObject[Constants.Processors.MovingObject.NamePropertyOnJson] = Constants.Processors.MovingObject.Name;
        this.initPositionFromJsonObject();
        appEngine.guiEventKeyPressSubject.subscribe(keyPressEvent => {
            this.onKeyPressGuiEvent(keyPressEvent);
        });
    }
 
    public calculateNotificationResponse(notification:EngineNotification):NotificationResponse|null {
        if((notification.notificationKey === Constants.Notifications.MovingObjectMove.NotificationKey) && notification.payload){
            if(Constants.enableLogs) console.log(`ProcessorMovingObject: has been notified and return a response : ${notification.notificationFriendlyName}`);
            return new NotificationResponse(notification);
        }
        return null;
    }

    public start(){
        this.isStopped = false;
    }
   
    public stop(){
        this.isStopped = true;
    }

    private onKeyPressGuiEvent(keyPressEvent:EventKeyPress){
        if(this.isStopped) { return; }
        let parent = this.jsonObject[Constants.JsonObject.Parent.Name];
        const moveNotification = this.createMoveNotification(keyPressEvent);
        const notification = new EngineNotification(
            Constants.Notifications.MovingObjectMove.NotificationKey, 
            moveNotification,
            this.jsonObject.name,
            Constants.Notifications.MovingObjectMove.FriendlyName);
        this.appEngine.jsonObjectSendNotification(parent, notification);
    }

    public applyModelModification(modelModifications:ModelModificationsCollection){
        for(let modelModification of modelModifications.modelModifications){
            if(modelModification.modelModificationKey !== Constants.ModelModifications.MoveMovingObject.ModelModificationKey) { return; }
            const payloadTyped = modelModification.payload as MoveModelModificationPayload;
            let oldPosition = this.jsonObject[Constants.Processors.MovingObject.Position];
            this.appEngine.guiManager.moveObject(
                new ObjectMoving(oldPosition, payloadTyped.newPosition), 
                Constants.Gui.BehaviorObjects.MovingObject.ObjectType);
            this.jsonObject[Constants.Processors.MovingObject.Position] = payloadTyped.newPosition;
            this.jsonObject.position = `${payloadTyped.newPosition.x},${payloadTyped.newPosition.y}`;
        }
    }

    private initPositionFromJsonObject(){
        const posAsString:string = this.jsonObject.position;
        const x = posAsString.split(',')[0];
        const y = posAsString.split(',')[1]; 
        const position = new ObjectPosition(Convert.toNumber(x), Convert.toNumber(y));
        this.jsonObject[Constants.Processors.MovingObject.Position] = position;
    }

    private createMoveNotification(keyPressEvent:EventKeyPress):MoveNotification|null
    {
        const position = this.jsonObject[Constants.Processors.MovingObject.Position];
        switch(keyPressEvent.KeyCode){
            case KeyPressKeyCodesEnum.Up:{
                return new MoveNotification(position, MoveDirection.Up);
            }
            case KeyPressKeyCodesEnum.Down:{
                return new MoveNotification(position, MoveDirection.Down);
            }
            case KeyPressKeyCodesEnum.Left:{
                return new MoveNotification(position, MoveDirection.Left);
            }
            case KeyPressKeyCodesEnum.Right:{
                return new MoveNotification(position, MoveDirection.Right);
            }
            default:{
                return null;
            }
        }
    }

}
