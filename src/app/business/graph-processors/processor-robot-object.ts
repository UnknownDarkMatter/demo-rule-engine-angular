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
import { DelayClock } from '../../services/delay-clock';
import { MoveModelModificationPayload } from"../models/object-move/move-model-modification-payload";
import { ObjectMoving } from"../models/object-move/object-moving";
import { ModelModificationsCollection } from"../models/model-notifications-collection";
import { ProgramaticMove } from"../models/object-move/programatic-move";


export class ProcessorRobotObject implements ProcessorGeneric {
   
    public jsonObject:any;
    public appEngine:AppEngine;
    public position:ObjectPosition;
    public moves:ProgramaticMove[] = [];
    private moveInProgressCount:number = 0;
    private isStopped:boolean = false;

    constructor(jsonObject:any, appEngine:AppEngine){
        this.appEngine = appEngine;
        this.jsonObject = jsonObject;
        this.jsonObject[Constants.Processors.RobotObject.NamePropertyOnJson] = Constants.Processors.RobotObject.Name;
        this.initPositionFromJsonObject();
        this.initGoToFromJsonObject();
    }

 
    public calculateNotificationResponse(notification:EngineNotification):NotificationResponse|null {
        if((notification.notificationKey === Constants.Notifications.RobotObjectMove.NotificationKey) && notification.payload){
            if(Constants.enableLogs) console.log(`ProcessorRobotObject: has been notified and return a response : ${notification.notificationFriendlyName}`);
            return new NotificationResponse(notification);
        }
    }


    public start(){
        this.isStopped = false;
        this.executeNextMoves();
    }

    public stop(){
        this.isStopped = true;
    }

    public applyModelModification(modelModifications:ModelModificationsCollection){
        for(let modelModification of modelModifications.modelModifications){
            if(modelModification.modelModificationKey !== Constants.ModelModifications.MoveRobotObject.ModelModificationKey) { return; }
            const payloadTyped = modelModification.payload as MoveModelModificationPayload;
            let oldPosition = this.jsonObject[Constants.Processors.RobotObject.Position];
            this.appEngine.guiManager.moveObject(
                new ObjectMoving(oldPosition, payloadTyped.newPosition), 
                Constants.Gui.BehaviorObjects.RobotObject.ObjectType);
            this.jsonObject[Constants.Processors.RobotObject.Position] = payloadTyped.newPosition;
            this.jsonObject.position = `${payloadTyped.newPosition.x},${payloadTyped.newPosition.y}`;
        }
    }

    private initPositionFromJsonObject(){
        const posAsString:string = this.jsonObject.position;
        const x = posAsString.split(',')[0];
        const y = posAsString.split(',')[1]; 
        const position = new ObjectPosition(Convert.toNumber(x), Convert.toNumber(y));
        this.jsonObject[Constants.Processors.RobotObject.Position] = position;
    }

    private initGoToFromJsonObject(){
        if(!this.jsonObject.childs) { return; }

        for(let child of this.jsonObject.childs){
            if(child.name !== Constants.Processors.RobotObject.MoveGoTo.Name){
                continue;
            }
    
            let repeat = Convert.toNumber(child.repeat);
            let waitMilliseconds = Convert.toNumber(child[Constants.Processors.RobotObject.MoveGoTo.WaitMilliSeconds]);
            let direction = Convert.stringToDirection(child.direction);
            this.moves.push(new ProgramaticMove(repeat, direction, waitMilliseconds));
        }
    }


    private executeNextMoves(){
        if(this.isStopped) {return;}
        if(this.moveInProgressCount > 0 || this.moves.length <= 0) {
            setTimeout(() => this.executeNextMoves(), 50);
            return;
        }
        this.moveInProgressCount = this.moves[0].repeat;
        this.executeNextMoveRepeat();
    }

    private executeNextMoveRepeat(){
        if(this.isStopped) {return;}
        let callback:Promise<ProcessorRobotObject> = new Promise<ProcessorRobotObject>(resolve => {
            setTimeout(() => resolve(this), this.moves[0].waitMilliSeconds);}
        );
        callback.then(_self => {
            if(this.isStopped) {return;}
            this.executeMove(this.moves[0]);
            this.moveInProgressCount--;
            if(this.moveInProgressCount>0){
                this.executeNextMoveRepeat();
            }
            else
            {
                if(this.moves.length === 1){
                    this.moves= [];
                } else {
                    this.moves = this.moves.slice(1, this.moves.length);
                }
                this.executeNextMoves();
            }
        });
    }

    private executeMove(move:ProgramaticMove){
        if(this.isStopped) {return;}
        let parent = this.jsonObject[Constants.JsonObject.Parent.Name];
        const moveNotification = this.createProgramaticMoveNotification(move);
        const notification = new EngineNotification(
            Constants.Notifications.RobotObjectMove.NotificationKey, 
            moveNotification,
            this.jsonObject.name,
            Constants.Notifications.RobotObjectMove.FriendlyName);
        this.appEngine.jsonObjectSendNotification(parent, notification);
    }

    private createProgramaticMoveNotification(move:ProgramaticMove):MoveNotification|null
    {
        const position = this.jsonObject[Constants.Processors.RobotObject.Position];
        return new MoveNotification(position, move.direction);
    }


}
