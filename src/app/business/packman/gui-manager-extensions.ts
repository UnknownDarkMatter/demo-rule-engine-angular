import { Subject } from 'rxjs';
import { Convert } from '../../services/convert';
import { Constants } from '../constants';
import { GuiAction } from '../models/gui-action';

export class GuiManagerExtensions {

    public static shouldCreateFilledBlock(emptyBlocks:any,x:number, y:number):boolean {
        for(let emptyBlock of emptyBlocks){
            const emptyBlockX = Convert.toNumber(emptyBlock.position.toString().split(',')[0]);
            const emptyBlockY = Convert.toNumber(emptyBlock.position.toString().split(',')[1]);
            if(emptyBlockX === x && emptyBlockY === y){
                return false;
            }
        }
        return true;
    }

    public static initProgrammaticallyAddedObjects(jsonObject:any, guiUpdateSubject:Subject<GuiAction>){
        if(jsonObject.name === Constants.MapItems.EmptyBlock.name 
            && jsonObject[Constants.Rules.BlueBulletsAreEaten.MapBlockAttributeName]){
            const x = Convert.toNumber(jsonObject.position.toString().split(',')[0]);
            const y = Convert.toNumber(jsonObject.position.toString().split(',')[1]);
            guiUpdateSubject.next({'action':Constants.Gui.Actions.Create, 'object':Constants.Gui.Objects.BlueBullet.Name, 'position':`${x},${y}`});
            jsonObject[Constants.Rules.BlueBulletsAreEaten.BlockVisiblePropertyName] = true;
        }
        if(jsonObject.name === Constants.Gui.BehaviorObjects.MovingObject.Name){
            const x = Convert.toNumber(jsonObject.position.toString().split(',')[0]);
            const y = Convert.toNumber(jsonObject.position.toString().split(',')[1]);
            guiUpdateSubject.next({'action':Constants.Gui.Actions.Create, 'object':Constants.Gui.BehaviorObjects.MovingObject.ObjectType, 'position':`${x},${y}`});
        }
        if(jsonObject.name === Constants.Gui.BehaviorObjects.RobotObject.Name){
            const x = Convert.toNumber(jsonObject.position.toString().split(',')[0]);
            const y = Convert.toNumber(jsonObject.position.toString().split(',')[1]);
            guiUpdateSubject.next({'action':Constants.Gui.Actions.Create, 'object':Constants.Gui.BehaviorObjects.RobotObject.ObjectType, 'position':`${x},${y}`});
        }

        if(!jsonObject.childs) { return; }
        for(let child of jsonObject.childs){
            this.initProgrammaticallyAddedObjects(child, guiUpdateSubject);
        }
    }


}