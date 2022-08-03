import { ObjectPosition } from '../models/object-move/object-position';
import { ModelModificationsCollection } from"../models/model-notifications-collection";
import { MoveModelModificationPayload } from"../models/object-move/move-model-modification-payload";
import { Constants } from"../constants";
import { Convert } from 'src/app/services/convert';
import { LogicalConditionInterface } from '../models/logical-condition-interface';

export class RulesExtensions {

    public static getMovingObjectPosition(rootJsonObject:any, 
        modelModifications:ModelModificationsCollection, includeNewPosition:boolean):ObjectPosition |null {
        if(includeNewPosition){
            for(let modelModification of modelModifications.modelModifications){
                if(modelModification.modelModificationKey === Constants.ModelModifications.MoveMovingObject.ModelModificationKey){
                    let moveModelModificationPayload = modelModification.payload as MoveModelModificationPayload;
                    return moveModelModificationPayload.newPosition;
                }
            }
            }
        return this.searchMovingObjectPosition(rootJsonObject);
    }

    public static getRobotObjectPosition(rootJsonObject:any, 
        modelModifications:ModelModificationsCollection, includeNewPosition:boolean):ObjectPosition |null {
        if(includeNewPosition){
            for(let modelModification of modelModifications.modelModifications){
                if(modelModification.modelModificationKey === Constants.ModelModifications.MoveRobotObject.ModelModificationKey){
                    let moveModelModificationPayload = modelModification.payload as MoveModelModificationPayload;
                    return moveModelModificationPayload.newPosition;
                }
            }
        }
        return this.searchRobotObjectPosition(rootJsonObject);
    }

    public static searchBlueBulletObject(jsonObject:any, position:ObjectPosition):any
    {
        if(this.isBlueBulletInPositionAndVisible(jsonObject,position)){
            return jsonObject;
        }
        if(!jsonObject.childs) { return null;}
        for(let child of jsonObject.childs){
            let foundObject = this.searchBlueBulletObject(child,position);
            if(foundObject){
                return foundObject;
            }
        }
        return null;
    }

    public static calculateDynamicConditionIsTrue(rootJsonObject:any, condition:LogicalConditionInterface):boolean{
        if(!condition){ return true;}
        return this.isDynamicConditionSatisfied(rootJsonObject, condition);
    }

    public static searchRaspberryObject(jsonObject:any, position:ObjectPosition):any
    {
        if(this.isRaspberryInPosition(jsonObject,position)){
            return jsonObject;
        }
        if(!jsonObject.childs) { return null;}
        for(let child of jsonObject.childs){
            let foundObject = this.searchRaspberryObject(child,position);
            if(foundObject){
                return foundObject;
            }
        }
        return null;
    }
    public static isDynamicConditionSatisfied(jsonObject:any, condition:LogicalConditionInterface):boolean
    {
        if(condition.isTrue(jsonObject)){
            return true;
        }
        if(!jsonObject.childs) { return null;}
        for(let child of jsonObject.childs){
            let isSatisfied = this.isDynamicConditionSatisfied(child,condition);
            if(isSatisfied){
                return true;
            }
        }
        return false;
    }

    private static searchMovingObjectPosition(jsonObject:any):ObjectPosition |null{
        let position = null;
        const objectName = jsonObject[Constants.Processors.MovingObject.NamePropertyOnJson];
        if(objectName && objectName === Constants.Processors.MovingObject.Name) {
            position = jsonObject[Constants.Processors.MovingObject.Position];
            if(position){
                return position;
            }
        }

        if(!jsonObject.childs) { return null;}
        for(let child of jsonObject.childs){
            position = this.searchMovingObjectPosition(child);
            if(position){
                return position;
            }
        }
        return null;
    }

    private static searchRobotObjectPosition(jsonObject:any):ObjectPosition |null{
        let position = null;
        const objectName = jsonObject[Constants.Processors.RobotObject.NamePropertyOnJson];
        if(objectName && objectName === Constants.Processors.RobotObject.Name) {
            position = jsonObject[Constants.Processors.RobotObject.Position];
            if(position){
                return position;
            }
        }
        
        if(!jsonObject.childs) { return null;}
        for(let child of jsonObject.childs){
            position = this.searchRobotObjectPosition(child);
            if(position){
                return position;
            }
        }
        return null;
    }

    private static isBlueBulletInPositionAndVisible(jsonObject:any, position:ObjectPosition):boolean{
        if(!jsonObject.position) {return false;}
        const x = Convert.toNumber(jsonObject.position.toString().split(',')[0]);
        const y = Convert.toNumber(jsonObject.position.toString().split(',')[1]);
        if(position.x !== x || position.y !== y) { return false; }
        let isVisible = jsonObject[Constants.Rules.BlueBulletsAreEaten.BlockVisiblePropertyName];
        if(!isVisible) {return false;}

        return true;
    }

    private static isRaspberryInPosition(jsonObject:any, position:ObjectPosition):boolean{
        if(!jsonObject.position) {return false;}
        const x = Convert.toNumber(jsonObject.position.toString().split(',')[0]);
        const y = Convert.toNumber(jsonObject.position.toString().split(',')[1]);
        if(position.x !== x || position.y !== y) { return false; }
        let hasRaspberry = jsonObject[Constants.Rules.RaspBerryShow.HasRaspberry];
        if(!hasRaspberry) {return false;}

        return true;
    }

}

